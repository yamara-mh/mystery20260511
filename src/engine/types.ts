/** Core game engine types */

// ── Scenario Command Definitions (supports all AA3 effects) ──

export type ScenarioCommand =
  | TextCommand
  | BgCommand
  | CharShowCommand
  | CharHideCommand
  | CharMoveCommand
  | ChoiceCommand
  | BgmCommand
  | BgmStopCommand
  | SeCommand
  | ShakeCommand
  | FlashCommand
  | FadeCommand
  | WaitCommand
  | FlagSetCommand
  | FlagCheckCommand
  | EvidenceAddCommand
  | EvidenceRemoveCommand
  | EvidenceUpdateCommand
  | PersonAddCommand
  | InfoAddCommand
  | InfoUpdateCommand
  | MoveCommand
  | InvestigateCommand
  | TestimonyStartCommand
  | ObjectionCommand
  | HoldItCommand
  | TakeThatCommand
  | GavelCommand
  | PenaltyCommand
  | FullscreenTextCommand
  | CutInCommand
  | ThinkCommand
  | SceneChangeCommand
  | JumpCommand
  | LabelCommand
  | CallCommand
  | ReturnCommand
  | GameOverCommand
  | ChapterEndCommand
  | SetSpeakerCommand
  | EmotionCommand
  | EvidencePresentCommand
  | DebateStartCommand
  | OrganizeCommand
  | DeduceCommand
  | ZoomCommand
  | PanCommand
  | TintCommand
  | WeatherCommand
  | ParticleCommand
  | LetterboxCommand
  | GalleryCommand;

export interface TextCommand {
  cmd: 'text';
  speaker?: string;
  text: string;
  speed?: number; // chars per frame
  autoAdvance?: boolean;
  voice?: string;
}

export interface BgCommand {
  cmd: 'bg';
  id: string;
  transition?: 'cut' | 'fade' | 'slide_left' | 'slide_right' | 'dissolve' | 'wipe';
  duration?: number;
}

export interface CharShowCommand {
  cmd: 'char_show';
  id: string;
  position?: 'left' | 'center' | 'right' | 'far_left' | 'far_right';
  emotion?: string;
  transition?: 'cut' | 'fade' | 'slide_in';
  duration?: number;
  flip?: boolean;
}

export interface CharHideCommand {
  cmd: 'char_hide';
  id: string;
  transition?: 'cut' | 'fade' | 'slide_out';
  duration?: number;
}

export interface CharMoveCommand {
  cmd: 'char_move';
  id: string;
  position: 'left' | 'center' | 'right' | 'far_left' | 'far_right';
  duration?: number;
}

export interface ChoiceCommand {
  cmd: 'choice';
  choices: ChoiceOption[];
}

export interface ChoiceOption {
  text: string;
  next: string;
  condition?: string; // flag expression
}

export interface BgmCommand {
  cmd: 'bgm';
  id: string;
  fadeIn?: number;
  loop?: boolean;
}

export interface BgmStopCommand {
  cmd: 'bgm_stop';
  fadeOut?: number;
}

export interface SeCommand {
  cmd: 'se';
  id: string;
  volume?: number;
}

export interface ShakeCommand {
  cmd: 'shake';
  intensity?: number;
  duration?: number;
  direction?: 'horizontal' | 'vertical' | 'both';
}

export interface FlashCommand {
  cmd: 'flash';
  color?: string;
  duration?: number;
  count?: number;
}

export interface FadeCommand {
  cmd: 'fade';
  direction: 'in' | 'out';
  color?: string;
  duration?: number;
}

export interface WaitCommand {
  cmd: 'wait';
  duration: number;
}

export interface FlagSetCommand {
  cmd: 'flag_set';
  flag: string;
  value: string | number | boolean;
}

export interface FlagCheckCommand {
  cmd: 'flag_check';
  flag: string;
  operator?: '==' | '!=' | '>' | '<' | '>=' | '<=';
  value: string | number | boolean;
  trueLabel: string;
  falseLabel: string;
}

