import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { engine } from '../engine/ScenarioEngine';
import type { LayoutInfo } from '../utils/responsive';
import styles from './SceneChange.module.css';

interface SceneChangeProps {
  layout: LayoutInfo;
}

export default function SceneChange({ layout }: SceneChangeProps) {
  const phase = useGameStore((s) => s.phase);
  const textBox = useGameStore((s) => s.display.textBox);

  const handleClick = useCallback(() => {
    engine.advanceAndContinue();
  }, []);

  if (phase !== 'scene_change') return null;

  const lines = textBox.text.split('\n');
  const isPortrait = layout.orientation === 'portrait';
  const fontScale = isPortrait ? Math.max(layout.scale, 0.7) : layout.scale;

  return (
    <div
      className={styles.container}
      style={{
        left: 0,
        top: 0,
        width: '100vw',
        height: '100dvh',
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div className={styles.content}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={i === 0 ? styles.mainText : styles.subText}
            style={{ fontSize: fontScale * (i === 0 ? 36 : 22) }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
