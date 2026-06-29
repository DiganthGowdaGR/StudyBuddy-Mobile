import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStudyStore } from '@/store/useStudyStore';
import { Flashcard } from '@/types/study';
import { ScreenContainer, Typography, Input, Button, Header, Icon } from '@/components/ui';

export default function FlashcardsCreateScreen() {
  const router = useRouter();
  const decks = useStudyStore((state) => state.decks);
  const addFlashcard = useStudyStore((state) => state.addFlashcard);
  const incrementCardCount = useStudyStore((state) => state.incrementCardCount);

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [hint, setHint] = useState('');
  const [selectedDeckId, setSelectedDeckId] = useState(decks[0]?.id || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!selectedDeckId) {
      setError('Please select a card deck');
      return;
    }
    if (!front.trim()) {
      setError('Please fill in the card question (front)');
      return;
    }
    if (!back.trim()) {
      setError('Please fill in the card answer (back)');
      return;
    }
    
    setError('');
    setLoading(true);

    setTimeout(() => {
      const newCard: Flashcard = {
        id: Math.random().toString(36).substring(7),
        deckId: selectedDeckId,
        front: front.trim(),
        back: back.trim(),
        aiHint: hint.trim() || undefined,
        box: 1,
      };

      addFlashcard(newCard);
      incrementCardCount(selectedDeckId);
      setLoading(false);
      router.back();
    }, 1000);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <ScreenContainer safeArea={false} className="bg-white dark:bg-secondary-950 flex-1">
      <Header
        title="Create Card"
        rightAction={
          <Pressable
            onPress={handleClose}
            className="p-2 rounded-full active:bg-secondary-100 dark:active:bg-secondary-900 justify-center items-center"
          >
            <Icon name="X" size={20} color="#64748b" />
          </Pressable>
        }
      />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5 gap-5">
        <View>
          <Typography variant="label" className="mb-2.5">Select Deck</Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 py-0.5 gap-2">
            {decks.map((deck) => {
              const isSelected = selectedDeckId === deck.id;
              return (
                <Pressable
                  key={deck.id}
                  onPress={() => setSelectedDeckId(deck.id)}
                  className={`mr-2.5 px-4 py-2.5 rounded-xl border active:scale-95 ${
                    isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' : 'border-secondary-200 dark:border-secondary-800'
                  }`}
                >
                  <Typography variant="bodySm" className={isSelected ? 'text-primary-500 font-bold' : 'font-medium'}>
                    {deck.title}
                  </Typography>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <Input
          label="Front side (Question)"
          placeholder="e.g. What is gradient descent?"
          value={front}
          onChangeText={setFront}
          error={error && !front ? error : ''}
          multiline
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />

        <Input
          label="Back side (Answer)"
          placeholder="e.g. An optimization algorithm to minimize cost function..."
          value={back}
          onChangeText={setBack}
          error={error && !back ? error : ''}
          multiline
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />

        <Input
          label="AI Hint (Optional)"
          placeholder="e.g. Think of adjusting recipe ingredients..."
          value={hint}
          onChangeText={setHint}
          leftIcon={<Icon name="Sparkles" size={16} color="#64748b" />}
        />

        {error && !front && !back ? (
          <Typography variant="bodySm" color="danger" className="font-semibold">{error}</Typography>
        ) : null}

        <Button
          title="Create Card"
          onPress={handleCreate}
          isLoading={loading}
          className="mt-4 shadow-lg shadow-primary-500/10"
        />
      </ScreenContainer>
    </ScreenContainer>
  );
}
