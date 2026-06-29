import React from 'react';
import { Tabs } from 'expo-router';
import { BottomNavigation } from '@/components/ui/bottom-navigation';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => {
        const activeRoute = props.state.routeNames[props.state.index];
        return (
          <BottomNavigation
            activeTab={activeRoute}
            onTabChange={(tabName) => props.navigation.navigate(tabName)}
          />
        );
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="library" />
      <Tabs.Screen name="schedule" />
      <Tabs.Screen name="sensei" />
      <Tabs.Screen name="cards" />
      <Tabs.Screen name="notes" />
    </Tabs>
  );
}
