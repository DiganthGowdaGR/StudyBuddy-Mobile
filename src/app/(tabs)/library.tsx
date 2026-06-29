import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import {
  ScreenContainer,
  Typography,
  Card,
  Header,
  Icon,
  Input,
  Badge,
  Button,
  EmptyState,
  Skeleton,
} from '@/components/ui';

interface DocumentItem {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'image' | 'sheet';
  size: string;
  pages?: number;
  status: 'indexed' | 'indexing';
  category: 'PDFs' | 'Syllabi' | 'Mock Exams';
}

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: 'd1',
    title: 'Lecture 1: Intro to React Native.pdf',
    type: 'pdf',
    size: '2.4 MB',
    pages: 14,
    status: 'indexed',
    category: 'PDFs',
  },
  {
    id: 'd2',
    title: 'Database Schema Designs.pdf',
    type: 'pdf',
    size: '1.8 MB',
    pages: 8,
    status: 'indexed',
    category: 'PDFs',
  },
  {
    id: 'd3',
    title: 'Final Syllabus - CS 2026.doc',
    type: 'doc',
    size: '420 KB',
    status: 'indexed',
    category: 'Syllabi',
  },
];

const CATEGORIES = ['All', 'PDFs', 'Syllabi', 'Mock Exams'] as const;

export default function LibraryScreen() {
  const router = useRouter();
  const [docs, setDocs] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('All');
  const [uploading, setUploading] = useState(false);
  const [storageUsed, setStorageUsed] = useState(1.2); // GB out of 5GB

  const handleUpload = () => {
    if (uploading) return;
    setUploading(true);

    setTimeout(() => {
      const newDocId = Math.random().toString(36).substring(7);
      const docNames = [
        'AI Ethics Guidelines.pdf',
        'Math Midterm Exam Prep.pdf',
        'Intro to PyTorch.pdf',
        'Spanish Verb Rules.pdf'
      ];
      const randomName = docNames[Math.floor(Math.random() * docNames.length)];
      
      const newDoc: DocumentItem = {
        id: newDocId,
        title: randomName,
        type: 'pdf',
        size: '1.5 MB',
        pages: 6,
        status: 'indexing',
        category: 'PDFs',
      };

      setDocs((prev) => [newDoc, ...prev]);
      setStorageUsed((prev) => Math.min(5, prev + 0.15));
      setUploading(false);

      setTimeout(() => {
        setDocs((currentDocs) =>
          currentDocs.map((d) =>
            d.id === newDocId ? { ...d, status: 'indexed' } : d
          )
        );
      }, 4000);
    }, 1000);
  };

  const getFileIcon = (type: DocumentItem['type']) => {
    switch (type) {
      case 'pdf': return 'FileText';
      case 'doc': return 'File';
      case 'image': return 'Image';
      case 'sheet': return 'Database';
    }
  };

  const filteredDocs = docs.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-50 dark:bg-secondary-950 flex-1">
      <Header
        title="Study Library"
        rightAction={
          <Button
            title="Upload"
            size="sm"
            onPress={handleUpload}
            isLoading={uploading}
            leftIcon={<Icon name="Upload" size={14} color="#ffffff" />}
            className="shadow-sm shadow-primary-500/10"
          />
        }
      />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5 gap-6">
        <Card variant="glass" className="border border-primary-100/10 p-4">
          <View className="flex-row justify-between items-center mb-2.5">
            <View className="flex-row items-center gap-2">
              <Icon name="Database" size={16} color="#8b5cf6" />
              <Typography variant="body" className="font-bold">Cloud Storage</Typography>
            </View>
            <Typography variant="bodySm" color="muted" className="font-extrabold text-secondary-500">
              {storageUsed.toFixed(2)} GB of 5.0 GB used
            </Typography>
          </View>
          
          <View className="w-full h-2 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
            <View
              style={{ width: `${(storageUsed / 5) * 100}%` }}
              className="h-full bg-primary-500"
            />
          </View>
        </Card>

        <View className="gap-4">
          <Input
            placeholder="Search study resources..."
            value={search}
            onChangeText={setSearch}
            containerClassName="mb-0"
            leftIcon={<Icon name="Search" size={18} color="#64748b" />}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 py-1 gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  className="mr-2 active:scale-95"
                >
                  <Badge
                    label={cat}
                    variant={isActive ? 'primary' : 'neutral'}
                    type={isActive ? 'solid' : 'subtle'}
                    className="py-1.5 px-4 rounded-xl border border-secondary-200/10"
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View className="gap-4">
          {uploading && (
            <Animated.View entering={FadeInUp} exiting={FadeOut}>
              <Skeleton.Card />
            </Animated.View>
          )}

          {filteredDocs.length === 0 && !uploading ? (
            <EmptyState
              icon="FolderOpen"
              title={search ? 'No Matches Found' : 'Your Library is Empty'}
              description={
                search
                  ? 'Double check your spelling or search folder filters to find materials.'
                  : 'Upload your syllabi, slides, and textbooks to generate custom flashcards.'
              }
              action={
                !search
                  ? {
                      label: 'Upload Document',
                      onPress: handleUpload,
                    }
                  : undefined
              }
            />
          ) : (
            filteredDocs.map((doc) => (
              <Animated.View key={doc.id} entering={FadeInUp}>
                <Card
                  variant="default"
                  className="border border-secondary-100 dark:border-secondary-800"
                  header={
                    <View className="flex-row justify-between items-center w-full">
                      <View className="flex-row items-center flex-1 mr-4">
                        <View className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/20 justify-center items-center mr-3 border border-primary-100/10">
                          <Icon name={getFileIcon(doc.type)} size={18} color="#8b5cf6" />
                        </View>
                        <Typography variant="h4" numberOfLines={1} className="font-bold flex-1">
                          {doc.title}
                        </Typography>
                      </View>

                      <Badge
                        label={doc.status === 'indexed' ? 'Indexed' : 'Indexing...'}
                        variant={doc.status === 'indexed' ? 'success' : 'warning'}
                        type="subtle"
                        leftIcon={
                          doc.status === 'indexing' ? (
                            <Icon name="Loader" size={10} color="#d97706" animate="spin" />
                          ) : undefined
                        }
                        className="px-2 py-0.5 rounded-lg border-transparent"
                      />
                    </View>
                  }
                  footer={`File Size: ${doc.size} ${doc.pages ? `• Pages: ${doc.pages}` : ''}`}
                >
                  <View className="flex-row justify-between items-center mt-1">
                    <Typography variant="bodySm" color="muted" className="font-semibold text-secondary-500">
                      Generate flashcard questions or summarize topics:
                    </Typography>
                  </View>

                  <View className="flex-row gap-2.5 mt-4">
                    <Button
                      title="AI Summary"
                      variant="outline"
                      size="sm"
                      disabled={doc.status === 'indexing'}
                      className="flex-1 rounded-xl py-2"
                      onPress={() => router.push('/(tabs)/sensei')}
                    />
                    <Button
                      title="Make Flashcards"
                      variant="primary"
                      size="sm"
                      disabled={doc.status === 'indexing'}
                      className="flex-1 rounded-xl py-2"
                      onPress={() => router.push('/(tabs)/cards')}
                    />
                  </View>
                </Card>
              </Animated.View>
            ))
          )}
        </View>
      </ScreenContainer>
    </ScreenContainer>
  );
}
