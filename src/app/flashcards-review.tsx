import React, { useState, useEffect, useRef } from 'react';
import { Pressable, View, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {
  ScreenContainer,
  Typography,
  Card,
  Header,
  Icon,
  ProgressRing,
  Button,
  Badge,
} from '@/components/ui';
import { useAuthStore } from '@/store/useAuthStore';

interface MockCard {
  front: string;
  back: string;
  hint?: string;
}

const MOCK_CARDS: Record<string, MockCard[]> = {
  'deck-1': [
    {
      front: 'What is the default index structure in PostgreSQL?',
      back: 'B-Trees (Balanced Trees) are the default indexes. They are designed to speed up search operations on sorted fields.',
      hint: 'It is a balanced tree database layout.'
    },
    {
      front: 'What is the primary trade-off of database indexing?',
      back: 'Indexes speed up read operations (queries) but slow down write operations (inserts, updates, deletes) because index tables must be updated.',
      hint: 'Think of database storage recalculation costs.'
    },
    {
      front: 'When should you avoid indexing a column?',
      back: 'Avoid indexing columns in tables that undergo frequent write operations, or columns with low selectivity (e.g. boolean fields).',
      hint: 'Selectivity and writes ratios.'
    }
  ],
  'deck-2': [
    {
      front: 'What is the purpose of backpropagation in Neural Networks?',
      back: 'Backpropagation calculates the gradient of the loss function with respect to the weights of the network, enabling optimization via gradient descent.',
      hint: 'Weight optimization math.'
    },
    {
      front: 'What does the hypothesis function define in linear regression?',
      back: 'It defines the prediction model formula: h(x) = theta0 + theta1 * x, where thetas represent model parameters.',
      hint: 'Line equation formulation.'
    }
  ],
  'deck-3': [
    {
      front: 'How do you conjugate "hablar" in the conditional first-person?',
      back: 'Yo hablaría (I would speak). The conditional tense suffix is -ía added to the full infinitive.',
      hint: 'Suffix added to full verb.'
    },
    {
      front: 'What is the meaning of the idiom "echar de menos"?',
      back: 'It means "to miss (someone or something)". e.g. "Te echo de menos" means "I miss you".',
      hint: 'Feel absence of.'
    }
  ]
};

const DEFAULT_DECK: MockCard[] = [
  {
    front: 'Default Card Question',
    back: 'Default Card Answer',
    hint: 'No preloaded deck found.'
  }
];

export default function FlashcardsReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const deckId = (params.deckId as string) || 'deck-1';
  const deckTitle = (params.title as string) || 'Flashcard Review';

  const user = useAuthStore((state) => state.user);
  const updateUserXP = useAuthStore((state) => state.updateUserXP);

  const cards = MOCK_CARDS[deckId] || DEFAULT_DECK;
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  // XP tracker
  const [gainedXp, setGainedXp] = useState(0);

  // Reanimated shared values for flip and swipe animations
  const rotate = useSharedValue(0); // 0 = front, 180 = back
  const translateX = useSharedValue(0);

  const handleFlip = () => {
    rotate.value = withTiming(isFlipped ? 0 : 180, { duration: 300 });
    setIsFlipped(!isFlipped);
  };

  const handleDifficulty = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    // 1. Translate card off-screen
    const slideDirection = difficulty === 'again' || difficulty === 'hard' ? -400 : 400;
    
    translateX.value = withTiming(slideDirection, { duration: 250 }, () => {
      runOnJS(loadNextCard)(difficulty);
    });
  };

  const loadNextCard = (difficulty: string) => {
    // Award XP based on answer quality
    let earned = 2;
    if (difficulty === 'good') earned = 4;
    if (difficulty === 'easy') earned = 5;
    
    setGainedXp((prev) => prev + earned);
    updateUserXP(earned);

    if (index + 1 >= cards.length) {
      setSessionCompleted(true);
    } else {
      // Load next card
      setIndex((prev) => prev + 1);
      setIsFlipped(false);
      rotate.value = 0;
      // 2. Snap translation to opposite side, then slide back into center
      translateX.value = -translateX.value;
      translateX.value = withTiming(0, { duration: 300 });
    }
  };

  const handleClose = () => {
    router.back();
  };

  // 3D Card Animation Styles
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 180], [0, 180]);
    return {
      transform: [
        { translateX: translateX.value },
        { rotateY: `${rotateValue}deg` }
      ],
      opacity: rotate.value > 90 ? 0 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 180], [-180, 0]);
    return {
      transform: [
        { translateX: translateX.value },
        { rotateY: `${rotateValue}deg` }
      ],
      opacity: rotate.value > 90 ? 1 : 0,
    };
  });

  const activeCard = cards[index];

  if (sessionCompleted) {
    return (
      <ScreenContainer safeArea={false} className="bg-white dark:bg-secondary-950 flex-1 justify-center items-center px-6">
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-950/40 justify-center items-center mb-6">
            <Icon name="Award" size={40} color="#8b5cf6" animate="float" />
          </View>

          <Typography variant="h1" className="font-black text-center mb-2">
            Deck Completed! 🎉
          </Typography>
          <Typography variant="body" color="muted" className="text-center font-semibold text-secondary-500">
            Excellent job. You have completed the study review for {deckTitle}.
          </Typography>
        </View>

        <Card variant="glass" className="w-full p-5 border border-primary-100/10 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Typography variant="body" color="secondary" className="font-bold text-secondary-500">XP Gained</Typography>
            <Typography variant="h3" className="font-black text-primary-500">+{gainedXp} XP</Typography>
          </View>
          <View className="flex-row justify-between items-center">
            <Typography variant="body" color="secondary" className="font-bold text-secondary-500">Streak Status</Typography>
            <Typography variant="h3" className="font-black text-orange-500">🔥 {user?.streak || 1} Day Streak</Typography>
          </View>
        </Card>

        <Button
          title="Finish Review"
          onPress={handleClose}
          className="w-full shadow-lg shadow-primary-500/10"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-50 dark:bg-secondary-950 flex-1">
      <Header
        title={deckTitle}
        showBackButton={true}
        onBackButtonPress={handleClose}
      />

      <ScreenContainer safeArea={false} className="bg-transparent p-5 flex-1 justify-between">
        {/* Progress Ring metrics bar */}
        <View className="flex-row items-center justify-between bg-white dark:bg-secondary-900 border border-secondary-100 dark:border-secondary-800 p-4 rounded-2xl shadow-sm">
          <View className="flex-1 mr-4">
            <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">SESSION PROGRESS</Typography>
            <Typography variant="h3" className="font-black mt-0.5">
              Card {index + 1} of {cards.length}
            </Typography>
          </View>
          
          <ProgressRing progress={(index + 1) / cards.length} size={54} strokeWidth={6} />
        </View>

        {/* 3D Flip Card Workspace */}
        <View className="relative w-full h-[360px] my-6 justify-center items-center">
          {/* Card Front face */}
          <Animated.View
            style={[
              { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' },
              frontAnimatedStyle
            ]}
          >
            <Pressable onPress={handleFlip} className="w-full h-full">
              <Card variant="glass" className="w-full h-full p-6 border border-primary-100/10 justify-center items-center shadow-md">
                <Badge label="Leitner Front" variant="primary" type="subtle" className="absolute top-4 left-4" />
                
                <Typography variant="h2" className="font-black text-center px-4 leading-relaxed">
                  {activeCard.front}
                </Typography>
                
                <Typography variant="bodySm" color="muted" className="font-bold absolute bottom-4 text-secondary-400">
                  👆 Tap card to flip and reveal answer
                </Typography>
              </Card>
            </Pressable>
          </Animated.View>

          {/* Card Back face */}
          <Animated.View
            style={[
              { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' },
              backAnimatedStyle
            ]}
          >
            <Pressable onPress={handleFlip} className="w-full h-full">
              <Card variant="default" className="w-full h-full p-6 border border-secondary-200 dark:border-secondary-850 justify-center items-center shadow-md">
                <Badge label="Leitner Back" variant="success" type="subtle" className="absolute top-4 left-4" />

                {activeCard.hint && (
                  <Badge
                    label={`AI Hint: ${activeCard.hint}`}
                    variant="neutral"
                    type="solid"
                    className="absolute top-4 right-4 bg-secondary-100 dark:bg-secondary-800"
                  />
                )}

                <Typography variant="body" className="font-bold text-center px-4 text-lg text-secondary-900 dark:text-white leading-relaxed">
                  {activeCard.back}
                </Typography>

                <Typography variant="bodySm" color="muted" className="font-bold absolute bottom-4 text-secondary-400">
                  👆 Tap card to flip back to question
                </Typography>
              </Card>
            </Pressable>
          </Animated.View>
        </View>

        {/* Action buttons drawer */}
        <View className="mb-2">
          {isFlipped ? (
            <View className="gap-3">
              <Typography variant="bodySm" color="muted" className="text-center font-bold text-secondary-400 mb-1">
                How well did you know this?
              </Typography>
              
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => handleDifficulty('again')}
                  className="flex-1 py-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 items-center justify-center rounded-2xl active:opacity-75"
                >
                  <Typography variant="body" className="text-red-500 font-extrabold">Again</Typography>
                </Pressable>

                <Pressable
                  onPress={() => handleDifficulty('hard')}
                  className="flex-1 py-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 items-center justify-center rounded-2xl active:opacity-75"
                >
                  <Typography variant="body" className="text-amber-500 font-extrabold">Hard</Typography>
                </Pressable>

                <Pressable
                  onPress={() => handleDifficulty('good')}
                  className="flex-1 py-3.5 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 items-center justify-center rounded-2xl active:opacity-75"
                >
                  <Typography variant="body" className="text-indigo-500 font-extrabold">Good</Typography>
                </Pressable>

                <Pressable
                  onPress={() => handleDifficulty('easy')}
                  className="flex-1 py-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 items-center justify-center rounded-2xl active:opacity-75"
                >
                  <Typography variant="body" className="text-emerald-500 font-extrabold">Easy</Typography>
                </Pressable>
              </View>
            </View>
          ) : (
            <View className="items-center py-4">
              <Typography variant="bodySm" color="muted" className="font-bold text-secondary-400">
                Reveal the card back to select difficulty
              </Typography>
            </View>
          )}
        </View>
      </ScreenContainer>
    </ScreenContainer>
  );
}
