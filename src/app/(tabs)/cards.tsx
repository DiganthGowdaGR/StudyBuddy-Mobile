import React, { useState } from 'react';
import { View } from 'react-native';
import { ScreenContainer, Typography, Card, Header, Icon, Input, Button } from '@/components/ui';
import { useStudyStore } from '@/store/useStudyStore';

export default function CardsScreen() {
  const [search, setSearch] = useState('');
  const decks = useStudyStore((state) => state.decks);
  const addDeck = useStudyStore((state) => state.addDeck);

  React.useEffect(() => {
    if (decks.length === 0) {
      addDeck({
        id: 'deck-1',
        userId: 'current-user',
        title: 'React Native & TS Architecture',
        description: 'Complete project scaffolding rules and TypeScript patterns.',
        cardCount: 25,
        createdAt: new Date().toISOString(),
      });
      addDeck({
        id: 'deck-2',
        userId: 'current-user',
        title: 'Advanced Neural Networks',
        description: 'Neural weight matrix multiplications, layers, and transformer backpropagation.',
        cardCount: 18,
        createdAt: new Date().toISOString(),
      });
      addDeck({
        id: 'deck-3',
        userId: 'current-user',
        title: 'Spanish Vocabulary - Level B2',
        description: 'Idiomatic expressions, conditional conjugations, and active conversation terms.',
        cardCount: 42,
        createdAt: new Date().toISOString(),
      });
    }
  }, []);

  const filteredDecks = decks.filter((deck) =>
    deck.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-50 dark:bg-secondary-950 flex-1">
      <Header title="Flashcards" />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5">
        <Input
          placeholder="Search flashcard decks..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Icon name="Search" size={18} color="#64748b" />}
        />

        <View className="flex-row justify-between items-center mb-4 mt-2">
          <Typography variant="h3" className="font-bold">My Decks</Typography>
          <Button
            title="Create Deck"
            variant="text"
            size="sm"
            leftIcon={<Icon name="Plus" size={16} color="#8b5cf6" />}
          />
        </View>

        <View className="gap-4">
          {filteredDecks.map((deck) => (
            <Card
              key={deck.id}
              header={deck.title}
              footer={`Created: ${new Date(deck.createdAt).toLocaleDateString()} • Spaced Repetition`}
              className="border border-secondary-100 dark:border-secondary-800"
            >
              <Typography variant="body" color="secondary" className="font-medium text-secondary-500 mb-4 leading-relaxed">
                {deck.description || 'No description provided.'}
              </Typography>

              <View className="flex-row justify-between items-center">
                <Typography variant="bodySm" className="text-primary-500 font-bold">
                  {deck.cardCount} cards in deck
                </Typography>
                
                <Button
                  title="Study Now"
                  size="sm"
                  variant="primary"
                  className="px-4 py-2"
                />
              </View>
            </Card>
          ))}
        </View>
      </ScreenContainer>
    </ScreenContainer>
  );
}
