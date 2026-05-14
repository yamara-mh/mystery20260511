import type { ScenarioCommand, ChapterData } from './types';
import { useGameStore } from '../stores/gameStore';

type CommandHandler = (cmd: ScenarioCommand) => Promise<void> | void;

export class ScenarioEngine {
  private handlers: Map<string, CommandHandler> = new Map();
  private running = false;
  private waitingForInput = false;
  private skipAdvance = false;
  private resolveInput: (() => void) | null = null;
  private chapterData: ChapterData | null = null;

  constructor() {
    this.registerDefaultHandlers();
  }

  private getStore() {
    return useGameStore.getState();
  }

  loadChapter(data: ChapterData) {
    this.chapterData = data;
    this.getStore().setChapterData(data);
  }

  async startScript(scriptId: string, labelName?: string) {
    const store = this.getStore();
    if (!this.chapterData) return;

    const commands = this.chapterData.scripts[scriptId];
    if (!commands) {
      console.error(`Script not found: ${scriptId}`);
      return;
    }

    let startIndex = 0;
    if (labelName) {
      const idx = commands.findIndex(
        (c) => c.cmd === 'label' && 'name' in c && c.name === labelName
      );
      if (idx >= 0) startIndex = idx + 1;
    }

    store.setScript(scriptId, startIndex);
    store.setChapter(this.chapterData.id);
    this.running = true;
    await this.executeLoop();
  }

  /** Resume execution from a saved command index (for load game) */
  async resumeFromCommandIndex(scriptId: string, commandIndex: number) {
    if (!this.chapterData) return;

    const commands = this.chapterData.scripts[scriptId];
    if (!commands) {
      console.error(`Script not found: ${scriptId}`);
      return;
    }

    const store = this.getStore();
    store.setScript(scriptId, commandIndex);
    this.running = true;
    await this.executeLoop();
  }

  async jumpToLabel(label: string) {
    const store = this.getStore();
    if (!this.chapterData) return;

    const scriptId = store.scriptId;
    const commands = this.chapterData.scripts[scriptId];
    if (!commands) return;

    const idx = commands.findIndex(
      (c) => c.cmd === 'label' && 'name' in c && c.name === label
    );
    if (idx >= 0) {
      store.setCommandIndex(idx + 1);
    } else {
      for (const [sid, cmds] of Object.entries(this.chapterData.scripts)) {
        const i = cmds.findIndex(
          (c) => c.cmd === 'label' && 'name' in c && c.name === label
        );
        if (i >= 0) {
          store.setScript(sid, i + 1);
          break;
        }
      }
    }
  }

  private async executeLoop() {
    while (this.running) {
      const store = this.getStore();
      const commands = this.chapterData?.scripts[store.scriptId];
      if (!commands || store.commandIndex >= commands.length) {
        this.running = false;
        break;
      }

      const cmd = commands[store.commandIndex];
      const handler = this.handlers.get(cmd.cmd);
      this.skipAdvance = false;

      if (handler) {
        await handler(cmd);
      } else {
        console.warn(`No handler for command: ${cmd.cmd}`);
      }

      if (this.waitingForInput) {
        await new Promise<void>((resolve) => {
          this.resolveInput = resolve;
        });
        this.waitingForInput = false;
        this.resolveInput = null;
        continue;
      }

      if (!this.skipAdvance) {
        this.getStore().advanceCommand();
      }
    }
  }

  /** Mark that the current command already set the commandIndex (e.g. jump/flag_check) */
  private markSkipAdvance() {
    this.skipAdvance = true;
  }

  waitForInput() {
    this.waitingForInput = true;
  }

  continueExecution() {
    if (this.resolveInput) {
      this.resolveInput();
    }
  }

  advanceAndContinue() {
    this.getStore().advanceCommand();
    this.continueExecution();
  }

  stop() {
    this.running = false;
    this.continueExecution();
  }

  registerHandler(cmd: string, handler: CommandHandler) {
    this.handlers.set(cmd, handler);
  }

