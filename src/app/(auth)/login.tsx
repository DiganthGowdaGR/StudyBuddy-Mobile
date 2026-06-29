import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer, Typography, Input, Button, Icon } from '@/components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push('/(auth)/profile-setup');
    }, 1200);
  };

  return (
    <ScreenContainer scrollable className="bg-white dark:bg-secondary-950 px-6 py-6 flex-1">
      <View className="mt-8 mb-8">
        <Typography variant="h1" className="font-black mb-2">
          Welcome Back
        </Typography>
        <Typography variant="body" color="muted" className="font-semibold text-secondary-500">
          Sign in to keep your study streak active!
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
          leftIcon={<Icon name="Mail" size={18} color="#64748b" />}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          error={error}
          leftIcon={<Icon name="Lock" size={18} color="#64748b" />}
        />

        <Pressable
          onPress={() => router.push('/(auth)/forgot-password')}
          className="self-end -mt-1 active:opacity-60"
        >
          <Typography variant="bodySm" className="text-primary-500 font-bold">
            Forgot Password?
          </Typography>
        </Pressable>
      </View>

      <Button
        title="Log In"
        onPress={handleLogin}
        isLoading={loading}
        className="w-full shadow-lg shadow-primary-500/10 mb-8"
      />

      <View className="flex-row items-center mb-8 px-4">
        <View className="flex-1 h-[1px] bg-secondary-100 dark:bg-secondary-800" />
        <Typography variant="bodySm" color="muted" className="mx-4 font-bold text-secondary-400">
          Or Continue With
        </Typography>
        <View className="flex-1 h-[1px] bg-secondary-100 dark:bg-secondary-800" />
      </View>

      <View className="flex-row justify-center gap-4 mb-8">
        <Pressable className="w-14 h-14 rounded-full border border-secondary-200 dark:border-secondary-800 justify-center items-center active:bg-secondary-50 dark:active:bg-secondary-900 bg-white dark:bg-secondary-900">
          <Icon name="Globe" size={22} color="#64748b" />
        </Pressable>
        <Pressable className="w-14 h-14 rounded-full border border-secondary-200 dark:border-secondary-800 justify-center items-center active:bg-secondary-50 dark:active:bg-secondary-900 bg-white dark:bg-secondary-900">
          <Icon name="Apple" size={22} color="#64748b" />
        </Pressable>
      </View>



      <View className="flex-row justify-center items-center mt-auto pb-4">
        <Typography variant="body" color="muted" className="font-semibold mr-1.5 text-secondary-500">
          Don't have an account?
        </Typography>
        <Pressable onPress={() => router.push('/(auth)/signup')} className="active:opacity-60">
          <Typography variant="body" className="text-primary-500 font-extrabold">
            Sign Up
          </Typography>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
