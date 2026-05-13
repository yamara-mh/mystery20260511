import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../stores/gameStore';
import { useSaveStore } from '../stores/saveStore';
import { engine } from '../engine/ScenarioEngine';
import type { LayoutInfo } from '../utils/responsive';
import styles from './MenuScreen.module.css';

interface MenuScreenProps {
  layout: LayoutInfo;
}

type MenuView = 'main' | 'save' | 'load' | 'settings';

export default function MenuScreen({ layout }: MenuScreenProps) {
  const { t } = useTranslation();
  const menuOpen = useGameStore((s) => s.menuOpen);
  const toggleMenu = useGameStore((s) => s.toggleMenu);
  const chapterData = useGameStore((s) => s.chapterData);
  const [view, setView] = useState<MenuView>('main');
  const saves = useSaveStore((s) => s.saves);
  const settings = useSaveStore((s) => s.settings);
  const saveGame = useSaveStore((s) => s.saveGame);
  const loadGame = useSaveStore((s) => s.loadGame);
  const updateSettings = useSaveStore((s) => s.updateSettings);
  const [notification, setNotification] = useState('');

  const handleClose = useCallback(() => {
    toggleMenu(false);
    setView('main');
  }, [toggleMenu]);

  const handleSave = useCallback(
    (slot: number) => {
      saveGame(slot);
      setNotification(t('save_success'));
      setTimeout(() => setNotification(''), 2000);
    },
    [saveGame, t]
  );

  const handleLoad = useCallback(
    (slot: number) => {
      const data = loadGame(slot);
      if (data && chapterData) {
        engine.startScript(data.scriptId).catch(console.error);
        handleClose();
      }
    },
    [loadGame, chapterData, handleClose]
  );

  const handleTitleScreen = useCallback(() => {
    engine.stop();
    useGameStore.getState().resetGame();
    handleClose();
  }, [handleClose]);

  if (!menuOpen) return null;

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
      <div className={styles.panel} style={{ fontSize: layout.scale * 16 }}>
        {notification && (
          <div className={styles.notification} style={{ fontSize: layout.scale * 18 }}>
            {notification}
          </div>
        )}

        {view === 'main' && (
          <div className={styles.mainMenu}>
            <h2 style={{ fontSize: layout.scale * 24 }}>{t('menu_title')}</h2>
            <button className={styles.menuItem} onClick={() => setView('save')}>
              {t('menu_save')}
            </button>
            <button className={styles.menuItem} onClick={() => setView('load')}>
              {t('menu_load')}
            </button>
            <button className={styles.menuItem} onClick={() => setView('settings')}>
              {t('menu_settings')}
            </button>
            <button className={styles.menuItem} onClick={handleTitleScreen}>
              {t('menu_title_screen')}
            </button>
            <button className={styles.closeBtn} onClick={handleClose}>
              {t('ui_close')}
            </button>
          </div>
        )}

        {(view === 'save' || view === 'load') && (
          <div className={styles.saveLoadMenu}>
            <h2 style={{ fontSize: layout.scale * 22 }}>
              {view === 'save' ? t('menu_save') : t('menu_load')}
            </h2>
            <div className={styles.slotList}>
              {saves.map((save, i) => (
                <button
                  key={i}
                  className={styles.slotItem}
                  onClick={() => (view === 'save' ? handleSave(i) : save && handleLoad(i))}
                  disabled={view === 'load' && !save}
                >
                  <span className={styles.slotLabel}>{t('save_slot', { num: i + 1 })}</span>
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
            <button className={styles.closeBtn} onClick={() => setView('main')}>
              {t('ui_back')}
            </button>
          </div>
        )}

        {view === 'settings' && (
          <div className={styles.settingsMenu}>
            <h2 style={{ fontSize: layout.scale * 22 }}>{t('menu_settings')}</h2>
            <div className={styles.settingItem}>
              <label>{t('menu_settings_bgm')}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.bgmVolume}
                onChange={(e) => updateSettings({ bgmVolume: Number(e.target.value) })}
              />
              <span>{Math.round(settings.bgmVolume * 100)}%</span>
            </div>
            <div className={styles.settingItem}>
              <label>{t('menu_settings_se')}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.seVolume}
                onChange={(e) => updateSettings({ seVolume: Number(e.target.value) })}
              />
              <span>{Math.round(settings.seVolume * 100)}%</span>
            </div>
            <div className={styles.settingItem}>
              <label>{t('menu_settings_text_speed')}</label>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={settings.textSpeed}
                onChange={(e) => updateSettings({ textSpeed: Number(e.target.value) })}
              />
              <span>{['遅い', '普通', '速い', '瞬間'][settings.textSpeed - 1]}</span>
            </div>
            <button className={styles.closeBtn} onClick={() => setView('main')}>
              {t('ui_back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