  private registerDefaultHandlers() {
    this.registerHandler('label', () => {
      // Labels are just markers, no action needed
    });

    this.registerHandler('text', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'text' }>;
      const store = this.getStore();
      store.setPhase('dialogue');
      store.setTextBox({
        visible: true,
        speaker: cmd.speaker ?? '',
        text: cmd.text,
        displayedChars: 0,
        isComplete: false,
        isThinking: false,
      });
      this.waitForInput();
    });

    this.registerHandler('think', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'think' }>;
      const store = this.getStore();
      store.setPhase('dialogue');
      store.setTextBox({
        visible: true,
        speaker: '',
        text: cmd.text,
        displayedChars: 0,
        isComplete: false,
        isThinking: true,
      });
      this.waitForInput();
    });

    this.registerHandler('bg', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'bg' }>;
      this.getStore().setBackground(cmd.id);
    });

    this.registerHandler('char_show', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'char_show' }>;
      this.getStore().showCharacter({
        id: cmd.id,
        emotion: cmd.emotion ?? 'normal',
        position: cmd.position ?? 'center',
        flip: cmd.flip ?? false,
        visible: true,
      });
    });

    this.registerHandler('char_hide', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'char_hide' }>;
      this.getStore().hideCharacter(cmd.id);
    });

    this.registerHandler('char_move', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'char_move' }>;
      this.getStore().updateCharacter(cmd.id, { position: cmd.position });
    });

    this.registerHandler('emotion', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'emotion' }>;
      this.getStore().updateCharacter(cmd.character, { emotion: cmd.emotion });
    });

    this.registerHandler('choice', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'choice' }>;
      const store = this.getStore();
      const filteredChoices = cmd.choices.filter((c) => {
        if (!c.condition) return true;
        return !!store.flags[c.condition];
      });
      store.setChoiceOptions(filteredChoices);
      this.waitForInput();
    });

    this.registerHandler('jump', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'jump' }>;
      this.jumpToLabel(cmd.label);
      this.markSkipAdvance();
    });

    this.registerHandler('flag_set', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'flag_set' }>;
      this.getStore().setFlag(cmd.flag, cmd.value);
    });

    this.registerHandler('flag_check', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'flag_check' }>;
      const store = this.getStore();
      const flagVal = store.flags[cmd.flag];
      const op = cmd.operator ?? '==';
      let result = false;

      if (flagVal === undefined) {
        result = op === '!=' ? true : false;
      } else {
        switch (op) {
          case '==': result = flagVal === cmd.value; break;
          case '!=': result = flagVal !== cmd.value; break;
          case '>': result = flagVal > cmd.value; break;
          case '<': result = flagVal < cmd.value; break;
          case '>=': result = flagVal >= cmd.value; break;
          case '<=': result = flagVal <= cmd.value; break;
        }
      }

      const targetLabel = result ? cmd.trueLabel : cmd.falseLabel;
      this.jumpToLabel(targetLabel);
      this.markSkipAdvance();
    });

    this.registerHandler('evidence_add', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'evidence_add' }>;
      this.getStore().addEvidence({
        id: cmd.id,
        name: cmd.name,
        description: cmd.description,
        image: cmd.image ?? '',
        detail: cmd.detail,
      });
    });

    this.registerHandler('evidence_remove', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'evidence_remove' }>;
      this.getStore().removeEvidence(cmd.id);
    });

    this.registerHandler('evidence_update', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'evidence_update' }>;
      this.getStore().updateEvidence(cmd.id, {
        ...(cmd.name !== undefined && { name: cmd.name }),
        ...(cmd.description !== undefined && { description: cmd.description }),
        ...(cmd.image !== undefined && { image: cmd.image }),
        ...(cmd.detail !== undefined && { detail: cmd.detail }),
      });
    });

    this.registerHandler('person_add', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'person_add' }>;
      this.getStore().addPerson({
        id: cmd.id,
        name: cmd.name,
        description: cmd.description,
        image: cmd.image ?? '',
      });
    });

    this.registerHandler('info_add', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'info_add' }>;
      this.getStore().addInfo({
        id: cmd.id,
        name: cmd.name,
        description: cmd.description,
      });
    });

    this.registerHandler('info_update', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'info_update' }>;
      this.getStore().updateInfo(cmd.id, {
        ...(cmd.name !== undefined && { name: cmd.name }),
        ...(cmd.description !== undefined && { description: cmd.description }),
      });
    });

    this.registerHandler('move', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'move' }>;
      const store = this.getStore();
      const filteredDests = cmd.destinations.filter((d) => {
        if (!d.condition) return true;
        return !!store.flags[d.condition];
      });
      store.setDestinations(filteredDests);
      this.waitForInput();
    });

    this.registerHandler('investigate', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'investigate' }>;
      const store = this.getStore();
      store.setPhase('investigation');
      store.setBackground(cmd.bg);
      store.setInvestigation({
        active: true,
        bg: cmd.bg,
        hotspots: cmd.hotspots,
        deduceEnabled: cmd.deduceEnabled ?? false,
        exitLabel: cmd.exitLabel,
      });
      this.waitForInput();
    });

    this.registerHandler('testimony_start', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'testimony_start' }>;
      const store = this.getStore();
      store.setPhase('testimony');
      store.setTestimony({
        active: true,
        title: cmd.title,
        witness: cmd.witness,
        statements: cmd.statements,
        currentIndex: 0,
        phase: 'listen',
      });
      this.waitForInput();
    });

    this.registerHandler('shake', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'shake' }>;
      this.getStore().setEffect('shake', {
        active: true,
        intensity: cmd.intensity ?? 10,
        duration: cmd.duration ?? 500,
        direction: cmd.direction ?? 'both',
      });
    });

    this.registerHandler('flash', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'flash' }>;
      this.getStore().setEffect('flash', {
        active: true,
        color: cmd.color ?? '#ffffff',
        duration: cmd.duration ?? 300,
      });
    });

    this.registerHandler('fade', async (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'fade' }>;
      const store = this.getStore();
      store.setEffect('fade', {
        active: true,
        direction: cmd.direction,
        color: cmd.color ?? '#000000',
        progress: cmd.direction === 'out' ? 0 : 1,
      });
      await this.delay(cmd.duration ?? 1000);
      if (cmd.direction === 'in') {
        store.setEffect('fade', { active: false, progress: 0 });
      }
    });

    this.registerHandler('wait', async (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'wait' }>;
      await this.delay(cmd.duration);
    });

    this.registerHandler('bgm', () => {
      // Audio handled by AudioManager
    });

    this.registerHandler('bgm_stop', () => {
      // Audio handled by AudioManager
    });

    this.registerHandler('se', () => {
      // Audio handled by AudioManager
    });

    this.registerHandler('objection', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'objection' }>;
      const store = this.getStore();
      store.setEffect('flash', { active: true, color: '#ffffff', duration: 200 });
      store.setTextBox({
        visible: true,
        speaker: cmd.character,
        text: '【異議あり！】',
        displayedChars: 100,
        isComplete: false,
      });
      this.waitForInput();
    });

    this.registerHandler('hold_it', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'hold_it' }>;
      const store = this.getStore();
      store.setEffect('flash', { active: true, color: '#ffffff', duration: 200 });
      store.setTextBox({
        visible: true,
        speaker: cmd.character,
        text: '【待った！】',
        displayedChars: 100,
        isComplete: false,
      });
      this.waitForInput();
    });

    this.registerHandler('take_that', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'take_that' }>;
      const store = this.getStore();
      store.setEffect('flash', { active: true, color: '#ffffff', duration: 200 });
      store.setTextBox({
        visible: true,
        speaker: cmd.character,
        text: '【くらえ！】',
        displayedChars: 100,
        isComplete: false,
      });
      this.waitForInput();
    });

    this.registerHandler('gavel', async () => {
      const store = this.getStore();
      store.setEffect('shake', { active: true, intensity: 15, duration: 300, direction: 'vertical' });
      await this.delay(500);
    });

    this.registerHandler('penalty', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'penalty' }>;
      this.getStore().applyPenalty(cmd.amount ?? 1);
    });

    this.registerHandler('fullscreen_text', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'fullscreen_text' }>;
      const store = this.getStore();
      store.setPhase('scene_change');
      store.setTextBox({
        visible: true,
        speaker: '',
        text: cmd.text,
        displayedChars: 100,
        isComplete: true,
      });
      this.waitForInput();
    });

    this.registerHandler('scene_change', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'scene_change' }>;
      const store = this.getStore();
      store.setPhase('scene_change');
      const text = cmd.time ? `${cmd.location}\n${cmd.time}` : cmd.location;
      store.setTextBox({
        visible: true,
        speaker: '',
        text,
        displayedChars: 100,
        isComplete: true,
      });
      this.waitForInput();
    });

    this.registerHandler('tint', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'tint' }>;
      this.getStore().setEffect('tint', {
        active: true,
        color: cmd.color,
        intensity: cmd.intensity ?? 0.3,
      });
    });

    this.registerHandler('weather', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'weather' }>;
      this.getStore().setEffect('weather', {
        type: cmd.type,
        intensity: cmd.intensity ?? 1,
      });
    });

    this.registerHandler('letterbox', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'letterbox' }>;
      this.getStore().setEffect('letterbox', { active: cmd.show });
    });

    this.registerHandler('call', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'call' }>;
      const store = this.getStore();
      store.pushCallStack(store.scriptId, store.commandIndex + 1);
      this.startScript(cmd.scriptId, cmd.label);
      this.markSkipAdvance();
    });

    this.registerHandler('return', () => {
      const store = this.getStore();
      const frame = store.popCallStack();
      if (frame) {
        store.setScript(frame.scriptId, frame.commandIndex);
        this.markSkipAdvance();
      }
    });

    this.registerHandler('game_over', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'game_over' }>;
      this.getStore().setPhase('game_over');
      void cmd;
      this.waitForInput();
    });

    this.registerHandler('chapter_end', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'chapter_end' }>;
      void cmd;
      this.stop();
    });

    this.registerHandler('organize', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'organize' }>;
      const store = this.getStore();
      store.setPhase('organize');
      store.setOrganize(true, cmd.pairs, cmd.exitLabel);
      this.waitForInput();
    });

    this.registerHandler('evidence_present', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'evidence_present' }>;
      const store = this.getStore();
      store.setTextBox({
        visible: true,
        speaker: '',
        text: cmd.prompt,
        displayedChars: 100,
        isComplete: true,
      });
      store.setPresentMode(true, (_type, id) => {
        store.setPresentMode(false);
        const target = cmd.targets.find((t) => t.evidenceId === id);
        if (target) {
          this.getStore().advanceCommand();
          this.jumpToLabel(target.label);
          this.continueExecution();
        } else {
          this.jumpToLabel(cmd.wrongLabel);
          this.continueExecution();
        }
      });
      this.waitForInput();
    });

    this.registerHandler('zoom', () => {
      // Handled by rendering
    });

    this.registerHandler('pan', () => {
      // Handled by rendering
    });

    this.registerHandler('set_speaker', () => {
      // Speaker name updates handled inline
    });

    this.registerHandler('cut_in', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'cut_in' }>;
      void cmd;
      this.waitForInput();
    });

    this.registerHandler('debate_start', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'debate_start' }>;
      void cmd;
    });

    this.registerHandler('deduce', (rawCmd) => {
      const cmd = rawCmd as Extract<ScenarioCommand, { cmd: 'deduce' }>;
      const store = this.getStore();
      store.setPresentMode(true, (_type, id) => {
        store.setPresentMode(false);
        const target = cmd.targets.find((t) => t.evidenceId === id);
        if (target) {
          this.getStore().advanceCommand();
          this.jumpToLabel(target.label);
          this.continueExecution();
        } else {
          this.jumpToLabel(cmd.wrongLabel);
          this.continueExecution();
        }
      });
      this.waitForInput();
    });

    this.registerHandler('gallery', () => {
      this.waitForInput();
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const engine = new ScenarioEngine();
