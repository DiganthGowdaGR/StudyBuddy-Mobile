import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer, Typography, Input, Button, Icon } from '@/components/ui';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = () => {
    if (!name) {
      setError('Please enter your full name');
      return;
    }
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push('/(auth)/otp');
    }, 1200);
  };

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
          Create Account
        </Typography>
        <Typography variant="body" color="muted" className="font-semibold text-secondary-500">
          Sign up to begin your learning journey!
        </Typography>
      </View>

      <View className="mb-6">
        <Input
          label="Full Name"
          placeholder="Diganth Gowda"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
          leftIcon={<Icon name="User" size={18} color="#64748b" />}
        />

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
          placeholder="Must be at least 6 characters"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          leftIcon={<Icon name="Lock" size={18} color="#64748b" />}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          secureTextEntry
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={error}
          leftIcon={<Icon name="Lock" size={18} color="#64748b" />}
        />
      </View>

      <Button
        title="Create Account"
        onPress={handleSignup}
        isLoading={loading}
        className="w-full shadow-lg shadow-primary-500/10 mb-8"
      />

      <View className="flex-row justify-center items-center mt-auto pb-4">
        <Typography variant="body" color="muted" className="font-semibold mr-1.5 text-secondary-500">
          Already have an account?
        </Typography>
        <Pressable onPress={() => router.push('/(auth)/login')} className="active:opacity-60">
          <Typography variant="body" className="text-primary-500 font-extrabold">
            Log In
          </Typography>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
