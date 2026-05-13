import { useCallback, useEffect, useRef } from 'react';
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
    useSaveStore.getState().loadSaves();
    useGameStore.getState().toggleMenu(true);
  }, []);

  if (phase !== 'title') return null;

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
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className={styles.bgCanvas}
      />
      <div className={styles.content}>
        <h1 className={styles.title} style={{ fontSize: layout.scale * 48 }}>
          {t('title_game')}
        </h1>
        <p className={styles.subtitle} style={{ fontSize: layout.scale * 20 }}>
          {t('title_subtitle')}
        </p>
        <div className={styles.buttons}>
          <button
            className={styles.startBtn}
            style={{ fontSize: layout.scale * 22 }}
            onClick={handleNewGame}
          >
            {t('title_new_game')}
          </button>
          <button
            className={styles.continueBtn}
            style={{ fontSize: layout.scale * 22 }}
            onClick={handleContinue}
          >
            {t('title_continue')}
          </button>
        </div>
      </div>
    </div>
  );
}
