import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer, Typography, Input, Button, Icon, Card } from '@/components/ui';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleReset = () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <ScreenContainer scrollable className="bg-white dark:bg-secondary-950 px-6 py-6 flex-1">
      <View className="flex-row items-center mt-2">
        <Pressable
          onPress={() => (submitted ? setSubmitted(false) : router.back())}
          className="p-2 -ml-2 rounded-full active:bg-secondary-100 dark:active:bg-secondary-900 justify-center items-center"
        >
          <Icon name="ArrowLeft" size={22} color="#8b5cf6" />
        </Pressable>
      </View>

      {!submitted ? (
        <>
          <View className="mt-4 mb-8">
            <Typography variant="h1" className="font-black mb-2">
              Forgot Password
            </Typography>
            <Typography variant="body" color="muted" className="font-semibold text-secondary-500">
              Enter your email and we'll send you instructions to reset your password.
            </Typography>
          </View>

          <View className="mb-6">
            <Input
              label="Email Address"
              placeholder="yourname@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={error}
              leftIcon={<Icon name="Mail" size={18} color="#64748b" />}
            />
          </View>

          <Button
            title="Send Recovery Link"
            onPress={handleReset}
            isLoading={loading}
            className="w-full shadow-lg shadow-primary-500/10"
          />
        </>
      ) : (
        <View className="flex-1 justify-center items-center mt-10">
          <Card variant="glass" className="w-full items-center p-6 text-center border border-primary-100/15">
            <View className="w-16 h-16 bg-success-50 dark:bg-success-950/20 rounded-full justify-center items-center mb-5 border border-success-100/20">
              <Icon name="CheckCircle" size={32} color="#22c55e" animate="pulse" />
            </View>

            <Typography variant="h2" className="font-black mb-2 text-center">
              Check Your Email
            </Typography>
            
            <Typography variant="body" color="secondary" className="font-medium text-center mb-6 leading-relaxed text-secondary-500">
              We have sent a secure password reset link to: {'\n'}
              <Typography className="font-bold text-primary-500">{email}</Typography>
            </Typography>

            <Button
              title="Back to Login"
              onPress={() => router.replace('/(auth)/login')}
              className="w-full"
            />

            <Pressable
              onPress={handleReset}
              className="mt-4 active:opacity-60"
            >
              <Typography variant="bodySm" className="text-secondary-400 dark:text-secondary-500 font-bold decoration-line:underline">
                Didn't get the email? Resend
              </Typography>
            </Pressable>
          </Card>
        </View>
      )}
    </ScreenContainer>
  );
}
