import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useSaveStore } from '../stores/saveStore';
import { engine } from '../engine/ScenarioEngine';
import type { LayoutInfo } from '../utils/responsive';
import styles from './TextBox.module.css';

interface TextBoxProps {
  layout: LayoutInfo;
}

export default function TextBox({ layout }: TextBoxProps) {
  const textBox = useGameStore((s) => s.display.textBox);
  const phase = useGameStore((s) => s.phase);
  const setTextBox = useGameStore((s) => s.setTextBox);
  const timerRef = useRef<number>(0);
  const textSpeed = useSaveStore((s) => s.settings.textSpeed);

  const speedMap: Record<number, number> = { 1: 80, 2: 35, 3: 15, 4: 0 };
  const charDelay = speedMap[textSpeed] ?? 35;

  // Typewriter effect
  useEffect(() => {
    if (!textBox.visible || textBox.isComplete) return;
    if (textBox.displayedChars >= textBox.text.length) {
      setTextBox({ isComplete: true });
      return;
    }

    if (charDelay === 0) {
      setTextBox({ displayedChars: textBox.text.length, isComplete: true });
      return;
    }

    timerRef.current = window.setTimeout(() => {
      setTextBox({ displayedChars: textBox.displayedChars + 1 });
    }, charDelay);

    return () => clearTimeout(timerRef.current);
  }, [textBox.visible, textBox.isComplete, textBox.displayedChars, textBox.text, charDelay, setTextBox]);

  const handleClick = useCallback(() => {
    if (!textBox.visible) return;
    if (!textBox.isComplete) {
      clearTimeout(timerRef.current);
      setTextBox({ displayedChars: textBox.text.length, isComplete: true });
      return;
    }
    engine.advanceAndContinue();
  }, [textBox.visible, textBox.isComplete, textBox.text.length, setTextBox]);

  if (!textBox.visible || phase === 'choice' || phase === 'move' || phase === 'scene_change') {
    return null;
  }

  const displayText = textBox.text.slice(0, textBox.displayedChars);

  return (
    <div
      className={`${styles.textBoxContainer} ${textBox.isThinking ? styles.thinking : ''}`}
      style={{
        left: layout.offsetX,
        top: layout.offsetY + layout.height - layout.height * 0.3,
        width: layout.width,
        height: layout.height * 0.28,
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      {textBox.speaker && (
        <div
          className={styles.speakerName}
          style={{ fontSize: layout.scale * 20 }}
        >
          {textBox.speaker}
        </div>
      )}
      <div
        className={styles.textContent}
        style={{ fontSize: layout.scale * 24 }}
      >
        {displayText}
        {!textBox.isComplete && <span className={styles.cursor}>|</span>}
      </div>
      {textBox.isComplete && (
        <div className={styles.advanceIndicator} style={{ fontSize: layout.scale * 16 }}>
          ▼
        </div>
      )}
    </div>
  );
}
