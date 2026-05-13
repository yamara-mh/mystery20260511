import { create } from 'zustand';
import type {
  GamePhase,
  CharacterOnScreen,
  TextBoxState,
  EffectState,
  EvidenceDef,
  PersonDef,
  InfoDef,
  ChoiceOption,
  Destination,
  Hotspot,
  TestimonyStatement,
  OrganizePair,
  ChapterData,
} from '../engine/types';

interface DisplayState {
  background: string;
  characters: CharacterOnScreen[];
  textBox: TextBoxState;
  effects: EffectState;
}

interface TestimonyState {
  active: boolean;
  title: string;
  witness: string;
  statements: TestimonyStatement[];
  currentIndex: number;
  phase: 'listen' | 'cross_exam';
}

interface InvestigationState {
  active: boolean;
  bg: string;
  hotspots: Hotspot[];
  cursorX: number;
  cursorY: number;
  deduceEnabled: boolean;
  exitLabel: string;
}

export interface GameStore {
  // Core game state
  phase: GamePhase;
  chapter: string;
  scriptId: string;
  commandIndex: number;
  flags: Record<string, string | number | boolean>;
  callStack: Array<{ scriptId: string; commandIndex: number }>;

  // Inventory
  evidence: EvidenceDef[];
  persons: PersonDef[];
  info: InfoDef[];

  // Penalty
  penaltyHP: number;
  maxPenaltyHP: number;

  // Display
  display: DisplayState;

  // UI state
  choiceOptions: ChoiceOption[];
  destinations: Destination[];
  inventoryOpen: boolean;
  inventoryTab: 'evidence' | 'persons' | 'info';
  menuOpen: boolean;
  presentMode: boolean;
  presentCallback: ((itemType: string, itemId: string) => void) | null;

  // Investigation
  investigation: InvestigationState;

  // Testimony
  testimony: TestimonyState;

  // Organize
  organize: { active: boolean; pairs: OrganizePair[]; exitLabel: string };
  organizeSelection: { type: string; id: string } | null;

  // Chapter data
  chapterData: ChapterData | null;

  // Actions
  setPhase: (phase: GamePhase) => void;
  setChapter: (chapter: string) => void;
  setScript: (scriptId: string, commandIndex?: number) => void;
  setCommandIndex: (index: number) => void;
  advanceCommand: () => void;
  setFlag: (flag: string, value: string | number | boolean) => void;
  getFlag: (flag: string) => string | number | boolean | undefined;
  pushCallStack: (scriptId: string, commandIndex: number) => void;
  popCallStack: () => { scriptId: string; commandIndex: number } | undefined;

  setBackground: (bg: string) => void;
  showCharacter: (char: CharacterOnScreen) => void;
  hideCharacter: (id: string) => void;
  updateCharacter: (id: string, updates: Partial<CharacterOnScreen>) => void;
  clearCharacters: () => void;

  setTextBox: (state: Partial<TextBoxState>) => void;
  clearTextBox: () => void;

  setEffect: (key: keyof EffectState, value: Partial<EffectState[keyof EffectState]>) => void;
  clearEffects: () => void;

  addEvidence: (item: EvidenceDef) => void;
  removeEvidence: (id: string) => void;
  updateEvidence: (id: string, updates: Partial<EvidenceDef>) => void;
  addPerson: (person: PersonDef) => void;
  addInfo: (info: InfoDef) => void;
  updateInfo: (id: string, updates: Partial<InfoDef>) => void;

  setPenalty: (hp: number) => void;
  applyPenalty: (amount: number) => void;

  setChoiceOptions: (options: ChoiceOption[]) => void;
  clearChoiceOptions: () => void;
  setDestinations: (dests: Destination[]) => void;
  clearDestinations: () => void;

  toggleInventory: (open?: boolean) => void;
  setInventoryTab: (tab: 'evidence' | 'persons' | 'info') => void;
  toggleMenu: (open?: boolean) => void;

  setPresentMode: (active: boolean, callback?: ((itemType: string, itemId: string) => void) | null) => void;

