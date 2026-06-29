export interface StudySession {
  id: string;
  userId: string;
  subject: string;
  durationSeconds: number;
  xpEarned: number;
  createdAt: string;
  notes?: string;
  mode: 'focus' | 'flashcards' | 'quiz' | 'ai-chat';
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  aiHint?: string;
  nextReviewDate?: string;
  box: number; // Leitner box index for spaced repetition
}

export interface Deck {
  id: string;
  userId: string;
  title: string;
  description?: string;
  cardCount: number;
  createdAt: string;
}

export interface AIExplanationRequest {
  topic: string;
  context?: string;
  detailLevel: 'simple' | 'standard' | 'deep';
}

export interface AIExplanationResponse {
  title: string;
  explanation: string;
  keyTakeaways: string[];
  suggestedQuestions: string[];
}
