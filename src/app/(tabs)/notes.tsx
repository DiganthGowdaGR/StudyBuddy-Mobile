import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer, Typography, Card, Header, Icon, Input, Button } from '@/components/ui';

const MOCK_NOTES = [
  {
    id: 'n-1',
    title: 'PostgreSQL Indexes',
    excerpt: 'Indexes speed up queries but slow down writes. B-Trees are the default index structure...',
    date: 'Jun 28, 2026',
    category: 'Computer Science'
  },
  {
    id: 'n-2',
    title: 'Cell Division Steps',
    excerpt: 'Mitosis vs Meiosis. Mitosis produces 2 diploid cells, Meiosis produces 4 haploid gametes...',
    date: 'Jun 25, 2026',
    category: 'Medicine & Biology'
  },
  {
    id: 'n-3',
    title: 'Linear Regression Notes',
    excerpt: 'Cost function J(theta) measures prediction inaccuracy. Gradient descent updates weights iteratively...',
    date: 'Jun 22, 2026',
    category: 'Mathematics'
  }
];

export default function NotesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredNotes = MOCK_NOTES.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-50 dark:bg-secondary-950 flex-1">
      <Header title="Study Notes" />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5">
        <Input
          placeholder="Search study notes..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Icon name="Search" size={18} color="#64748b" />}
        />

        <View className="flex-row justify-between items-center mb-4 mt-2">
          <Typography variant="h3" className="font-bold">Notebook</Typography>
          <Button
            title="New Note"
            variant="text"
            size="sm"
            leftIcon={<Icon name="Plus" size={16} color="#8b5cf6" />}
          />
        </View>

        <View className="gap-4">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              onPress={() => router.push({ pathname: '/note-editor', params: { id: note.id, title: note.title } })}
              header={
                <View className="flex-row justify-between items-center w-full">
                  <Typography variant="h4" className="font-bold">{note.title}</Typography>
                  <Typography variant="caption" className="text-[10px] text-primary-500 font-semibold uppercase">{note.category}</Typography>
                </View>
              }
              footer={`Modified: ${note.date}`}
              className="border border-secondary-100 dark:border-secondary-800"
            >
              <Typography variant="body" color="secondary" className="font-medium text-secondary-500 mb-2 leading-relaxed">
                {note.excerpt}
              </Typography>
            </Card>
          ))}
        </View>
      </ScreenContainer>
    </ScreenContainer>
  );
}
