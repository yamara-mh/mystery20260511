import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../stores/gameStore';
import { engine } from '../engine/ScenarioEngine';
import type { LayoutInfo } from '../utils/responsive';
import styles from './TestimonyUI.module.css';

interface TestimonyUIProps {
  layout: LayoutInfo;
}

export default function TestimonyUI({ layout }: TestimonyUIProps) {
  const { t } = useTranslation();
  const testimony = useGameStore((s) => s.testimony);
  const phase = useGameStore((s) => s.phase);
  const setTestimony = useGameStore((s) => s.setTestimony);
  const setTextBox = useGameStore((s) => s.setTextBox);
  const setPresentMode = useGameStore((s) => s.setPresentMode);

  // Display current statement
  useEffect(() => {
    if (!testimony.active || testimony.statements.length === 0) return;
    const stmt = testimony.statements[testimony.currentIndex];
    if (!stmt) return;
    setTextBox({
      visible: true,
      speaker: stmt.speaker,
      text: stmt.text,
      displayedChars: 0,
      isComplete: false,
      isThinking: false,
    });
  }, [testimony.active, testimony.currentIndex, testimony.statements, setTextBox]);

  const handleNext = useCallback(() => {
    if (testimony.currentIndex < testimony.statements.length - 1) {
      setTestimony({ currentIndex: testimony.currentIndex + 1 });
    } else if (testimony.phase === 'listen') {
      setTestimony({ phase: 'cross_exam', currentIndex: 0 });
    } else {
      setTestimony({ currentIndex: 0 });
    }
  }, [testimony.currentIndex, testimony.statements.length, testimony.phase, setTestimony]);

  const handlePrev = useCallback(() => {
    if (testimony.currentIndex > 0) {
      setTestimony({ currentIndex: testimony.currentIndex - 1 });
    }
  }, [testimony.currentIndex, setTestimony]);

  const handlePress = useCallback(() => {
    const stmt = testimony.statements[testimony.currentIndex];
    if (stmt?.pressLabel) {
      useGameStore.getState().clearTestimony();
      engine.jumpToLabel(stmt.pressLabel);
      engine.advanceAndContinue();
    }
  }, [testimony.statements, testimony.currentIndex]);

  const handlePresent = useCallback(() => {
    const stmt = testimony.statements[testimony.currentIndex];
    if (!stmt?.presentTargets || stmt.presentTargets.length === 0) return;

    setPresentMode(true, (_type, id) => {
      setPresentMode(false);
      const target = stmt.presentTargets?.find((pt) => pt.evidenceId === id);
      if (target) {
        useGameStore.getState().clearTestimony();
        engine.jumpToLabel(target.label);
        engine.advanceAndContinue();
      } else {
        // Wrong evidence — penalty handled by scenario
        useGameStore.getState().clearTestimony();
        const wrongLabel = stmt.presentTargets?.[0]?.label;
        if (wrongLabel) {
          engine.jumpToLabel(wrongLabel);
          engine.advanceAndContinue();
        }
      }
    });
  }, [testimony.statements, testimony.currentIndex, setPresentMode]);

  if (phase !== 'testimony' || !testimony.active) return null;

  const isCrossExam = testimony.phase === 'cross_exam';

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
      {/* Title bar */}
      <div className={styles.titleBar} style={{ fontSize: layout.scale * 16 }}>
        <span className={styles.titleText}>
          {isCrossExam ? t('testimony_cross_exam') : t('testimony_title')}
          ：{testimony.title}
        </span>
        <span className={styles.counter}>
          {t('testimony_statement', {
            current: testimony.currentIndex + 1,
            total: testimony.statements.length,
          })}
        </span>
      </div>

      {/* Navigation */}
      <div className={styles.navBar} style={{ fontSize: layout.scale * 18 }}>
        <button
          className={styles.navBtn}
          onClick={handlePrev}
          disabled={testimony.currentIndex === 0}
        >
          ◀ {t('ui_prev')}
        </button>

        {isCrossExam && (
          <>
            <button className={styles.pressBtn} onClick={handlePress}>
              {t('testimony_press')}
            </button>
            <button className={styles.presentBtn} onClick={handlePresent}>
              {t('testimony_present')}
            </button>
          </>
        )}

        <button className={styles.navBtn} onClick={handleNext}>
          {t('ui_next')} ▶
        </button>
      </div>
    </div>
  );
}
