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

  return (
    <div
      className={styles.overlay}
      style={{
        left: layout.offsetX,
        top: layout.offsetY,
        width: layout.width,
        height: layout.height,
      }}
    >
      <div className={styles.choiceContainer}>
        {choiceOptions.map((opt, i) => (
          <button
            key={i}
            className={styles.choiceButton}
            style={{ fontSize: layout.scale * 20 }}
            onClick={() => handleChoice(opt.next)}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
