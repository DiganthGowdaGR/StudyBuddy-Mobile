import { create } from 'zustand';
import { StudySession, Deck, Flashcard } from '@/types/study';

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

    return finishedSession;
  },

  addSession: (session) => {
    set((state) => ({ sessions: [session, ...state.sessions] }));
  },

  setDecks: (decks) => set({ decks }),

  addDeck: (deck) => {
    set((state) => ({ decks: [deck, ...state.decks] }));
  },

  addFlashcard: (card) => {
    set((state) => ({ flashcards: [...state.flashcards, card] }));
  },

  incrementCardCount: (deckId) => {
    set((state) => ({
      decks: state.decks.map((d) =>
        d.id === deckId ? { ...d, cardCount: d.cardCount + 1 } : d
      ),
    }));
  },
}));
