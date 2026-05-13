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

  return (
    <div
      className={styles.container}
      style={{
        left: layout.offsetX,
        top: layout.offsetY,
        width: layout.width,
        height: layout.height,
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
            style={{ fontSize: layout.scale * (i === 0 ? 36 : 22) }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
