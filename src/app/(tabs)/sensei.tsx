import React, { useState, useEffect, useRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  FadeInDown,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import {
  ScreenContainer,
  Typography,
  Card,
  Header,
  Icon,
  Input,
  Avatar,
  Button,
  Badge,
} from '@/components/ui';

interface Message {
  id: string;
  sender: 'user' | 'sensei';
  text: string;
  timestamp: string;
  cardType?: 'study_deck' | 'quiz_prep';
  cardTitle?: string;
  cardInfo?: string;
}

const SUGGESTED_PROMPTS = [
  'Explain B-Trees simply 🤖',
  'Mitosis vs Meiosis differences 🔬',
  'SQL query joins cheatsheet 📊',
];

function BouncingDot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 250 }),
          withTiming(0, { duration: 250 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#8b5cf6', marginHorizontal: 1.5 },
        animatedStyle,
      ]}
    />
  );
}

function ThinkingIndicator() {
  return (
    <View className="flex-row items-center bg-white dark:bg-secondary-900 border border-secondary-100 dark:border-secondary-800 rounded-2xl px-4 py-3.5 max-w-[70px] mb-4 ml-2 shadow-sm">
      <BouncingDot delay={0} />
      <BouncingDot delay={150} />
      <BouncingDot delay={300} />
    </View>
  );
}