export interface EvidenceAddCommand {
  cmd: 'evidence_add';
  id: string;
  name: string;
  description: string;
  image?: string;
  detail?: string;
}

export interface EvidenceRemoveCommand {
  cmd: 'evidence_remove';
  id: string;
}

export interface EvidenceUpdateCommand {
  cmd: 'evidence_update';
  id: string;
  name?: string;
  description?: string;
  image?: string;
  detail?: string;
}

export interface PersonAddCommand {
  cmd: 'person_add';
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface InfoAddCommand {
  cmd: 'info_add';
  id: string;
  name: string;
  description: string;
}

export interface InfoUpdateCommand {
  cmd: 'info_update';
  id: string;
  name?: string;
  description?: string;
}

export interface MoveCommand {
  cmd: 'move';
  destinations: Destination[];
}

export interface Destination {
  id: string;
  name: string;
  label: string;
  condition?: string;
}

export interface InvestigateCommand {
  cmd: 'investigate';
  bg: string;
  hotspots: Hotspot[];
  exitLabel: string;
  deduceEnabled?: boolean;
}

export interface Hotspot {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  examined?: string; // flag to set after examined
  detailBg?: string; // transition to detail investigation
}

export interface TestimonyStartCommand {
  cmd: 'testimony_start';
  title: string;
  witness: string;
  statements: TestimonyStatement[];
  crossExamLabel: string;
}

export interface TestimonyStatement {
  text: string;
  speaker: string;
  emotion?: string;
  pressLabel: string;
  presentTargets?: PresentTarget[];
}

export interface PresentTarget {
  evidenceId: string;
  label: string;
}

export interface ObjectionCommand {
  cmd: 'objection';
  character: string;
}

export interface HoldItCommand {
  cmd: 'hold_it';
  character: string;
}

export interface TakeThatCommand {
  cmd: 'take_that';
  character: string;
}

export interface GavelCommand {
  cmd: 'gavel';
  count?: number;
}

export interface PenaltyCommand {
  cmd: 'penalty';
  amount?: number;
}

export interface FullscreenTextCommand {
  cmd: 'fullscreen_text';
  text: string;
  duration?: number;
}

export interface CutInCommand {
  cmd: 'cut_in';
  image: string;
  duration?: number;
  position?: 'center' | 'left' | 'right';
}

export interface ThinkCommand {
  cmd: 'think';
  text: string;
}

export interface SceneChangeCommand {
  cmd: 'scene_change';
  location: string;
  time?: string;
}

export interface JumpCommand {
  cmd: 'jump';
  label: string;
}

export interface LabelCommand {
  cmd: 'label';
  name: string;
}

export interface CallCommand {
  cmd: 'call';
  scriptId: string;
  label?: string;
}

export interface ReturnCommand {
  cmd: 'return';
}

export interface GameOverCommand {
  cmd: 'game_over';
  type: 'penalty' | 'story';
  restartLabel: string;
}

export interface ChapterEndCommand {
  cmd: 'chapter_end';
  nextChapter?: string;
}

export interface SetSpeakerCommand {
  cmd: 'set_speaker';
  id: string;
  name: string;
}

export interface EmotionCommand {
  cmd: 'emotion';
  character: string;
  emotion: string;
}

export interface EvidencePresentCommand {
  cmd: 'evidence_present';
  prompt: string;
  targets: PresentTarget[];
  wrongLabel: string;
}

export interface DebateStartCommand {
  cmd: 'debate_start';
  opponent: string;
  topic: string;
  label: string;
}

export interface OrganizeCommand {
  cmd: 'organize';
  pairs: OrganizePair[];
  exitLabel: string;
}

export interface OrganizePair {
  item1Type: 'evidence' | 'person' | 'info';
  item1Id: string;
  item2Type: 'evidence' | 'person' | 'info';
  item2Id: string;
  label: string;
}

export interface DeduceCommand {
  cmd: 'deduce';
  targets: Array<{ evidenceId: string; label: string }>;
  wrongLabel: string;
}

export interface ZoomCommand {
  cmd: 'zoom';
  scale: number;
  x?: number;
  y?: number;
  duration?: number;
}

export interface PanCommand {
  cmd: 'pan';
  x: number;
  y: number;
  duration?: number;
}

export interface TintCommand {
  cmd: 'tint';
  color: string;
  intensity?: number;
  duration?: number;
}

export interface WeatherCommand {
  cmd: 'weather';
  type: 'none' | 'rain' | 'snow' | 'fog' | 'dust';
  intensity?: number;
}

export interface ParticleCommand {
  cmd: 'particle';
  type: string;
  duration?: number;
}

export interface LetterboxCommand {
  cmd: 'letterbox';
  show: boolean;
  duration?: number;
}

export interface GalleryCommand {
  cmd: 'gallery';
  images: string[];
}

// ── Scene/Script structure ──

export interface ScenarioScript {
  id: string;
  commands: ScenarioCommand[];
}

export interface ChapterData {
  id: string;
  title: string;
  scripts: Record<string, ScenarioCommand[]>;
  characters: Record<string, CharacterDef>;
  locations: Record<string, LocationDef>;
  evidence: Record<string, EvidenceDef>;
  persons: Record<string, PersonDef>;
  info: Record<string, InfoDef>;
}

export interface CharacterDef {
  id: string;
  name: string;
  nameKey?: string;
  emotions: Record<string, string>; // emotion -> image path
  defaultEmotion: string;
}

export interface LocationDef {
  id: string;
  name: string;
  nameKey?: string;
  bg: string;
}

export interface EvidenceDef {
  id: string;
  name: string;
  nameKey?: string;
  description: string;
  descriptionKey?: string;
  image: string;
  detail?: string;
  detailKey?: string;
}

export interface PersonDef {
  id: string;
  name: string;
  nameKey?: string;
  description: string;
  descriptionKey?: string;
  image: string;
}

export interface InfoDef {
  id: string;
  name: string;
  nameKey?: string;
  description: string;
  descriptionKey?: string;
}

// ── Game state types ──

export type GamePhase =
  | 'title'
  | 'investigation'
  | 'testimony'
  | 'dialogue'
  | 'choice'
  | 'move'
  | 'inventory'
  | 'menu'
  | 'organize'
  | 'scene_change'
  | 'game_over';

export interface GameState {
  chapter: string;
  scriptId: string;
  commandIndex: number;
  phase: GamePhase;
  flags: Record<string, string | number | boolean>;
  evidence: EvidenceDef[];
  persons: PersonDef[];
  info: InfoDef[];
  penaltyHP: number;
  maxPenaltyHP: number;
  visitedLabels: Set<string>;
  callStack: Array<{ scriptId: string; commandIndex: number }>;
}

export interface SaveData {
  slot: number;
  timestamp: number;
  chapter: string;
  scriptId: string;
  commandIndex: number;
  flags: Record<string, string | number | boolean>;
  evidence: EvidenceDef[];
  persons: PersonDef[];
  info: InfoDef[];
  penaltyHP: number;
  screenshot?: string;
  playTime: number;
  /** Display state: background image data URL */
  background?: string;
  /** Display state: characters on screen */
  characters?: CharacterOnScreen[];
  /** Whether this save was auto-generated */
  isAutoSave?: boolean;
}

// ── Rendering state ──

export interface CharacterOnScreen {
  id: string;
  emotion: string;
  position: 'left' | 'center' | 'right' | 'far_left' | 'far_right';
  flip: boolean;
  visible: boolean;
}

export interface TextBoxState {
  visible: boolean;
  speaker: string;
  speakerColor?: string;
  text: string;
  displayedChars: number;
  isComplete: boolean;
  isThinking: boolean;
}

export interface EffectState {
  shake: { active: boolean; intensity: number; duration: number; direction: string };
  flash: { active: boolean; color: string; duration: number };
  fade: { active: boolean; direction: string; color: string; progress: number };
  tint: { active: boolean; color: string; intensity: number };
  weather: { type: string; intensity: number };
  letterbox: { active: boolean };
}
