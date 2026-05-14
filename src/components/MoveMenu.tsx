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
        <div
          style={{
            color: '#aaccff',
            fontSize: fontScale * 20,
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
            style={{ fontSize: fontScale * 20, minWidth: isPortrait ? 0 : 300 }}
            onClick={() => handleMove(dest.label)}
          >
            {dest.name}
          </button>
        ))}
      </div>
    </div>
  );
}
