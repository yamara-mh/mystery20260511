import { create } from 'zustand';
import type { SaveData } from '../engine/types';
import { useGameStore } from './gameStore';

const SAVE_KEY = 'ace_attorney_adventure_saves';
const SETTINGS_KEY = 'ace_attorney_adventure_settings';
const MAX_SLOTS = 10;
const AUTO_SAVE_SLOT = 0;

export interface Settings {
  bgmVolume: number;
  seVolume: number;
  textSpeed: number; // 1=slow, 2=normal, 3=fast, 4=instant
  autoSpeed: number; // ms to wait before auto-advance
  language: string;
  fullscreen: boolean;
}

interface SaveStore {
  saves: (SaveData | null)[];
  settings: Settings;
  playTime: number;
  playTimerRef: number | null;

  loadSaves: () => void;
  saveGame: (slot: number, isAutoSave?: boolean) => void;
  autoSave: () => void;
  loadGame: (slot: number) => SaveData | null;
  deleteSave: (slot: number) => void;
  hasSaveData: () => boolean;

  updateSettings: (settings: Partial<Settings>) => void;
  loadSettings: () => void;

  startPlayTimer: () => void;
  stopPlayTimer: () => void;
}

const defaultSettings: Settings = {
  bgmVolume: 0.7,
  seVolume: 0.8,
  textSpeed: 2,
  autoSpeed: 3000,
  language: 'ja',
  fullscreen: false,
};

export const useSaveStore = create<SaveStore>((set, get) => ({
  saves: Array(MAX_SLOTS).fill(null) as (SaveData | null)[],
  settings: { ...defaultSettings },
  playTime: 0,
  playTimerRef: null,

  loadSaves: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as (SaveData | null)[];
        const saves = Array(MAX_SLOTS).fill(null) as (SaveData | null)[];
        for (let i = 0; i < Math.min(parsed.length, MAX_SLOTS); i++) {
          saves[i] = parsed[i];
        }
        set({ saves });
      }
    } catch (e) {
      console.error('Failed to load saves:', e);
    }
  },

  saveGame: (slot: number, isAutoSave = false) => {
    const gameStore = useGameStore.getState();
    const saves = [...get().saves];
    const saveData: SaveData = {
      slot,
      timestamp: Date.now(),
      chapter: gameStore.chapter,
      scriptId: gameStore.scriptId,
      commandIndex: gameStore.commandIndex,
      flags: { ...gameStore.flags },
      evidence: [...gameStore.evidence],
      persons: [...gameStore.persons],
      info: [...gameStore.info],
      penaltyHP: gameStore.penaltyHP,
      playTime: get().playTime,
      background: gameStore.display.background,
      characters: gameStore.display.characters.map((c) => ({ ...c })),
      isAutoSave,
    };
    saves[slot] = saveData;
    set({ saves });
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  },

  autoSave: () => {
    const gameStore = useGameStore.getState();
    if (gameStore.phase === 'title') return;
    get().saveGame(AUTO_SAVE_SLOT, true);
  },

  loadGame: (slot: number) => {
    const saves = get().saves;
    const saveData = saves[slot];
    if (!saveData) return null;

    const gameStore = useGameStore.getState();

    // Reset display state first
    gameStore.clearCharacters();
    gameStore.clearTextBox();
    gameStore.clearEffects();

    // Restore core state
    gameStore.setChapter(saveData.chapter);
    gameStore.setScript(saveData.scriptId, saveData.commandIndex);

    // Reset and restore flags
    gameStore.resetGame();
    gameStore.setChapter(saveData.chapter);
    gameStore.setScript(saveData.scriptId, saveData.commandIndex);
    Object.entries(saveData.flags).forEach(([k, v]) => gameStore.setFlag(k, v));

    // Reset and re-add inventory items
    saveData.evidence.forEach((e) => gameStore.addEvidence(e));
    saveData.persons.forEach((p) => gameStore.addPerson(p));
    saveData.info.forEach((i) => gameStore.addInfo(i));
    gameStore.setPenalty(saveData.penaltyHP);

    // Restore display state
    if (saveData.background) {
      gameStore.setBackground(saveData.background);
    }
    if (saveData.characters) {
      saveData.characters.forEach((c) => gameStore.showCharacter(c));
    }

    // Set phase to dialogue so the engine can resume
    gameStore.setPhase('dialogue');

    set({ playTime: saveData.playTime });

    return saveData;
  },

  hasSaveData: () => {
    return get().saves.some((s) => s !== null);
  },

  deleteSave: (slot: number) => {
    const saves = [...get().saves];
    saves[slot] = null;
    set({ saves });
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
    } catch (e) {
      console.error('Failed to delete save:', e);
    }
  },

  updateSettings: (partial) => {
    const settings = { ...get().settings, ...partial };
    set({ settings });
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  loadSettings: () => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        set({ settings: { ...defaultSettings, ...parsed } });
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  },

  startPlayTimer: () => {
    const ref = window.setInterval(() => {
      set((s) => ({ playTime: s.playTime + 1 }));
    }, 1000);
    set({ playTimerRef: ref });
  },

  stopPlayTimer: () => {
    const ref = get().playTimerRef;
    if (ref !== null) {
      clearInterval(ref);
      set({ playTimerRef: null });
    }
  },
}));
