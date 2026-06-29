import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Polygon, Line, Text as SvgText, Circle } from 'react-native-svg';
import { ScreenContainer, Typography, Card, Header, Icon, Badge, Section } from '@/components/ui';

// Heatmap mock variables (5 weeks x 7 days)
const HEATMAP_DATA = [
  [2, 0, 1, 3, 0, 0, 1], // Week 1
  [0, 1, 2, 0, 3, 1, 0], // Week 2
  [1, 3, 0, 1, 2, 0, 2], // Week 3
  [2, 1, 1, 0, 3, 0, 1], // Week 4
  [3, 2, 0, 1, 2, 0, 0], // Week 5 (Current)
];

const HEATMAP_COLORS = [
  'bg-secondary-200 dark:bg-secondary-800',       // 0: None
  'bg-primary-200 dark:bg-primary-950/40',         // 1: Light Focus (15m)
  'bg-primary-400 dark:bg-primary-500/50',         // 2: Medium Focus (30m)
  'bg-primary-600 dark:bg-primary-500',            // 3: Deep Focus (60m+)
];

// Radar Chart mock variables
const RADAR_LABELS = ['CS', 'Math', 'Bio', 'Lang', 'Lit'];
const RADAR_VALUES = [0.85, 0.70, 0.50, 0.65, 0.40];

const cx = 100;
const cy = 100;
const r = 65;

const getCoordinates = (i: number, val: number) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  const x = cx + r * val * Math.cos(angle);
  const y = cy + r * val * Math.sin(angle);
  return { x, y };
};

const ring1Points = [0, 1, 2, 3, 4].map(i => {
  const { x, y } = getCoordinates(i, 1);
  return `${x},${y}`;
}).join(' ');

const ring2Points = [0, 1, 2, 3, 4].map(i => {
  const { x, y } = getCoordinates(i, 0.66);
  return `${x},${y}`;
}).join(' ');

const ring3Points = [0, 1, 2, 3, 4].map(i => {
  const { x, y } = getCoordinates(i, 0.33);
  return `${x},${y}`;
}).join(' ');

const dataPoints = [0, 1, 2, 3, 4].map(i => {
  const { x, y } = getCoordinates(i, RADAR_VALUES[i]);
  return `${x},${y}`;
}).join(' ');

// Daily Focus Study Times
const WEEKLY_STUDY_TIME = [
  { day: 'Mon', mins: 45 },
  { day: 'Tue', mins: 60 },
  { day: 'Wed', mins: 30 },
  { day: 'Thu', mins: 90 },
  { day: 'Fri', mins: 20 },
  { day: 'Sat', mins: 0 },
  { day: 'Sun', mins: 15 }
];

// Achievements unlockable list
const ACHIEVEMENTS = [
  { id: 'a1', title: 'Night Owl 🦉', desc: 'Studied past 11:00 PM', unlocked: true },
  { id: 'a2', title: 'Focus King 👑', desc: 'Focused for 5 Pomodoros', unlocked: true },
  { id: 'a3', title: 'Flashcard Champ 🏆', desc: 'Reviewed 100 Cards', unlocked: false },
];

