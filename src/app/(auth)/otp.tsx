import React, { useState, useEffect, useRef } from 'react';
import { Pressable, View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer, Typography, Button, Icon } from '@/components/ui';

export default function OTPScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timerCount, setTimerCount] = useState(59);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerCount((lastTimerCount) => {
        if (lastTimerCount <= 1) {
          clearInterval(interval);
          return 0;
        }
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerCount]);

  const handleResend = () => {
    if (timerCount === 0) {
      setTimerCount(59);
      setError('');
    }
  };

  const handleVerify = () => {
    if (code.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push('/(auth)/profile-setup');
    }, 1200);
  };

  const cells = Array(6).fill(0);

  return (
    <ScreenContainer scrollable className="bg-white dark:bg-secondary-950 px-6 py-6 flex-1">
      <View className="flex-row items-center mt-2">
        <Pressable
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-full active:bg-secondary-100 dark:active:bg-secondary-900 justify-center items-center"
        >
          <Icon name="ArrowLeft" size={22} color="#8b5cf6" />
        </Pressable>
      </View>

      <View className="mt-4 mb-8">
        <Typography variant="h1" className="font-black mb-2">
          Verify Email
        </Typography>
        <Typography variant="body" color="muted" className="font-semibold text-secondary-500">
          We sent a 6-digit verification code to your email address. Please enter it below.
        </Typography>
      </View>

      <Pressable onPress={() => inputRef.current?.focus()} className="flex-row justify-between mb-8 w-full max-w-sm mx-auto">
        {cells.map((_, idx) => {
          const char = code[idx] || '';
          const isFocused = idx === code.length;
          return (
            <View
              key={idx}
              className={`w-12 h-14 rounded-xl border-2 bg-secondary-50/50 dark:bg-secondary-900/50 justify-center items-center ${
                isFocused ? 'border-primary-500 bg-white dark:bg-secondary-900 shadow-sm' : char ? 'border-secondary-300 dark:border-secondary-700' : 'border-secondary-200 dark:border-secondary-800'
              }`}
            >
              <Typography variant="h2" className="font-bold text-center">
                {char}
              </Typography>
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={(text) => {
          if (text.length <= 6 && /^\d*$/.test(text)) {
            setCode(text);
          }
        }}
        keyboardType="number-pad"
        maxLength={6}
        className="absolute w-1 h-1 opacity-0"
      />

      {error ? (
        <Typography variant="bodySm" color="danger" align="center" className="mb-6 font-bold">
          {error}
        </Typography>
      ) : null}

      <Button
        title="Verify Code"
        onPress={handleVerify}
        isLoading={loading}
        className="w-full shadow-lg shadow-primary-500/10 mb-6"
      />

      <View className="flex-row justify-center items-center mt-4">
        {timerCount > 0 ? (
          <Typography variant="body" color="muted" className="font-semibold text-secondary-500">
            Resend code in <Typography className="text-primary-500 font-extrabold">00:{timerCount.toString().padStart(2, '0')}</Typography>
          </Typography>
        ) : (
          <Pressable onPress={handleResend} className="active:opacity-60">
            <Typography variant="body" className="text-primary-500 font-extrabold decoration-line:underline">
              Resend Code
            </Typography>
          </Pressable>
        )}
      </View>
    </ScreenContainer>
  );
}
