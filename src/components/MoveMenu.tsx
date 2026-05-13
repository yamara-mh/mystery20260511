import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../stores/gameStore';
import { engine } from '../engine/ScenarioEngine';
import type { LayoutInfo } from '../utils/responsive';
import styles from './ChoiceMenu.module.css';

interface MoveMenuProps {
  layout: LayoutInfo;
}

export default function MoveMenu({ layout }: MoveMenuProps) {
  const { t } = useTranslation();
  const destinations = useGameStore((s) => s.destinations);
  const phase = useGameStore((s) => s.phase);
  const clearDestinations = useGameStore((s) => s.clearDestinations);

  const handleMove = useCallback(
    (label: string) => {
      clearDestinations();
      engine.jumpToLabel(label);
      engine.advanceAndContinue();
    },
    [clearDestinations]
  );

  if (phase !== 'move' || destinations.length === 0) return null;

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
        <div
          style={{
            color: '#aaccff',
            fontSize: layout.scale * 20,
            textAlign: 'center',
            marginBottom: 8,
            fontFamily: "'Noto Sans JP', sans-serif",
          }}
        >
          {t('investigate_move')}
        </div>
        {destinations.map((dest, i) => (
          <button
            key={i}
            className={styles.choiceButton}
            style={{ fontSize: layout.scale * 20 }}
            onClick={() => handleMove(dest.label)}
          >
            {dest.name}
          </button>
        ))}
      </div>
    </div>
  );
}
