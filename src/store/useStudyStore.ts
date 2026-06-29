import { create } from 'zustand';
import { StudySession, Deck, Flashcard } from '@/types/study';
import { dbService } from '@/services/dbService';

interface StudyStore {
  sessions: StudySession[];
  decks: Deck[];
  flashcards: Flashcard[];
  activeSession: StudySession | null;
  startSession: (subject: string, mode: StudySession['mode']) => void;
  updateActiveSessionDuration: (seconds: number) => void;
  endSession: (notes?: string) => StudySession | null;
  addSession: (session: StudySession) => void;
  setDecks: (decks: Deck[]) => void;
  addDeck: (deck: Deck) => void;
  addFlashcard: (card: Flashcard) => void;
  incrementCardCount: (deckId: string) => void;
  syncRemoteData: (userId: string) => Promise<void>;
}

export const useStudyStore = create<StudyStore>((set, get) => ({
  sessions: [],
  decks: [],
  flashcards: [],
  activeSession: null,

  startSession: (subject, mode) => {
    const newSession: StudySession = {
      id: Math.random().toString(36).substring(7),
      userId: 'current-user',
      subject,
      durationSeconds: 0,
      xpEarned: 0,
      createdAt: new Date().toISOString(),
      mode,
    };
    set({ activeSession: newSession });
  },

  updateActiveSessionDuration: (seconds) => {
    set((state) => {
      if (!state.activeSession) return state;
      const durationSeconds = state.activeSession.durationSeconds + seconds;
      const xpEarned = Math.floor(durationSeconds / 60);
      return {
        activeSession: {
          ...state.activeSession,
          durationSeconds,
          xpEarned,
        },
      };
    });
  },

  endSession: (notes) => {
    const active = get().activeSession;
    if (!active) return null;

    const finishedSession: StudySession = {
      ...active,
      notes,
    };

    set((state) => ({
      sessions: [finishedSession, ...state.sessions],
      activeSession: null,
    }));

    // Sync Pomodoro study session history to DB
    dbService.createStudySession(finishedSession).catch((e) => {
      console.warn('Session DB sync deferred', e.message);
    });

    return finishedSession;
  },

  addSession: (session) => {
    set((state) => ({ sessions: [session, ...state.sessions] }));
  },

  setDecks: (decks) => set({ decks }),

  addDeck: (deck) => {
    set((state) => ({ decks: [deck, ...state.decks] }));
    
    // Sync new deck to DB
    dbService.createDeck(deck).catch((e) => {
      console.warn('Deck creation DB sync deferred', e.message);
    });
  },

  addFlashcard: (card) => {
    set((state) => ({ flashcards: [...state.flashcards, card] }));

    // Sync new flashcard to DB
    dbService.createFlashcard(card).catch((e) => {
      console.warn('Flashcard creation DB sync deferred', e.message);
    });
  },

  incrementCardCount: (deckId) => {
    set((state) => ({
      decks: state.decks.map((d) =>
        d.id === deckId ? { ...d, cardCount: d.cardCount + 1 } : d
      ),
    }));
  },

  syncRemoteData: async (userId) => {
    try {
      const decks = await dbService.fetchDecks(userId);
      set({ decks });
      
      // Load cards for each deck in background
      for (const deck of decks) {
        const cards = await dbService.fetchFlashcards(deck.id);
        set((state) => {
          // avoid duplicates
          const otherCards = state.flashcards.filter((c) => c.deckId !== deck.id);
          return { flashcards: [...otherCards, ...cards] };
        });
      }
    } catch (e) {
      console.warn('Store remote sync deferred', e);
    }
  },
}));
