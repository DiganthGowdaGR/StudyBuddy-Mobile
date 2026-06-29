import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import {
  ScreenContainer,
  Typography,
  Card,
  Header,
  Section,
  Icon,
  Badge,
  Button,
} from '@/components/ui';

interface TimelineTask {
  id: string;
  time: string;
  title: string;
  desc: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

const INITIAL_TASKS: Record<number, TimelineTask[]> = {
  0: [ // Mon
    { id: 't1', time: '09:00 AM', title: 'React Native Scaffolding', desc: 'Verify folders structure imports.', priority: 'High', completed: true },
    { id: 't2', time: '01:00 PM', title: 'B-Trees review with Sensei', desc: 'Review node splitting indexes.', priority: 'Medium', completed: false },
    { id: 't3', time: '04:00 PM', title: 'Spanish Vocab list', desc: 'Read Level B2 conditional conjugations.', priority: 'Low', completed: false }
  ],
  1: [ // Tue
    { id: 't4', time: '10:00 AM', title: 'Calculus Derivatives', desc: 'Complete review exercises of chain rules.', priority: 'High', completed: false },
    { id: 't5', time: '03:00 PM', title: 'Ask Sensei about PyTorch', desc: 'Discuss matrix optimizations.', priority: 'Medium', completed: false }
  ],
  2: [ // Wed
    { id: 't6', time: '11:00 AM', title: 'Write Database Indexes Notes', desc: 'PostgreSQL indexes vs tables scan speed.', priority: 'High', completed: false }
  ]
};

const WEEK_DAYS = [
  { day: 'Mon', date: 29 },
  { day: 'Tue', date: 30 },
  { day: 'Wed', date: 1 },
  { day: 'Thu', date: 2 },
  { day: 'Fri', date: 3 },
  { day: 'Sat', date: 4 },
  { day: 'Sun', date: 5 }
];

export default function ScheduleScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(0);
  const [tasks, setTasks] = useState<Record<number, TimelineTask[]>>(INITIAL_TASKS);
  
  // AI Suggestions state
  const [showAiBlock, setShowAiBlock] = useState(true);

  const toggleTaskCompleted = (dayIndex: number, taskId: string) => {
    setTasks((prev) => {
      const dayTasks = prev[dayIndex] || [];
      const updated = dayTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      return { ...prev, [dayIndex]: updated };
    });
  };

  const handleAcceptAiBlock = () => {
    const suggestedTask: TimelineTask = {
      id: 'ai-suggested-1',
      time: '02:00 PM',
      title: 'Database Indexes Focus Block',
      desc: 'Deep study index structures in PostgreSQL (AI Suggested).',
      priority: 'High',
      completed: false
    };

    setTasks((prev) => {
      const dayTasks = prev[selectedDay] || [];
      // insert sorted or just append
      return { ...prev, [selectedDay]: [...dayTasks, suggestedTask] };
    });
    setShowAiBlock(false);
  };

