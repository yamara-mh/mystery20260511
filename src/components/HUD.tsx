import { useTranslation } from 'react-i18next';
import { useGameStore } from '../stores/gameStore';
import type { LayoutInfo } from '../utils/responsive';
import styles from './HUD.module.css';

interface HUDProps {
  layout: LayoutInfo;
}

export default function HUD({ layout }: HUDProps) {
  const { t } = useTranslation();
  const phase = useGameStore((s) => s.phase);
  const penaltyHP = useGameStore((s) => s.penaltyHP);
  const maxPenaltyHP = useGameStore((s) => s.maxPenaltyHP);
  const toggleInventory = useGameStore((s) => s.toggleInventory);
  const toggleMenu = useGameStore((s) => s.toggleMenu);
  const testimony = useGameStore((s) => s.testimony);

  if (phase === 'title' || phase === 'scene_change') return null;

  const showPenalty = testimony.active;

  return (
    <div
      className={styles.container}
      style={{
        left: layout.offsetX,
        top: layout.offsetY,
        width: layout.width,
      }}
    >
      <div className={styles.topBar} style={{ fontSize: layout.scale * 14 }}>
        {showPenalty && (
          <div className={styles.penalty}>
            {Array.from({ length: maxPenaltyHP }).map((_, i) => (
              <span
                key={i}
                className={i < penaltyHP ? styles.hpFull : styles.hpEmpty}
              >
                ♥
              </span>
            ))}
          </div>
        )}
        <div className={styles.spacer} />
        <button
          className={styles.hudBtn}
          onClick={() => toggleInventory()}
          title={t('inventory_evidence')}
        >
          📋
        </button>
        <button
          className={styles.hudBtn}
          onClick={() => toggleMenu()}
          title={t('menu_title')}
        >
          ⚙
        </button>
      </div>
    </div>
  );
}
