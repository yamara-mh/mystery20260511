import { useState, useCallback, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import TextBox from './components/TextBox';
import ChoiceMenu from './components/ChoiceMenu';
import MoveMenu from './components/MoveMenu';
import InvestigationUI from './components/InvestigationUI';
import TestimonyUI from './components/TestimonyUI';
import InventoryScreen from './components/InventoryScreen';
import MenuScreen from './components/MenuScreen';
import TitleScreen from './components/TitleScreen';
import SceneChange from './components/SceneChange';
import HUD from './components/HUD';
import { useSaveStore } from './stores/saveStore';
import type { LayoutInfo } from './utils/responsive';
import { GAME_WIDTH, GAME_HEIGHT } from './utils/responsive';

export default function App() {
  const [layout, setLayout] = useState<LayoutInfo>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    orientation: 'landscape',
  });

  const handleLayoutChange = useCallback((newLayout: LayoutInfo) => {
    setLayout(newLayout);
  }, []);

  // Load settings on mount
  useEffect(() => {
    useSaveStore.getState().loadSettings();
    useSaveStore.getState().loadSaves();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#000',
        touchAction: 'none',
      }}
    >
      <GameCanvas onLayoutChange={handleLayoutChange} />
      <TitleScreen layout={layout} />
      <SceneChange layout={layout} />
      <HUD layout={layout} />
      <InvestigationUI layout={layout} />
      <TestimonyUI layout={layout} />
      <TextBox layout={layout} />
      <ChoiceMenu layout={layout} />
      <MoveMenu layout={layout} />
      <InventoryScreen layout={layout} />
      <MenuScreen layout={layout} />
    </div>
  );
}