  const getPriorityColor = (priority: TimelineTask['priority']) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
    }
  };

  const dayTasks = tasks[selectedDay] || [];

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-50 dark:bg-secondary-950 flex-1">
      <Header title="Study Planner" />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5 gap-6">
        
        {/* Weekly Calendar day selectors strip */}
        <View className="flex-row justify-between">
          {WEEK_DAYS.map((item, idx) => {
            const isSelected = selectedDay === idx;
            return (
              <Pressable
                key={item.day}
                onPress={() => setSelectedDay(idx)}
                className={`items-center p-2.5 rounded-xl border flex-1 mx-0.5 active:scale-95 ${
                  isSelected ? 'bg-primary-500 border-primary-500 shadow-sm' : 'bg-white dark:bg-secondary-900 border-secondary-100 dark:border-secondary-800'
                }`}
              >
                <Typography
                  variant="caption"
                  className={`text-[9px] font-bold ${isSelected ? 'text-white' : 'text-secondary-400'}`}
                >
                  {item.day}
                </Typography>
                <Typography
                  variant="h3"
                  className={`font-black mt-1 ${isSelected ? 'text-white' : 'text-secondary-900 dark:text-white'}`}
                >
                  {item.date}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        {/* AI suggested study blocks */}
        {showAiBlock && (
          <Animated.View entering={FadeInUp}>
            <Card variant="glass" className="border-secondary-100/50 bg-primary-50/50 dark:bg-primary-950/20 p-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-row items-center gap-2 flex-1 mr-4">
                  <Icon name="Sparkles" size={16} color="#8b5cf6" animate="float" />
                  <Typography variant="body" className="font-bold text-primary-600 dark:text-primary-400">AI Study Block Recommendation</Typography>
                </View>
                <Pressable onPress={() => setShowAiBlock(false)}>
                  <Icon name="X" size={16} color="#64748b" />
                </Pressable>
              </View>
              <Typography variant="bodySm" color="secondary" className="mt-1 text-secondary-600 dark:text-secondary-300">
                You have a Computer Science final exam in 3 days. Focus on Database Indexes for 30m today at 2:00 PM?
              </Typography>
              <View className="flex-row gap-2 mt-3.5">
                <Button title="Accept Block" size="sm" variant="primary" className="py-2.5 rounded-xl flex-1" onPress={handleAcceptAiBlock} />
                <Button title="Ignore" size="sm" variant="outline" className="py-2.5 rounded-xl flex-1" onPress={() => setShowAiBlock(false)} />
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Daily Timeline */}
        <Section title="Timeline & Tasks">
          {dayTasks.length === 0 ? (
            <Card className="items-center p-8 border border-secondary-100 dark:border-secondary-800 bg-white dark:bg-secondary-900">
              <Icon name="Calendar" size={32} color="#94a3b8" className="mb-2" />
              <Typography variant="body" color="muted" className="font-bold">No tasks scheduled for this day</Typography>
            </Card>
          ) : (
            <Animated.View layout={Layout.springify()} className="gap-4">
              {dayTasks.map((task) => (
                <View key={task.id} className="flex-row items-start">
                  {/* Time badge */}
                  <View className="w-20 pr-3.5 pt-1 items-end">
                    <Typography variant="caption" className="text-[10px] text-secondary-400 font-extrabold">{task.time}</Typography>
                  </View>

                  {/* Task Card details */}
                  <Card
                    variant="default"
                    className={`flex-1 border border-secondary-100 dark:border-secondary-800 ${
                      task.completed ? 'bg-secondary-50/50 dark:bg-secondary-900/50 opacity-70' : 'bg-white'
                    }`}
                    header={
                      <View className="flex-row justify-between items-center w-full">
                        <Typography
                          variant="h4"
                          style={{ textDecorationLine: task.completed ? 'line-through' : 'none' }}
                          className={`font-black flex-1 mr-2 ${task.completed ? 'text-secondary-400' : ''}`}
                        >
                          {task.title}
                        </Typography>
                        
                        <Badge
                          label={task.priority}
                          variant={getPriorityColor(task.priority)}
                          type="subtle"
                          className="px-2 py-0.5 rounded-lg border-transparent"
                        />
                      </View>
                    }
                  >
                    <Typography
                      variant="body"
                      color="secondary"
                      style={{ textDecorationLine: task.completed ? 'line-through' : 'none' }}
                      className={`font-medium text-secondary-500 mb-4 ${task.completed ? 'text-secondary-400' : ''}`}
                    >
                      {task.desc}
                    </Typography>

                    <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-secondary-50 dark:border-secondary-800">
                      {/* Checkbox */}
                      <Pressable
                        onPress={() => toggleTaskCompleted(selectedDay, task.id)}
                        className="flex-row items-center gap-2 active:scale-95"
                      >
                        <View
                          className={`w-5 h-5 rounded-full border items-center justify-center ${
                            task.completed ? 'bg-success-500 border-success-500' : 'border-secondary-300 dark:border-secondary-700'
                          }`}
                        >
                          {task.completed && <Icon name="Check" size={10} color="#ffffff" />}
                        </View>
                        <Typography variant="bodySm" className="text-secondary-500 font-bold">
                          {task.completed ? 'Completed' : 'Mark Done'}
                        </Typography>
                      </Pressable>

                      {/* Play focus trigger */}
                      {!task.completed && (
                        <Button
                          title="Start Focus"
                          variant="outline"
                          size="sm"
                          onPress={() =>
                            router.push({
                              pathname: '/focus-session',
                              params: { title: task.title },
                            })
                          }
                          className="py-1 px-3 rounded-xl"
                          leftIcon={<Icon name="Play" size={12} color="#8b5cf6" />}
                        />
                      )}
                    </View>
                  </Card>
                </View>
              ))}
            </Animated.View>
          )}
        </Section>

        {/* Upcoming Deadlines */}
        <Section title="Upcoming Deadlines">
          <Card
            header={
              <View className="flex-row justify-between items-center w-full">
                <View className="flex-row items-center">
                  <Icon name="AlertCircle" size={16} color="#ef4444" className="mr-2" />
                  <Typography variant="h4" className="font-bold">Computer Science Final Exam</Typography>
                </View>
                <Badge label="In 3 days" variant="danger" type="solid" className="px-2 py-0.5 rounded-lg" />
              </View>
            }
            footer="Date: July 2, 2026 • Course: CS 2026"
            className="border border-secondary-100 dark:border-secondary-800 mb-3"
          >
            <Typography variant="body" color="secondary" className="font-medium text-secondary-500">
              Covers PostgreSQL schema designs, B-Trees algorithms, and matrix linear regressions.
            </Typography>
          </Card>

          <Card
            header={
              <View className="flex-row justify-between items-center w-full">
                <View className="flex-row items-center">
                  <Icon name="Calendar" size={16} color="#eab308" className="mr-2" />
                  <Typography variant="h4" className="font-bold">Spanish Oral Presentation</Typography>
                </View>
                <Badge label="In 5 days" variant="warning" type="solid" className="px-2 py-0.5 rounded-lg" />
              </View>
            }
            footer="Date: July 4, 2026 • Course: SP 101"
            className="border border-secondary-100 dark:border-secondary-800"
          >
            <Typography variant="body" color="secondary" className="font-medium text-secondary-500">
              Deliver a 5 minute monologue using conditional conjugations and vocabulary terms.
            </Typography>
          </Card>
        </Section>
      </ScreenContainer>
    </ScreenContainer>
  );
}
