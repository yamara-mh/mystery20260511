import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../stores/gameStore';
import { useSaveStore } from '../stores/saveStore';
import { engine } from '../engine/ScenarioEngine';
import { loadChapter1 } from '../data/scenario/chapter1';
import type { LayoutInfo } from '../utils/responsive';
import styles from './TitleScreen.module.css';

interface TitleScreenProps {
  layout: LayoutInfo;
}

export default function TitleScreen({ layout }: TitleScreenProps) {
  const { t } = useTranslation();
  const phase = useGameStore((s) => s.phase);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showLoadSlots, setShowLoadSlots] = useState(false);
  const saves = useSaveStore((s) => s.saves);
  const hasSaves = saves.some((s) => s !== null);

  // Animated background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || phase !== 'title') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const particles: Array<{ x: number; y: number; size: number; speed: number; alpha: number }> = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * 1280,
        y: Math.random() * 720,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, 1280, 720);

      // Dark gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 720);
      grad.addColorStop(0, '#0a0a1a');
      grad.addColorStop(0.5, '#141428');
      grad.addColorStop(1, '#1a1a30');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);

      // Stars / particles
      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = 720;
          p.x = Math.random() * 1280;
        }
        ctx.globalAlpha = p.alpha * (0.5 + 0.5 * Math.sin(frame * 0.02 + p.x));
        ctx.fillStyle = '#aaccff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      return requestAnimationFrame(render);
    };

    const id = render();
    return () => cancelAnimationFrame(id);
  }, [phase]);

  const handleNewGame = useCallback(() => {
    const chapterData = loadChapter1();
    engine.loadChapter(chapterData);
    useSaveStore.getState().startPlayTimer();
    engine.startScript('main').catch(console.error);
  }, []);

  const handleContinue = useCallback(() => {
    if (!hasSaves) return;
    setShowLoadSlots(true);
  }, [hasSaves]);

  const handleLoadSlot = useCallback((slot: number) => {
    const chapterData = loadChapter1();
    engine.loadChapter(chapterData);
    const saveData = useSaveStore.getState().loadGame(slot);
    if (saveData) {
      useSaveStore.getState().startPlayTimer();
      engine.resumeFromCommandIndex(saveData.scriptId, saveData.commandIndex).catch(console.error);
    }
    setShowLoadSlots(false);
  }, []);

  if (phase !== 'title') return null;

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
    >
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className={styles.bgCanvas}
      />
      <div className={styles.content}>
        <h1 className={styles.title} style={{ fontSize: fontScale * 48 }}>
          {t('title_game')}
        </h1>
        <p className={styles.subtitle} style={{ fontSize: fontScale * 20 }}>
          {t('title_subtitle')}
        </p>
        {!showLoadSlots ? (
          <div className={styles.buttons}>
            <button
              className={styles.startBtn}
              style={{ fontSize: fontScale * 22 }}
              onClick={handleNewGame}
            >
              {t('title_new_game')}
            </button>
            <button
              className={`${styles.continueBtn} ${!hasSaves ? styles.disabled : ''}`}
              style={{ fontSize: fontScale * 22 }}
              onClick={handleContinue}
              disabled={!hasSaves}
            >
              {t('title_continue')}
            </button>
          </div>
        ) : (
          <div className={styles.loadSlots}>
            <h2 style={{ color: '#aaccff', fontSize: fontScale * 22, marginBottom: 10 }}>
              {t('menu_load')}
            </h2>
            <div className={styles.slotList}>
              {saves.map((save, i) => (
                <button
                  key={i}
                  className={styles.slotItem}
                  style={{ fontSize: fontScale * 16 }}
                  onClick={() => save && handleLoadSlot(i)}
                  disabled={!save}
                >
                  <span className={styles.slotLabel}>
                    {i === 0 ? t('save_auto') : t('save_slot', { num: i + 1 })}
                  </span>
                  {save ? (
                    <span className={styles.slotInfo}>
                      {new Date(save.timestamp).toLocaleString('ja-JP')}
                    </span>
                  ) : (
                    <span className={styles.slotEmpty}>{t('save_empty')}</span>
                  )}
                </button>
              ))}
            </div>
            <button
              className={styles.continueBtn}
              style={{ fontSize: fontScale * 18, marginTop: 10 }}
              onClick={() => setShowLoadSlots(false)}
            >
              {t('ui_back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
