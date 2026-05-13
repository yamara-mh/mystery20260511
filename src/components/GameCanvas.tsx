import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { GAME_WIDTH, GAME_HEIGHT, calculateLayout, type LayoutInfo } from '../utils/responsive';

interface GameCanvasProps {
  onLayoutChange: (layout: LayoutInfo) => void;
}

export default function GameCanvas({ onLayoutChange }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<LayoutInfo>({
    scale: 1, offsetX: 0, offsetY: 0, width: GAME_WIDTH, height: GAME_HEIGHT, orientation: 'landscape',
  });
  const animFrameRef = useRef(0);

  const background = useGameStore((s) => s.display.background);
  const characters = useGameStore((s) => s.display.characters);
  const effects = useGameStore((s) => s.display.effects);
  const chapterData = useGameStore((s) => s.chapterData);

  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const charImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Load background image
  useEffect(() => {
    if (!background) {
      bgImageRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      bgImageRef.current = img;
    };
    img.src = background;
  }, [background]);

  // Load character images
  useEffect(() => {
    const map = charImagesRef.current;
    for (const char of characters) {
      const charDef = chapterData?.characters[char.id];
      const emotionSrc = charDef?.emotions[char.emotion] ?? charDef?.emotions[charDef.defaultEmotion];
      if (!emotionSrc) continue;
      const key = `${char.id}_${char.emotion}`;
      if (!map.has(key)) {
        const img = new Image();
        img.onload = () => map.set(key, img);
        img.src = emotionSrc;
      }
    }
  }, [characters, chapterData]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newLayout = calculateLayout(rect.width, rect.height);
    setLayout(newLayout);
    onLayoutChange(newLayout);
  }, [onLayoutChange]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [handleResize]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let shakeStartTime = 0;
    let flashStartTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      const now = Date.now();

      // Shake offset
      let shakeX = 0;
      let shakeY = 0;
      if (effects.shake.active) {
        if (shakeStartTime === 0) shakeStartTime = now;
        const elapsed = now - shakeStartTime;
        if (elapsed < effects.shake.duration) {
          const intensity = effects.shake.intensity * (1 - elapsed / effects.shake.duration);
          if (effects.shake.direction !== 'vertical') {
            shakeX = (Math.random() - 0.5) * intensity * 2;
          }
          if (effects.shake.direction !== 'horizontal') {
            shakeY = (Math.random() - 0.5) * intensity * 2;
          }
        } else {
          shakeStartTime = 0;
          useGameStore.getState().setEffect('shake', { active: false });
        }
      } else {
        shakeStartTime = 0;
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Draw background
      if (bgImageRef.current) {
        ctx.drawImage(bgImageRef.current, 0, 0, GAME_WIDTH, GAME_HEIGHT);
      } else {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      }

      // Tint
      if (effects.tint.active) {
        ctx.globalAlpha = effects.tint.intensity;
        ctx.fillStyle = effects.tint.color;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.globalAlpha = 1;
      }

      // Draw characters
      for (const char of characters) {
        if (!char.visible) continue;
        const key = `${char.id}_${char.emotion}`;
        const img = charImagesRef.current.get(key);
        if (!img) continue;

        const posMap: Record<string, number> = {
          far_left: 0.1,
          left: 0.25,
          center: 0.5,
          right: 0.75,
          far_right: 0.9,
        };
        const xRatio = posMap[char.position] ?? 0.5;
        const charW = 400;
        const charH = 600;
        const x = GAME_WIDTH * xRatio - charW / 2;
        const y = GAME_HEIGHT - charH - 20;

        ctx.save();
        if (char.flip) {
          ctx.translate(x + charW, y);
          ctx.scale(-1, 1);
          ctx.drawImage(img, 0, 0, charW, charH);
        } else {
          ctx.drawImage(img, x, y, charW, charH);
        }
        ctx.restore();
      }

      ctx.restore();

      // Flash effect
      if (effects.flash.active) {
        if (flashStartTime === 0) flashStartTime = now;
        const elapsed = now - flashStartTime;
        if (elapsed < effects.flash.duration) {
          const alpha = 1 - elapsed / effects.flash.duration;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = effects.flash.color;
          ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
          ctx.globalAlpha = 1;
        } else {
          flashStartTime = 0;
          useGameStore.getState().setEffect('flash', { active: false });
        }
      } else {
        flashStartTime = 0;
      }

      // Fade effect
      if (effects.fade.active) {
        ctx.globalAlpha = effects.fade.progress;
        ctx.fillStyle = effects.fade.color;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.globalAlpha = 1;
      }

      // Letterbox
      if (effects.letterbox.active) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, GAME_WIDTH, 60);
        ctx.fillRect(0, GAME_HEIGHT - 60, GAME_WIDTH, 60);
      }

      // Weather
      if (effects.weather.type === 'rain') {
        ctx.strokeStyle = 'rgba(180,200,255,0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 100 * effects.weather.intensity; i++) {
          const rx = Math.random() * GAME_WIDTH;
          const ry = Math.random() * GAME_HEIGHT;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 2, ry + 15);
          ctx.stroke();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [characters, effects]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        style={{
          position: 'absolute',
          left: layout.offsetX,
          top: layout.offsetY,
          width: layout.width,
          height: layout.height,
          imageRendering: 'auto',
        }}
      />
    </div>
  );
}
