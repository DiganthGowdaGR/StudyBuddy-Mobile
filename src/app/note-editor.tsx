import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
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
  Badge,
  Button,
} from '@/components/ui';

function WaveBar({ index }: { index: number }) {
  const heightVal = useSharedValue(8);
  
  useEffect(() => {
    heightVal.value = withRepeat(
      withSequence(
        withTiming(20 + Math.random() * 20, { duration: 250 + Math.random() * 150 }),
        withTiming(6, { duration: 250 + Math.random() * 150 })
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

const MOCK_NOTE_BODIES: Record<string, string> = {
  'n-1': 'Indexes are special lookup tables that the database search engine can use to speed up data retrieval. Simply put, an index is a pointer to data in a table.\n\nB-Trees (Balanced Trees) are the standard index structures. They store sorted data and allow search, sequential access, insertions, and deletions in logarithmic time.\n\nHowever, indexing everything slows down write transactions (INSERT, UPDATE, DELETE) since indices must be recalculated.',
  'n-2': 'Mitosis is the process of cell division where a single cell divides into two identical daughter cells. It is used for growth and repair.\n\nMeiosis, on the other hand, is a cell division process that results in four daughter cells each with half the number of chromosomes of the parent cell, producing gametes.\n\nSteps of mitosis: Prophase, Metaphase, Anaphase, Telophase.',
  'n-3': 'Linear regression modeling finds the linear relationship between a dependent variable (Y) and one or more independent variables (X).\n\nThe hypothesis function is h(x) = theta0 + theta1 * x.\n\nWe define a Cost Function (Mean Squared Error) to measure inaccuracy. Gradient Descent is then applied to update parameters theta iteratively, minimizing the cost.'
};

export default function NoteEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const noteId = (params.id as string) || 'n-1';
  const initialTitle = (params.title as string) || 'Database Indexes';

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(MOCK_NOTE_BODIES[noteId] || '');
  
  // Toolbar states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);

  // Recording voice notes states
  const [recording, setRecording] = useState(false);
  const [voiceNotesCount, setVoiceNotesCount] = useState(0);

  // AI suggestions states
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);

  // Ask Sensei sliding drawer state
  const [showSenseiDrawer, setShowSenseiDrawer] = useState(false);
  const [senseiResponse, setSenseiResponse] = useState('');
  const [typing, setTyping] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleVoiceRecord = () => {
    if (recording) {
      setRecording(false);
      setVoiceNotesCount((prev) => prev + 1);
    } else {
      setRecording(true);
    }
  };

  const insertSuggestion = () => {
    setContent((prev) => prev + '\n\n[AI Resource Summary]: Database query planning evaluates indexes scans, bitmap index scans, and sequential table scans to pick the cheapest execution node tree.');
    setShowAiSuggestion(false);
  };

  const handleAskSenseiOption = (option: string) => {
    setTyping(true);
    setSenseiResponse('');
    
    setTimeout(() => {
      setTyping(false);
      if (option === 'summarize') {
        setSenseiResponse('Here is a brief summary: Database indexes act as lookup pointers to accelerate read speeds, with B-Trees being the default structure. Too many indexes slow down write operations because calculations occur during updates.');
      } else {
        setSenseiResponse('Here are 3 flashcard ideas:\n1. What is the default index structure? (B-Trees)\n2. When should you avoid index expansion? (Write-heavy tables)\n3. What is the primary trade-off of indexes? (Accelerates reads, slows writes)');
      }
    }, 1500);
  };

  return (
    <ScreenContainer safeArea={false} className="bg-white dark:bg-secondary-950 flex-1">
      <Header
        title="Edit Note"
        showBackButton={true}
        onBackButtonPress={handleClose}
        rightAction={
          <Pressable
            onPress={handleClose}
            className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/20 active:bg-primary-100 px-3.5"
          >
            <Typography variant="bodySm" className="text-primary-500 font-bold">Save</Typography>
          </Pressable>
        }
      />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5 pb-24">
        {/* Concepts Badges */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          <Badge label="SQL Database" variant="primary" type="subtle" />
          <Badge label="Performance" variant="warning" type="subtle" />
          <Badge label="B-Trees" variant="info" type="subtle" />
        </View>

        {/* Note Title */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          className="text-2xl font-black text-secondary-900 dark:text-white mb-4 p-0"
          placeholder="Note Title"
          placeholderTextColor="#94a3b8"
        />

        {/* AI suggestion banner */}
        {showAiSuggestion && (
          <Animated.View entering={FadeInDown} className="mb-4">
            <Card variant="glass" className="border-secondary-100/50 bg-primary-50/50 dark:bg-primary-950/20 p-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-row items-center gap-2 flex-1 mr-4">
                  <Icon name="Sparkles" size={16} color="#8b5cf6" animate="float" />
                  <Typography variant="body" className="font-bold text-primary-600 dark:text-primary-400">AI suggestion available</Typography>
                </View>
                <Pressable onPress={() => setShowAiSuggestion(false)}>
                  <Icon name="X" size={16} color="#64748b" />
                </Pressable>
              </View>
              <Typography variant="bodySm" color="secondary" className="mt-1 text-secondary-600 dark:text-secondary-300">
                You mentioned balanced trees. Would you like me to insert query execution plans notes details?
              </Typography>
              <View className="flex-row gap-2 mt-3.5">
                <Button title="Insert summary" size="sm" variant="primary" className="py-2.5 rounded-xl flex-1" onPress={insertSuggestion} />
                <Button title="Dismiss" size="sm" variant="outline" className="py-2.5 rounded-xl flex-1" onPress={() => setShowAiSuggestion(false)} />
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Note editable text area */}
        <TextInput
          value={content}
          onChangeText={setContent}
          multiline
          placeholder="Start writing..."
          placeholderTextColor="#94a3b8"
          style={{
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            backgroundColor: isHighlight ? '#fef08a' : 'transparent',
            textAlignVertical: 'top',
            minHeight: 200,
          }}
          className="text-base text-secondary-800 dark:text-secondary-100 leading-relaxed p-0 mb-6"
        />

        {/* Voice Note count indicators */}
        {voiceNotesCount > 0 && (
          <View className="flex-row gap-2.5 mb-6 flex-wrap">
            {Array.from({ length: voiceNotesCount }).map((_, idx) => (
              <Card key={idx} variant="outlined" className="py-2 px-3 flex-row items-center gap-2 border-secondary-200 dark:border-secondary-800">
                <Icon name="Play" size={14} color="#8b5cf6" />
                <Typography variant="bodySm" className="font-bold">Voice Note {idx + 1}.mp3</Typography>
              </Card>
            ))}
          </View>
        )}

        {/* Citations panel section */}
        <View className="mt-4">
          <Typography variant="label" className="mb-3">Referenced Citations</Typography>
          <Card variant="default" className="border border-secondary-100 dark:border-secondary-800 flex-row items-center p-3.5">
            <View className="p-2.5 rounded-xl bg-danger-50 dark:bg-danger-950/20 mr-3 border border-danger-100/10">
              <Icon name="FileText" size={18} color="#ef4444" />
            </View>
            <View className="flex-1">
              <Typography variant="body" className="font-bold">Lecture 1: Intro to React Native.pdf</Typography>
              <Typography variant="caption" className="text-[10px] text-secondary-400 font-bold mt-0.5">Cited page 4 • Indexing matches</Typography>
            </View>
          </Card>
        </View>
      </ScreenContainer>

      {/* Audio Waveform and Recording bottom drawer bar */}
      {recording && (
        <Animated.View entering={SlideInDown} exiting={SlideOutDown} className="absolute bottom-16 left-0 right-0 bg-secondary-900 px-4 py-3 flex-row items-center justify-between z-20 border-t border-secondary-800">
          <View className="flex-row items-center gap-2">
            <View className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <Typography variant="bodySm" className="text-white font-bold">Recording Voice Note...</Typography>
          </View>
          
          <View className="flex-row gap-1 h-6 items-center px-4 flex-1 justify-center">
            {Array.from({ length: 12 }).map((_, i) => (
              <WaveBar key={i} index={i} />
            ))}
          </View>

          <Button title="Done" size="sm" variant="primary" className="py-2 px-4 rounded-xl" onPress={handleVoiceRecord} />
        </Animated.View>
      )}

      {/* Editor toolbar layout */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-secondary-900 border-t border-secondary-100 dark:border-secondary-800 py-3 px-4 flex-row justify-between items-center z-10">
        <View className="flex-row gap-4">
          <Pressable
            onPress={() => setIsBold(!isBold)}
            className={`p-2 rounded-xl active:bg-secondary-50 ${isBold ? 'bg-primary-50 dark:bg-primary-950/20' : ''}`}
          >
            <Icon name="Bold" size={20} color={isBold ? '#8b5cf6' : '#64748b'} />
          </Pressable>

          <Pressable
            onPress={() => setIsItalic(!isItalic)}
            className={`p-2 rounded-xl active:bg-secondary-50 ${isItalic ? 'bg-primary-50 dark:bg-primary-950/20' : ''}`}
          >
            <Icon name="Italic" size={20} color={isItalic ? '#8b5cf6' : '#64748b'} />
          </Pressable>

          <Pressable
            onPress={() => setIsHighlight(!isHighlight)}
            className={`p-2 rounded-xl active:bg-secondary-50 ${isHighlight ? 'bg-primary-50 dark:bg-primary-950/20' : ''}`}
          >
            <Icon name="Highlighter" size={20} color={isHighlight ? '#8b5cf6' : '#64748b'} />
          </Pressable>
        </View>

        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={handleVoiceRecord}
            className={`p-2.5 rounded-full active:scale-95 ${recording ? 'bg-red-500' : 'bg-primary-500'}`}
          >
            <Icon name={recording ? 'MicOff' : 'Mic'} size={18} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      {/* Floating Ask Sensei AI button */}
      {!recording && (
        <Pressable
          onPress={() => setShowSenseiDrawer(true)}
          style={{ bottom: 74 }}
          className="absolute right-5 p-3.5 rounded-full bg-primary-500 items-center justify-center shadow-lg shadow-primary-500/20 z-10 active:scale-95"
        >
          <Icon name="Sparkles" size={22} color="#ffffff" animate="float" />
        </Pressable>
      )}

      {/* Ask Sensei bottom sheet sliding panel drawer */}
      {showSenseiDrawer && (
        <Pressable onPress={() => setShowSenseiDrawer(false)} className="absolute inset-0 bg-black/40 z-30 justify-end">
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800 rounded-t-3xl p-5 max-h-[80%]"
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <Icon name="Sparkles" size={20} color="#8b5cf6" animate="float" />
                <Typography variant="h3" className="font-black text-secondary-900 dark:text-white">Ask Sensei</Typography>
              </View>
              <Pressable onPress={() => setShowSenseiDrawer(false)} className="p-1 rounded-full bg-secondary-100 dark:bg-secondary-800">
                <Icon name="X" size={16} color="#64748b" />
              </Pressable>
            </View>

            <Typography variant="body" color="muted" className="font-semibold text-secondary-500 mb-4">
              Ask Sensei helper queries about your active study note details:
            </Typography>

            <View className="flex-row gap-3 mb-6">
              <Button title="Summarize Text" size="sm" variant="outline" className="flex-1 py-3 rounded-xl" onPress={() => handleAskSenseiOption('summarize')} />
              <Button title="Make Quiz" size="sm" variant="outline" className="flex-1 py-3 rounded-xl" onPress={() => handleAskSenseiOption('quiz')} />
            </View>

            {typing && (
              <View className="py-4 items-center flex-row gap-2.5">
                <Icon name="Loader" size={18} color="#8b5cf6" animate="spin" />
                <Typography variant="body" color="muted" className="font-bold">Sensei is analyzing your notes...</Typography>
              </View>
            )}

            {senseiResponse ? (
              <Card variant="glass" className="p-4 border-secondary-100/50 bg-primary-50/30 dark:bg-primary-950/10 mb-4">
                <Typography variant="body" className="leading-relaxed font-medium">
                  {senseiResponse}
                </Typography>
              </Card>
            ) : null}
          </Animated.View>
        </Pressable>
      )}
    </ScreenContainer>
  );
}