function VoiceWavebar() {
  const heightVal = useSharedValue(6);
  
  useEffect(() => {
    heightVal.value = withRepeat(
      withSequence(
        withTiming(15 + Math.random() * 15, { duration: 200 + Math.random() * 100 }),
        withTiming(6, { duration: 200 + Math.random() * 100 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    height: heightVal.value,
  }));

  return (
    <Animated.View
      style={[{ width: 3, borderRadius: 1.5 }, animatedStyle]}
      className="bg-primary-500"
    />
  );
}

export default function SenseiScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'sensei',
      text: 'Hello! I am your AI Study Sensei. Ask me a question, paste some lecture text, or click a suggestion prompt below to get started!',
      timestamp: '10:00 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Voice recording states
  const [recording, setRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);

  useEffect(() => {
    let timer: any;
    if (recording) {
      timer = setInterval(() => {
        setRecordTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordTimer(0);
    }
    return () => clearInterval(timer);
  }, [recording]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);
    scrollToBottom();

    // Mock replies based on query match
    setTimeout(() => {
      let replyText = 'That is an excellent topic! Let me construct a structured study card with flashcards and quiz summaries to help you retain this efficiently.';
      let cardType: Message['cardType'];
      let cardTitle = '';
      let cardInfo = '';

      const query = text.toLowerCase();
      if (query.includes('b-tree') || query.includes('simply')) {
        replyText = 'B-Trees are self-balancing search trees designed for storage systems. Here is a breakdown of their structure:';
        cardType = 'study_deck';
        cardTitle = 'B-Trees & Indexing structures';
        cardInfo = '12 Flashcards • 1 B-Tree diagram node summary';
      } else if (query.includes('mitosis')) {
        replyText = 'Mitosis is cellular replication dividing chromosomes equally. I have prepared a quick review quiz for you:';
        cardType = 'quiz_prep';
        cardTitle = 'Mitosis stages and steps';
        cardInfo = '5 Questions • Metaphase & Prophase checks';
      } else if (query.includes('join')) {
        replyText = 'SQL joins combine rows from two or more tables based on related columns. Here are the core join cheat sheets:';
        cardType = 'study_deck';
        cardTitle = 'SQL Database Joins';
        cardInfo = '8 Flashcards • INNER, LEFT, RIGHT, FULL diagrams';
      }

      const responseMsg: Message = {
        id: Math.random().toString(),
        sender: 'sensei',
        text: replyText,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        cardType,
        cardTitle,
        cardInfo,
      };

      setMessages((prev) => [...prev, responseMsg]);
      setIsThinking(false);
      scrollToBottom();
    }, 2000);
  };

  const handleMicPress = () => {
    if (recording) {
      setRecording(false);
      setInputText('Explain the difference between clustered and non-clustered indexes');
    } else {
      setRecording(true);
    }
  };

  const handleCardAction = (type: 'flashcard' | 'quiz', title: string) => {
    setIsThinking(true);
    scrollToBottom();

    setTimeout(() => {
      const responseMsg: Message = {
        id: Math.random().toString(),
        sender: 'sensei',
        text:
          type === 'flashcard'
            ? `✨ Success! I generated 8 new flashcards for '${title}'. You can view and study them in the Cards tab!`
            : `🎓 Awesome! I created a 5-question study quiz for '${title}'. Go to your Schedule tab to start the focus review!`,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, responseMsg]);
      setIsThinking(false);
      scrollToBottom();
    }, 1200);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-50 dark:bg-secondary-950 flex-1">
      <Header title="AI Coach Sensei" />

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((msg) => {
          const isSensei = msg.sender === 'sensei';
          return (
            <View key={msg.id} className="mb-4">
              <View className={`flex-row ${isSensei ? 'justify-start' : 'justify-end'}`}>
                {isSensei && (
                  <View className="mr-2 justify-end">
                    <Avatar name="Sensei" size="sm" className="bg-primary-500" />
                  </View>
                )}

                <Animated.View
                  entering={FadeInDown.delay(100).springify()}
                  className={`max-w-[78%] rounded-2xl p-4 border ${
                    isSensei
                      ? 'bg-white dark:bg-secondary-900 border-secondary-100 dark:border-secondary-800 rounded-bl-none'
                      : 'bg-primary-500 border-primary-500 rounded-br-none'
                  }`}
                >
                  <Typography
                    className={`text-sm leading-relaxed ${isSensei ? 'text-secondary-900 dark:text-secondary-100' : 'text-white'}`}
                  >
                    {msg.text}
                  </Typography>

                  <Typography
                    variant="caption"
                    className={`text-[8px] mt-1.5 self-end ${isSensei ? 'text-secondary-400' : 'text-primary-100'}`}
                  >
                    {msg.timestamp}
                  </Typography>
                </Animated.View>
              </View>

              {/* Conversation action cards */}
              {isSensei && msg.cardType && (
                <Animated.View entering={FadeInDown.delay(300).springify()} className="ml-10 mt-3 mr-4">
                  <Card variant="glass" className="p-4 border-secondary-100/50 bg-primary-50/20 dark:bg-primary-950/15">
                    <View className="flex-row items-center gap-2 mb-2">
                      <Icon
                        name={msg.cardType === 'study_deck' ? 'Layers' : 'Calendar'}
                        size={16}
                        color="#8b5cf6"
                      />
                      <Typography variant="body" className="font-extrabold text-primary-600 dark:text-primary-400">
                        {msg.cardTitle}
                      </Typography>
                    </View>

                    <Typography variant="bodySm" color="secondary" className="font-semibold text-secondary-500 mb-4">
                      {msg.cardInfo}
                    </Typography>

                    <View className="flex-row gap-2.5">
                      {msg.cardType === 'study_deck' ? (
                        <Button
                          title="Generate Flashcards"
                          size="sm"
                          className="flex-1 py-2 rounded-xl text-[11px]"
                          onPress={() => handleCardAction('flashcard', msg.cardTitle || '')}
                        />
                      ) : (
                        <Button
                          title="Generate Quiz"
                          size="sm"
                          className="flex-1 py-2 rounded-xl text-[11px]"
                          onPress={() => handleCardAction('quiz', msg.cardTitle || '')}
                        />
                      )}
                    </View>
                  </Card>
                </Animated.View>
              )}
            </View>
          );
        })}

        {isThinking && <ThinkingIndicator />}
      </ScrollView>

      {/* Suggested Prompts Carousel */}
      {!recording && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="max-h-12 bg-transparent border-t border-transparent px-4 py-1.5"
          contentContainerStyle={{ gap: 8 }}
        >
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <Pressable
              key={idx}
              onPress={() => handleSend(prompt)}
              className="px-3.5 py-1.5 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-full active:scale-95 shadow-sm"
            >
              <Typography variant="bodySm" className="text-secondary-800 dark:text-secondary-200 font-bold">
                {prompt}
              </Typography>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Voice listening drawer */}
      {recording && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          className="absolute bottom-16 left-0 right-0 bg-secondary-950 px-5 py-4 border-t border-secondary-800 flex-row items-center justify-between z-20"
        >
          <View className="flex-row items-center gap-3">
            <View className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <Typography variant="bodySm" className="text-white font-extrabold">
              Listening... {formatTimer(recordTimer)}
            </Typography>
          </View>

          <View className="flex-row gap-1 h-6 items-center px-4 flex-1 justify-center">
            {Array.from({ length: 14 }).map((_, idx) => (
              <VoiceWavebar key={idx} />
            ))}
          </View>

          <Button
            title="Done"
            size="sm"
            className="py-1 px-4 rounded-xl"
            onPress={handleMicPress}
          />
        </Animated.View>
      )}

      {/* Input container */}
      <View className="p-4 bg-white dark:bg-secondary-950 border-t border-secondary-100 dark:border-secondary-900">
        <Input
          placeholder="Ask Sensei a question..."
          value={inputText}
          onChangeText={setInputText}
          containerClassName="mb-0"
          leftIcon={
            <Pressable
              onPress={handleMicPress}
              className={`p-2 rounded-full active:scale-90 ${recording ? 'bg-red-500' : 'bg-secondary-50 dark:bg-secondary-900'}`}
            >
              <Icon name="Mic" size={16} color={recording ? '#ffffff' : '#64748b'} />
            </Pressable>
          }
          rightIcon={
            <Pressable
              onPress={() => handleSend(inputText)}
              className="p-2 rounded-xl bg-primary-500 justify-center items-center active:bg-primary-600"
            >
              <Icon name="Send" size={16} color="#ffffff" />
            </Pressable>
          }
        />
      </View>
    </ScreenContainer>
  );
}
