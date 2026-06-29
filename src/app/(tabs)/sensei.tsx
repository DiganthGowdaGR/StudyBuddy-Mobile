import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ScreenContainer, Typography, Input, Header, Icon, Avatar } from '@/components/ui';

interface Message {
  id: string;
  sender: 'user' | 'sensei';
  text: string;
  timestamp: string;
}

export default function SenseiScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'sensei',
      text: 'Hello! I am your AI Study Sensei. Ask me any question, paste some lecture text, or let me explain a topic in simple terms!',
      timestamp: '10:00 AM'
    },
    {
      id: '2',
      sender: 'user',
      text: 'Can you explain backpropagation in simple terms?',
      timestamp: '10:02 AM'
    },
    {
      id: '3',
      sender: 'sensei',
      text: 'Of course! Think of backpropagation like adjusting recipe ingredients. You bake a cake (forward pass) and taste it (calculate error). If it is too sweet, you trace back to who put the sugar (backward pass) and reduce the amount next time. That is how neural networks learn!',
      timestamp: '10:03 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const responseMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'sensei',
        text: 'That is a great question! Let me check my knowledge base. Actually, yes, we can break that down into easy flashcards for you to study later. Would you like me to generate a deck?',
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, responseMsg]);
    }, 1200);
  };

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-50 dark:bg-secondary-950 flex-1">
      <Header title="AI Coach Sensei" />

      <ScrollView
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isSensei = msg.sender === 'sensei';
          return (
            <View
              key={msg.id}
              className={`flex-row mb-4 ${isSensei ? 'justify-start' : 'justify-end'}`}
            >
              {isSensei && (
                <View className="mr-2 justify-end">
                  <Avatar name="AI Sensei" size="sm" className="bg-primary-500" />
                </View>
              )}

              <View
                className={`max-w-[75%] rounded-2xl p-4 border ${
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
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View className="p-4 bg-white dark:bg-secondary-950 border-t border-secondary-100 dark:border-secondary-900">
        <Input
          placeholder="Ask Sensei a question..."
          value={inputText}
          onChangeText={setInputText}
          containerClassName="mb-0"
          rightIcon={
            <Pressable
              onPress={handleSend}
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
