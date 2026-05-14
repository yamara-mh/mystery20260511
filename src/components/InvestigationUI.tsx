import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../stores/gameStore';
import { engine } from '../engine/ScenarioEngine';
import type { LayoutInfo } from '../utils/responsive';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/responsive';
import styles from './InvestigationUI.module.css';

interface InvestigationUIProps {
  layout: LayoutInfo;
}

type InvestMode = 'main' | 'examine' | 'talk' | 'present' | 'move' | 'organize';

export default function InvestigationUI({ layout }: InvestigationUIProps) {
  const { t } = useTranslation();
  const phase = useGameStore((s) => s.phase);
  const investigation = useGameStore((s) => s.investigation);
  const [mode, setMode] = useState<InvestMode>('main');
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });
  const [examResult, setExamResult] = useState<string | null>(null);
  const examAreaRef = useRef<HTMLDivElement>(null);

  const toggleInventory = useGameStore((s) => s.toggleInventory);
  const persons = useGameStore((s) => s.persons);

  const handleExamineMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!examAreaRef.current) return;
    const rect = examAreaRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    setCursorPos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  }, []);

  const handleExamineClick = useCallback(() => {
    const absX = cursorPos.x * GAME_WIDTH;
    const absY = cursorPos.y * GAME_HEIGHT;

    for (const hotspot of investigation.hotspots) {
      if (
        absX >= hotspot.x &&
        absX <= hotspot.x + hotspot.width &&
        absY >= hotspot.y &&
        absY <= hotspot.y + hotspot.height
      ) {
        if (hotspot.examined) {
          useGameStore.getState().setFlag(hotspot.examined, true);
        }
        engine.jumpToLabel(hotspot.label);
        engine.advanceAndContinue();
        setMode('main');
        return;
      }
    }
    setExamResult(t('investigate_nothing'));
    setTimeout(() => setExamResult(null), 1500);
  }, [cursorPos, investigation.hotspots, t]);

  const handleDeduce = useCallback(() => {
    toggleInventory(true);
  }, [toggleInventory]);

  if (phase !== 'investigation' || !investigation.active) return null;

  const hasPersons = persons.length > 0;

  return (
    <div
      className={styles.container}
      style={{
        left: layout.offsetX,
        top: layout.offsetY,
        width: layout.width,
        height: layout.height,
      }}
    >
      {mode === 'main' && (
        <div className={styles.menuBar} style={{ fontSize: layout.scale * 18 }}>
          <button className={styles.menuBtn} onClick={() => setMode('examine')}>
            {t('investigate_examine')}
          </button>
          {hasPersons && (
            <button className={styles.menuBtn} onClick={() => setMode('talk')}>
              {t('investigate_talk')}
            </button>
          )}
          {hasPersons && (
            <button className={styles.menuBtn} onClick={() => setMode('present')}>
              {t('investigate_present')}
            </button>
          )}
          <button className={styles.menuBtn} onClick={() => {
            useGameStore.getState().clearInvestigation();
            engine.jumpToLabel(investigation.exitLabel);
            engine.advanceAndContinue();
          }}>
            {t('investigate_move')}
          </button>
          <button className={styles.menuBtn} onClick={() => setMode('organize')}>
            {t('investigate_organize')}
          </button>
        </div>
      )}

      {mode === 'examine' && (
        <div
          ref={examAreaRef}
          className={styles.examineArea}
          onMouseMove={handleExamineMove}
          onTouchMove={handleExamineMove}
          onClick={handleExamineClick}
        >
          <div
            className={styles.cursor}
            style={{
              left: `${cursorPos.x * 100}%`,
              top: `${cursorPos.y * 100}%`,
            }}
          />
          {examResult && (
            <div className={styles.examResult} style={{ fontSize: layout.scale * 18 }}>
              {examResult}
            </div>
          )}
          <button
            className={styles.backBtn}
            style={{ fontSize: layout.scale * 16 }}
            onClick={(e) => { e.stopPropagation(); setMode('main'); }}
          >
            {t('ui_back')}
          </button>
          {investigation.deduceEnabled && (
            <button
              className={styles.deduceBtn}
              style={{ fontSize: layout.scale * 16 }}
              onClick={(e) => { e.stopPropagation(); handleDeduce(); }}
            >
              {t('investigate_deduce')}
            </button>
          )}
        </div>
      )}

      {mode === 'talk' && (
        <div className={styles.subMenu}>
          <div className={styles.subTitle} style={{ fontSize: layout.scale * 20 }}>
            {t('investigate_talk')}
          </div>
          {/* Talk options are driven by scenario choice commands */}
          <button
            className={styles.menuBtn}
            style={{ fontSize: layout.scale * 18 }}
            onClick={() => setMode('main')}
          >
            {t('ui_back')}
          </button>
        </div>
      )}

      {mode === 'present' && (
        <div className={styles.subMenu}>
          <div className={styles.subTitle} style={{ fontSize: layout.scale * 20 }}>
            {t('investigate_present')}
          </div>
          <button
            className={styles.menuBtn}
            style={{ fontSize: layout.scale * 18 }}
            onClick={() => { toggleInventory(true); setMode('main'); }}
          >
            {t('inventory_evidence')}
          </button>
          <button
            className={styles.menuBtn}
            style={{ fontSize: layout.scale * 18 }}
            onClick={() => setMode('main')}
          >
            {t('ui_back')}
          </button>
        </div>
      )}

      {mode === 'organize' && (
        <div className={styles.subMenu}>
          <div className={styles.subTitle} style={{ fontSize: layout.scale * 20 }}>
            {t('investigate_organize')}
          </div>
          <button
            className={styles.menuBtn}
            style={{ fontSize: layout.scale * 18 }}
            onClick={() => setMode('main')}
          >
            {t('ui_back')}
          </button>
        </div>
      )}
    </div>
  );
}
