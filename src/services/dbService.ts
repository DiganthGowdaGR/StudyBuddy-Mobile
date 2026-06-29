import { supabase } from './supabase';
import { User } from '@/types/auth';
import { Deck, Flashcard, StudySession } from '@/types/study';

/**
 * Service to manage Postgres DB operations via Supabase client
 */
export const dbService = {
  /**
   * Sync and update user profile stats (XP, streak, avatar)
   */
  async updateProfile(userId: string, updates: Partial<User>) {
    const dbUpdates = {
      name: updates.name,
      avatar_url: updates.avatarUrl,
      xp: updates.xp,
      streak: updates.streak,
      last_study_date: updates.lastStudyDate,
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.warn('Profile database sync failed, using fallback caches', error.message);
    }
    return data;
  },

  /**
   * Fetch card decks for the active user
   */
  async fetchDecks(userId: string): Promise<Deck[]> {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.warn('Decks fetch failed, using fallback mocks', error.message);
      return [];
    }

    return (data || []).map((d) => ({
      id: d.id,
      userId: d.user_id,
      title: d.title,
      description: d.description,
      cardCount: d.card_count || 0,
      createdAt: d.created_at,
    }));
  },

  /**
   * Add a new card deck to the database
   */
  async createDeck(deck: Deck) {
    const { data, error } = await supabase
      .from('decks')
      .insert({
        id: deck.id,
        user_id: deck.userId,
        title: deck.title,
        description: deck.description,
        card_count: deck.cardCount,
        created_at: deck.createdAt,
      });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch flashcards associated with a specific deck ID
   */
  async fetchFlashcards(deckId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deckId);

    if (error) {
      console.warn('Flashcards fetch failed, using fallback mocks', error.message);
      return [];
    }

    return (data || []).map((c) => ({
      id: c.id,
      deckId: c.deck_id,
      front: c.front,
      back: c.back,
      aiHint: c.ai_hint,
      nextReviewDate: c.next_review_date,
      box: c.box || 1,
    }));
  },

  /**
   * Add a new flashcard to a deck
   */
  async createFlashcard(card: Flashcard) {
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        id: card.id,
        deck_id: card.deckId,
        front: card.front,
        back: card.back,
        ai_hint: card.aiHint,
        next_review_date: card.nextReviewDate,
        box: card.box,
      });

    if (error) throw error;
    return data;
  },

  /**
   * Save a finished study/focus Pomodoro session
   */
  async createStudySession(session: StudySession) {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        id: session.id,
        user_id: session.userId,
        subject: session.subject,
        duration_seconds: session.durationSeconds,
        xp_earned: session.xpEarned,
        created_at: session.createdAt,
        mode: session.mode,
        notes: session.notes,
      });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch active user notebook notes list
   */
  async fetchNotes(userId: string) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.warn('Notes fetch failed, using fallback mocks', error.message);
      return [];
    }

    return data || [];
  },

  /**
   * Create a new notebook note
   */
  async createNote(note: { id: string; userId: string; title: string; content: string; category: string; createdAt: string }) {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        id: note.id,
        user_id: note.userId,
        title: note.title,
        content: note.content,
        category: note.category,
        created_at: note.createdAt,
      });

    if (error) throw error;
    return data;
  },
};
