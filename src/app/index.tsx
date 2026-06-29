import React from 'react';
import { Loader, ScreenContainer } from '@/components/ui';

export default function IndexLandingScreen() {
  return (
    <ScreenContainer safeArea={false} className="bg-secondary-950 justify-center items-center flex-1">
      <Loader size="large" label="Configuring your workspace..." />
    </ScreenContainer>
  );
}
