/**
 * JSON <-> TSV bidirectional conversion for scenario editing.
 * Allows editing scenarios in spreadsheet tools.
 */
import type { ScenarioCommand, ChapterData } from '../engine/types';

const COMMAND_FIELDS: Record<string, string[]> = {
  label: ['name'],
  text: ['speaker', 'text', 'speed', 'autoAdvance', 'voice'],
  think: ['text'],
  bg: ['id', 'transition', 'duration'],
  char_show: ['id', 'position', 'emotion', 'transition', 'duration', 'flip'],
  char_hide: ['id', 'transition', 'duration'],
  char_move: ['id', 'position', 'duration'],
  emotion: ['character', 'emotion'],
  choice: ['choices'],
  bgm: ['id', 'fadeIn', 'loop'],
  bgm_stop: ['fadeOut'],
  se: ['id', 'volume'],
  shake: ['intensity', 'duration', 'direction'],
  flash: ['color', 'duration', 'count'],
  fade: ['direction', 'color', 'duration'],
  wait: ['duration'],
  flag_set: ['flag', 'value'],
  flag_check: ['flag', 'operator', 'value', 'trueLabel', 'falseLabel'],
  jump: ['label'],
  evidence_add: ['id', 'name', 'description', 'image', 'detail'],
  evidence_remove: ['id'],
  evidence_update: ['id', 'name', 'description', 'image', 'detail'],
  person_add: ['id', 'name', 'description', 'image'],
  info_add: ['id', 'name', 'description'],
  info_update: ['id', 'name', 'description'],
  move: ['destinations'],
  investigate: ['bg', 'hotspots', 'exitLabel', 'deduceEnabled'],
  testimony_start: ['title', 'witness', 'statements', 'crossExamLabel'],
  objection: ['character'],
  hold_it: ['character'],
  take_that: ['character'],
  gavel: ['count'],
  penalty: ['amount'],
  fullscreen_text: ['text', 'duration'],
  cut_in: ['image', 'duration', 'position'],
  scene_change: ['location', 'time'],
  call: ['scriptId', 'label'],
  return: [],
  game_over: ['type', 'restartLabel'],
  chapter_end: ['nextChapter'],
  set_speaker: ['id', 'name'],
  evidence_present: ['prompt', 'targets', 'wrongLabel'],
  debate_start: ['opponent', 'topic', 'label'],
  organize: ['pairs', 'exitLabel'],
  deduce: ['targets', 'wrongLabel'],
  zoom: ['scale', 'x', 'y', 'duration'],
  pan: ['x', 'y', 'duration'],
  tint: ['color', 'intensity', 'duration'],
  weather: ['type', 'intensity'],
  letterbox: ['show', 'duration'],
  particle: ['type', 'duration'],
  gallery: ['images'],
};

const ALL_FIELDS = Array.from(
  new Set(Object.values(COMMAND_FIELDS).flat())
);

function serializeValue(val: unknown): string {
  if (val === undefined || val === null) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

function deserializeValue(val: string): unknown {
  if (val === '') return undefined;
  if (val === 'true') return true;
  if (val === 'false') return false;
  const num = Number(val);
  if (!isNaN(num) && val.trim() !== '') return num;
  if (val.startsWith('[') || val.startsWith('{')) {
    try {
      return JSON.parse(val);
    } catch {
      // fallthrough
    }
  }
  return val;
}

export function scriptToTsv(scriptId: string, commands: ScenarioCommand[]): string {
  const header = ['scriptId', 'cmd', ...ALL_FIELDS].join('\t');
  const rows = commands.map((cmd) => {
    const cells = [scriptId, cmd.cmd];
    for (const field of ALL_FIELDS) {
      const val = (cmd as unknown as Record<string, unknown>)[field];
      cells.push(serializeValue(val));
    }
    return cells.join('\t');
  });
  return [header, ...rows].join('\n');
}

export function tsvToScript(tsv: string): { scriptId: string; commands: ScenarioCommand[] } {
  const lines = tsv.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return { scriptId: '', commands: [] };

  const headers = lines[0].split('\t');
  const commands: ScenarioCommand[] = [];
  let scriptId = '';

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split('\t');
    const record: Record<string, unknown> = {};

    for (let j = 0; j < headers.length; j++) {
      const h = headers[j];
      const v = cells[j] ?? '';
      if (h === 'scriptId') {
        scriptId = v;
      } else if (h === 'cmd') {
        record.cmd = v;
      } else {
        const dv = deserializeValue(v);
        if (dv !== undefined) {
          record[h] = dv;
        }
      }
    }

    if (record.cmd) {
      commands.push(record as unknown as ScenarioCommand);
    }
  }

  return { scriptId, commands };
}

export function chapterToTsv(chapter: ChapterData): string {
  const parts: string[] = [];
  for (const [scriptId, commands] of Object.entries(chapter.scripts)) {
    parts.push(scriptToTsv(scriptId, commands));
  }
  return parts.join('\n');
}

export function tsvToChapter(tsv: string, baseMeta: Omit<ChapterData, 'scripts'>): ChapterData {
  const lines = tsv.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return { ...baseMeta, scripts: {} };

  const headers = lines[0].split('\t');
  const scripts: Record<string, ScenarioCommand[]> = {};

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split('\t');
    const record: Record<string, unknown> = {};
    let scriptId = '';

    for (let j = 0; j < headers.length; j++) {
      const h = headers[j];
      const v = cells[j] ?? '';
      if (h === 'scriptId') {
        scriptId = v;
      } else if (h === 'cmd') {
        record.cmd = v;
      } else {
        const dv = deserializeValue(v);
        if (dv !== undefined) {
          record[h] = dv;
        }
      }
    }

    if (scriptId && record.cmd) {
      if (!scripts[scriptId]) scripts[scriptId] = [];
      scripts[scriptId].push(record as unknown as ScenarioCommand);
    }
  }

  return { ...baseMeta, scripts };
}