  setInvestigation: (state: Partial<InvestigationState>) => void;
  clearInvestigation: () => void;

  setTestimony: (state: Partial<TestimonyState>) => void;
  clearTestimony: () => void;

  setOrganize: (active: boolean, pairs?: OrganizePair[], exitLabel?: string) => void;
  setOrganizeSelection: (sel: { type: string; id: string } | null) => void;

  setChapterData: (data: ChapterData) => void;

  resetGame: () => void;
}

const defaultTextBox: TextBoxState = {
  visible: false,
  speaker: '',
  text: '',
  displayedChars: 0,
  isComplete: false,
  isThinking: false,
};

const defaultEffects: EffectState = {
  shake: { active: false, intensity: 0, duration: 0, direction: 'both' },
  flash: { active: false, color: '#ffffff', duration: 0 },
  fade: { active: false, direction: 'in', color: '#000000', progress: 0 },
  tint: { active: false, color: '#000000', intensity: 0 },
  weather: { type: 'none', intensity: 0 },
  letterbox: { active: false },
};

const defaultDisplay: DisplayState = {
  background: '',
  characters: [],
  textBox: { ...defaultTextBox },
  effects: { ...defaultEffects },
};

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'title',
  chapter: '',
  scriptId: '',
  commandIndex: 0,
  flags: {},
  callStack: [],

  evidence: [],
  persons: [],
  info: [],

  penaltyHP: 5,
  maxPenaltyHP: 5,

  display: { ...defaultDisplay },

  choiceOptions: [],
  destinations: [],
  inventoryOpen: false,
  inventoryTab: 'evidence',
  menuOpen: false,
  presentMode: false,
  presentCallback: null,

  investigation: {
    active: false,
    bg: '',
    hotspots: [],
    cursorX: 0.5,
    cursorY: 0.5,
    deduceEnabled: false,
    exitLabel: '',
  },

  testimony: {
    active: false,
    title: '',
    witness: '',
    statements: [],
    currentIndex: 0,
    phase: 'listen',
  },

  organize: { active: false, pairs: [], exitLabel: '' },
  organizeSelection: null,

  chapterData: null,

  setPhase: (phase) => set({ phase }),
  setChapter: (chapter) => set({ chapter }),
  setScript: (scriptId, commandIndex = 0) => set({ scriptId, commandIndex }),
  setCommandIndex: (commandIndex) => set({ commandIndex }),
  advanceCommand: () => set((s) => ({ commandIndex: s.commandIndex + 1 })),

  setFlag: (flag, value) =>
    set((s) => ({ flags: { ...s.flags, [flag]: value } })),
  getFlag: (flag) => get().flags[flag],
  pushCallStack: (scriptId, commandIndex) =>
    set((s) => ({ callStack: [...s.callStack, { scriptId, commandIndex }] })),
  popCallStack: () => {
    const stack = get().callStack;
    if (stack.length === 0) return undefined;
    const top = stack[stack.length - 1];
    set({ callStack: stack.slice(0, -1) });
    return top;
  },

  setBackground: (bg) =>
    set((s) => ({ display: { ...s.display, background: bg } })),

  showCharacter: (char) =>
    set((s) => {
      const existing = s.display.characters.findIndex((c) => c.id === char.id);
      const characters = [...s.display.characters];
      if (existing >= 0) {
        characters[existing] = { ...characters[existing], ...char, visible: true };
      } else {
        characters.push({ ...char, visible: true });
      }
      return { display: { ...s.display, characters } };
    }),

  hideCharacter: (id) =>
    set((s) => ({
      display: {
        ...s.display,
        characters: s.display.characters.filter((c) => c.id !== id),
      },
    })),

  updateCharacter: (id, updates) =>
    set((s) => ({
      display: {
        ...s.display,
        characters: s.display.characters.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      },
    })),

  clearCharacters: () =>
    set((s) => ({ display: { ...s.display, characters: [] } })),

  setTextBox: (state) =>
    set((s) => ({
      display: {
        ...s.display,
        textBox: { ...s.display.textBox, ...state },
      },
    })),

  clearTextBox: () =>
    set((s) => ({
      display: { ...s.display, textBox: { ...defaultTextBox } },
    })),

  setEffect: (key, value) =>
    set((s) => ({
      display: {
        ...s.display,
        effects: {
          ...s.display.effects,
          [key]: { ...s.display.effects[key], ...value },
        },
      },
    })),

  clearEffects: () =>
    set((s) => ({ display: { ...s.display, effects: { ...defaultEffects } } })),

  addEvidence: (item) =>
    set((s) => {
      if (s.evidence.some((e) => e.id === item.id)) return s;
      return { evidence: [...s.evidence, item] };
    }),

  removeEvidence: (id) =>
    set((s) => ({ evidence: s.evidence.filter((e) => e.id !== id) })),

  updateEvidence: (id, updates) =>
    set((s) => ({
      evidence: s.evidence.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),

  addPerson: (person) =>
    set((s) => {
      if (s.persons.some((p) => p.id === person.id)) return s;
      return { persons: [...s.persons, person] };
    }),

  addInfo: (info) =>
    set((s) => {
      if (s.info.some((i) => i.id === info.id)) return s;
      return { info: [...s.info, info] };
    }),

  updateInfo: (id, updates) =>
    set((s) => ({
      info: s.info.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),

  setPenalty: (hp) => set({ penaltyHP: hp }),
  applyPenalty: (amount) =>
    set((s) => ({ penaltyHP: Math.max(0, s.penaltyHP - amount) })),

  setChoiceOptions: (choiceOptions) => set({ choiceOptions, phase: 'choice' }),
  clearChoiceOptions: () => set({ choiceOptions: [] }),
  setDestinations: (destinations) => set({ destinations, phase: 'move' }),
  clearDestinations: () => set({ destinations: [] }),

  toggleInventory: (open) =>
    set((s) => ({ inventoryOpen: open ?? !s.inventoryOpen })),
  setInventoryTab: (inventoryTab) => set({ inventoryTab }),
  toggleMenu: (open) => set((s) => ({ menuOpen: open ?? !s.menuOpen })),

  setPresentMode: (active, callback = null) =>
    set({ presentMode: active, presentCallback: callback, inventoryOpen: active }),

  setInvestigation: (state) =>
    set((s) => ({ investigation: { ...s.investigation, ...state } })),
  clearInvestigation: () =>
    set({
      investigation: {
        active: false,
        bg: '',
        hotspots: [],
        cursorX: 0.5,
        cursorY: 0.5,
        deduceEnabled: false,
        exitLabel: '',
      },
    }),

  setTestimony: (state) =>
    set((s) => ({ testimony: { ...s.testimony, ...state } })),
  clearTestimony: () =>
    set({
      testimony: {
        active: false,
        title: '',
        witness: '',
        statements: [],
        currentIndex: 0,
        phase: 'listen',
      },
    }),

  setOrganize: (active, pairs = [], exitLabel = '') =>
    set({ organize: { active, pairs, exitLabel } }),
  setOrganizeSelection: (organizeSelection) => set({ organizeSelection }),

  setChapterData: (chapterData) => set({ chapterData }),

  resetGame: () =>
    set({
      phase: 'title',
      chapter: '',
      scriptId: '',
      commandIndex: 0,
      flags: {},
      callStack: [],
      evidence: [],
      persons: [],
      info: [],
      penaltyHP: 5,
      maxPenaltyHP: 5,
      display: { ...defaultDisplay },
      choiceOptions: [],
      destinations: [],
      inventoryOpen: false,
      menuOpen: false,
      presentMode: false,
      presentCallback: null,
      investigation: {
        active: false,
        bg: '',
        hotspots: [],
        cursorX: 0.5,
        cursorY: 0.5,
        deduceEnabled: false,
        exitLabel: '',
      },
      testimony: {
        active: false,
        title: '',
        witness: '',
        statements: [],
        currentIndex: 0,
        phase: 'listen',
      },
      organize: { active: false, pairs: [], exitLabel: '' },
      organizeSelection: null,
    }),
}));
