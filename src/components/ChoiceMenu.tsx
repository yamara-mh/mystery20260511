import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { engine } from '../engine/ScenarioEngine';
import type { LayoutInfo } from '../utils/responsive';
import styles from './ChoiceMenu.module.css';

interface ChoiceMenuProps {
  layout: LayoutInfo;
}

export default function ChoiceMenu({ layout }: ChoiceMenuProps) {
  const choiceOptions = useGameStore((s) => s.choiceOptions);
  const phase = useGameStore((s) => s.phase);
  const clearChoiceOptions = useGameStore((s) => s.clearChoiceOptions);

  const handleChoice = useCallback((next: string) => {
    clearChoiceOptions();
    engine.jumpToLabel(next);
    engine.advanceAndContinue();
  }, [clearChoiceOptions]);

  if (phase !== 'choice' || choiceOptions.length === 0) return null;

  const isPortrait = layout.orientation === 'portrait';
  const overlayStyle: React.CSSProperties = isPortrait
    ? { left: 0, top: layout.offsetY + layout.height, width: '100vw', height: layout.uiBottomHeight }
    : { left: layout.offsetX, top: layout.offsetY, width: layout.width, height: layout.height };
  const fontScale = isPortrait ? Math.max(layout.scale, 0.7) : layout.scale;

  return (
    <div
      className={styles.overlay}
      style={overlayStyle}
    >
      <div className={styles.choiceContainer} style={isPortrait ? { maxWidth: '95%' } : undefined}>
        {choiceOptions.map((opt, i) => (
          <button
            key={i}
            className={styles.choiceButton}
            style={{ fontSize: fontScale * 20, minWidth: isPortrait ? 0 : 300 }}
            onClick={() => handleChoice(opt.next)}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