export default function AnalyticsScreen() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-50 dark:bg-secondary-950 flex-1">
      <Header
        title="Study Analytics"
        showBackButton={true}
        onBackButtonPress={handleClose}
      />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5 gap-6">
        
        {/* Core Progress cards */}
        <View className="flex-row gap-4 w-full">
          <Card variant="default" className="flex-1 p-4 border border-secondary-100 dark:border-secondary-800">
            <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">FOCUS EFFICIENCY</Typography>
            <Typography variant="h2" className="font-black text-primary-500 mt-1">94%</Typography>
            <Typography variant="caption" className="text-[10px] text-secondary-400 font-bold mt-1">Based on Pomodoro ticks</Typography>
          </Card>

          <Card variant="default" className="flex-1 p-4 border border-secondary-100 dark:border-secondary-800">
            <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">TOTAL TIME</Typography>
            <Typography variant="h2" className="font-black mt-1">4.3 Hours</Typography>
            <Typography variant="caption" className="text-[10px] text-secondary-400 font-bold mt-1">Focused study this week</Typography>
          </Card>
        </View>

        {/* Knowledge Heatmap widget (Github contributions style) */}
        <Card variant="glass" className="border border-primary-100/10 p-4">
          <Typography variant="h4" className="font-black mb-3">Study Heatmap</Typography>
          <Typography variant="bodySm" color="muted" className="font-semibold text-secondary-500 mb-4">
            Daily consistency over the last 5 weeks:
          </Typography>
          
          <View className="flex-col gap-1 items-start">
            {HEATMAP_DATA.map((row, rowIdx) => (
              <View key={rowIdx} className="flex-row gap-1">
                {row.map((val, valIdx) => (
                  <View
                    key={valIdx}
                    className={`w-[26px] h-[26px] rounded-[6px] ${HEATMAP_COLORS[val]}`}
                  />
                ))}
              </View>
            ))}
          </View>

          <View className="flex-row justify-between items-center mt-4 pt-2 border-t border-secondary-100 dark:border-secondary-900">
            <Typography variant="caption" className="text-[10px] text-secondary-400 font-bold">Mon - Sun columns</Typography>
            <View className="flex-row gap-1 items-center">
              <Typography variant="caption" className="text-[10px] text-secondary-400 font-bold mr-1">Less</Typography>
              <View className="w-2.5 h-2.5 rounded bg-secondary-200 dark:bg-secondary-800" />
              <View className="w-2.5 h-2.5 rounded bg-primary-200" />
              <View className="w-2.5 h-2.5 rounded bg-primary-400" />
              <View className="w-2.5 h-2.5 rounded bg-primary-600" />
              <Typography variant="caption" className="text-[10px] text-secondary-400 font-bold ml-1">More</Typography>
            </View>
          </View>
        </Card>

        {/* Custom SVG Radar Chart */}
        <Card variant="glass" className="border border-primary-100/10 p-5 items-center justify-center">
          <Typography variant="h4" className="font-black self-start mb-4">Subject Mastery</Typography>
          
          <View className="w-[200px] h-[200px] items-center justify-center">
            <Svg width="200" height="200" viewBox="0 0 200 200">
              {/* Polar grids */}
              <Polygon points={ring1Points} stroke="#94a3b8" strokeWidth="0.5" fill="none" opacity="0.3" />
              <Polygon points={ring2Points} stroke="#94a3b8" strokeWidth="0.5" fill="none" opacity="0.3" />
              <Polygon points={ring3Points} stroke="#94a3b8" strokeWidth="0.5" fill="none" opacity="0.3" />
              
              {/* Axes lines */}
              {[0, 1, 2, 3, 4].map(i => {
                const outer = getCoordinates(i, 1);
                return (
                  <Line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="#94a3b8"
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                );
              })}

              {/* Data polygon */}
              <Polygon points={dataPoints} stroke="#8b5cf6" strokeWidth="1.5" fill="#8b5cf6" fillOpacity="0.25" />

              {/* Data circles vertices */}
              {[0, 1, 2, 3, 4].map(i => {
                const pt = getCoordinates(i, RADAR_VALUES[i]);
                return (
                  <Circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="3"
                    fill="#8b5cf6"
                  />
                );
              })}

              {/* Radar Labels */}
              {[0, 1, 2, 3, 4].map(i => {
                const labelPos = getCoordinates(i, 1.22);
                return (
                  <SvgText
                    key={i}
                    x={labelPos.x}
                    y={labelPos.y + 3}
                    fontSize="9"
                    fontWeight="bold"
                    fill="#64748b"
                    textAnchor="middle"
                  >
                    {RADAR_LABELS[i]}
                  </SvgText>
                );
              })}
            </Svg>
          </View>
        </Card>

        {/* Study Time Chart daily logs */}
        <Section title="Study Time Distribution">
          <Card variant="default" className="border border-secondary-100 dark:border-secondary-800 p-4 gap-3.5">
            {WEEKLY_STUDY_TIME.map((item) => (
              <View key={item.day} className="flex-row items-center">
                <View className="w-10">
                  <Typography variant="bodySm" className="font-bold text-secondary-500">{item.day}</Typography>
                </View>
                <View className="flex-1 h-3.5 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden mr-4">
                  <View
                    style={{ width: `${(item.mins / 90) * 100}%` }}
                    className="h-full bg-primary-500 rounded-full"
                  />
                </View>
                <View className="w-12 items-end">
                  <Typography variant="bodySm" className="font-extrabold text-secondary-900 dark:text-white">{item.mins}m</Typography>
                </View>
              </View>
            ))}
          </Card>
        </Section>

        {/* AI insights card */}
        <Card variant="glass" className="border-secondary-100/50 bg-primary-50/50 dark:bg-primary-950/20 p-5">
          <View className="flex-row items-start gap-3">
            <View className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/50 justify-center items-center mt-0.5">
              <Icon name="Sparkles" size={18} color="#8b5cf6" animate="float" />
            </View>
            <View className="flex-1">
              <Typography variant="h4" className="font-extrabold text-primary-600 dark:text-primary-400">Coach Analytics Review</Typography>
              <Typography variant="body" color="secondary" className="font-medium text-secondary-600 dark:text-secondary-300 mt-1 leading-relaxed">
                "You review flashcards 25% more effectively during 25-minute study intervals on schedule days. Focus score yields peaked during Thursday evening slots!"
              </Typography>
            </View>
          </View>
        </Card>

        {/* Achievements list */}
        <Section title="Scholarly Achievements">
          <View className="gap-3">
            {ACHIEVEMENTS.map((item) => (
              <Card
                key={item.id}
                variant={item.unlocked ? 'default' : 'outlined'}
                className={`flex-row items-center p-3.5 border ${
                  item.unlocked ? 'border-secondary-200 dark:border-secondary-800' : 'border-dashed border-secondary-300 dark:border-secondary-800 opacity-60'
                }`}
              >
                <View className="mr-4">
                  <View className={`w-10 h-10 rounded-full justify-center items-center ${item.unlocked ? 'bg-primary-50 dark:bg-primary-950/20' : 'bg-secondary-100 dark:bg-secondary-800'}`}>
                    <Icon name={item.unlocked ? 'Award' : 'Lock'} size={18} color={item.unlocked ? '#8b5cf6' : '#64748b'} />
                  </View>
                </View>

                <View className="flex-1">
                  <Typography variant="body" className="font-black text-secondary-900 dark:text-white">{item.title}</Typography>
                  <Typography variant="caption" className="text-secondary-400 font-semibold mt-0.5">{item.desc}</Typography>
                </View>

                <Badge
                  label={item.unlocked ? 'Unlocked' : 'Locked'}
                  variant={item.unlocked ? 'success' : 'neutral'}
                  type="subtle"
                  className="px-2 py-0.5 rounded-lg border-transparent"
                />
              </Card>
            ))}
          </View>
        </Section>

        {/* Recent Wins timelines */}
        <Section title="Recent Milestone Wins">
          <View className="gap-3.5 pl-1.5">
            <View className="flex-row items-start">
              <View className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 mr-3.5 z-10" />
              <View className="flex-1 pb-4 border-l border-secondary-200 dark:border-secondary-800 pl-4 -ml-[20px] -mt-1.5 pt-1">
                <Typography variant="body" className="font-bold text-secondary-900 dark:text-white">Achieved 5 Day active Streak</Typography>
                <Typography variant="bodySm" color="muted" className="mt-0.5 text-secondary-500 font-semibold">Completed focus schedule checks • Jul 28</Typography>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-2 h-2 rounded-full bg-success-500 mt-1.5 mr-3.5 z-10" />
              <View className="flex-1 pb-4 pl-4 -ml-[20px] -mt-1.5 pt-1">
                <Typography variant="body" className="font-bold text-secondary-900 dark:text-white">CS Indexes deck fully memorized</Typography>
                <Typography variant="bodySm" color="muted" className="mt-0.5 text-secondary-500 font-semibold">Cleared Leitner flashcards reviews • Jul 25</Typography>
              </View>
            </View>
          </View>
        </Section>

      </ScreenContainer>
    </ScreenContainer>
  );
}
