import type { ChapterData } from '../../engine/types';
import {
  generateBackground,
  generateCharacter,
  generateEvidenceIcon,
} from '../../utils/assetGenerator';

export function loadChapter1(): ChapterData {
  // Generate assets
  const bg = {
    alley: generateBackground('夜の路地裏', ['#0a0a1a', '#1a1a30', '#0d0d1e'], '路地裏'),
    inn_exterior: generateBackground('宿屋の外観', ['#1a1a30', '#2a2040', '#1a1a30'], '宿屋「月光亭」'),
    inn_room: generateBackground('宿屋の部屋', ['#3a2820', '#4a3830', '#3a2820'], '宿部屋'),
    inn_hall: generateBackground('宿屋のロビー', ['#2a2020', '#3a3028', '#2a2020'], '宿屋ロビー'),
    crime_scene: generateBackground('犯行現場', ['#1a0a0a', '#2a1015', '#1a0a0a'], '犯行現場'),
    town_square: generateBackground('街の広場', ['#1a2030', '#2a3040', '#1a2030'], '街の広場'),
    guard_post: generateBackground('衛兵詰所', ['#2a2a30', '#3a3a40', '#2a2a30'], '衛兵詰所'),
  };

  const chars = {
    protagonist_normal: generateCharacter('ユウキ', '#3060a0', 'normal'),
    protagonist_thinking: generateCharacter('ユウキ', '#3060a0', 'thinking'),
    protagonist_surprised: generateCharacter('ユウキ', '#3060a0', 'surprised'),
    protagonist_happy: generateCharacter('ユウキ', '#3060a0', 'happy'),
    innkeeper_normal: generateCharacter('マルタ', '#a06030', 'normal'),
    innkeeper_sad: generateCharacter('マルタ', '#a06030', 'sad'),
    innkeeper_angry: generateCharacter('マルタ', '#a06030', 'angry'),
    innkeeper_surprised: generateCharacter('マルタ', '#a06030', 'surprised'),
    guard_normal: generateCharacter('ガルド', '#607030', 'normal'),
    guard_angry: generateCharacter('ガルド', '#607030', 'angry'),
    guard_surprised: generateCharacter('ガルド', '#607030', 'surprised'),
    nightwatch_normal: generateCharacter('ノクト', '#404060', 'normal'),
    nightwatch_thinking: generateCharacter('ノクト', '#404060', 'thinking'),
    nightwatch_surprised: generateCharacter('ノクト', '#404060', 'surprised'),
    victim_normal: generateCharacter('商人トーマ', '#806040', 'normal'),
    merchant_normal: generateCharacter('商人リカルド', '#a08040', 'normal'),
    merchant_angry: generateCharacter('商人リカルド', '#a08040', 'angry'),
    merchant_surprised: generateCharacter('商人リカルド', '#a08040', 'surprised'),
  };

  const evidenceIcons = {
    pendant: generateEvidenceIcon('銀のペンダント', '#c0c0c0'),
    knife: generateEvidenceIcon('血染めのナイフ', '#cc3030'),
    letter: generateEvidenceIcon('脅迫状', '#e0d8c0'),
    witness_note: generateEvidenceIcon('目撃メモ', '#a0a0c0'),
    magic_residue: generateEvidenceIcon('魔法の残滓', '#80a0ff'),
    receipt: generateEvidenceIcon('宿帳の写し', '#d0c8a0'),
    map: generateEvidenceIcon('周辺地図', '#c0b890'),
  };

  return {
    id: 'chapter1',
    title: '転移の夜に響く悲鳴',
    characters: {
      protagonist: {
        id: 'protagonist',
        name: 'ユウキ',
        emotions: {
          normal: chars.protagonist_normal,
          thinking: chars.protagonist_thinking,
          surprised: chars.protagonist_surprised,
          happy: chars.protagonist_happy,
        },
        defaultEmotion: 'normal',
      },
      innkeeper: {
        id: 'innkeeper',
        name: 'マルタ',
        emotions: {
          normal: chars.innkeeper_normal,
          sad: chars.innkeeper_sad,
          angry: chars.innkeeper_angry,
          surprised: chars.innkeeper_surprised,
        },
        defaultEmotion: 'normal',
      },
      guard: {
        id: 'guard',
        name: 'ガルド',
        emotions: {
          normal: chars.guard_normal,
          angry: chars.guard_angry,
          surprised: chars.guard_surprised,
        },
        defaultEmotion: 'normal',
      },
      nightwatch: {
        id: 'nightwatch',
        name: 'ノクト',
        emotions: {
          normal: chars.nightwatch_normal,
          thinking: chars.nightwatch_thinking,
          surprised: chars.nightwatch_surprised,
        },
        defaultEmotion: 'normal',
      },
      merchant: {
        id: 'merchant',
        name: 'リカルド',
        emotions: {
          normal: chars.merchant_normal,
          angry: chars.merchant_angry,
          surprised: chars.merchant_surprised,
        },
        defaultEmotion: 'normal',
      },
    },
    locations: {
      alley: { id: 'alley', name: '路地裏', bg: bg.alley },
      inn_exterior: { id: 'inn_exterior', name: '宿屋「月光亭」', bg: bg.inn_exterior },
      inn_room: { id: 'inn_room', name: '宿部屋', bg: bg.inn_room },
      inn_hall: { id: 'inn_hall', name: '宿屋ロビー', bg: bg.inn_hall },
      crime_scene: { id: 'crime_scene', name: '犯行現場', bg: bg.crime_scene },
      town_square: { id: 'town_square', name: '街の広場', bg: bg.town_square },
      guard_post: { id: 'guard_post', name: '衛兵詰所', bg: bg.guard_post },
    },
    evidence: {
      pendant: { id: 'pendant', name: '銀のペンダント', description: '被害者の首から外れて落ちていた銀色のペンダント。裏面に文字が刻まれている。', image: evidenceIcons.pendant },
      knife: { id: 'knife', name: '血染めのナイフ', description: '現場近くの茂みに捨てられていた短剣。刃に血痕が残っている。', image: evidenceIcons.knife },
      letter: { id: 'letter', name: '脅迫状', description: '被害者の所持品から見つかった手紙。「代金を払わなければ命はない」と書かれている。', image: evidenceIcons.letter },
      witness_note: { id: 'witness_note', name: '目撃メモ', description: '夜警ノクトの証言を書き留めたメモ。「深夜2時頃、路地裏で人影を見た」', image: evidenceIcons.witness_note },
      magic_residue: { id: 'magic_residue', name: '魔法の残滓', description: '現場に残されていた微かな魔力の痕跡。光属性の魔法が使われた形跡。', image: evidenceIcons.magic_residue },
      receipt: { id: 'receipt', name: '宿帳の写し', description: '月光亭の宿帳。被害者トーマと商人リカルドが同じ日に宿泊している。', image: evidenceIcons.receipt },
      map: { id: 'map', name: '周辺地図', description: '月光亭周辺の地図。路地裏、広場、衛兵詰所の位置関係が分かる。', image: evidenceIcons.map },
    },
    persons: {},
    info: {},
    scripts: {
      // ── Main Script ──
      main: [
        { cmd: 'scene_change', location: '第１章', time: '転移の夜に響く悲鳴' },
        { cmd: 'fade', direction: 'in', duration: 1500, color: '#000000' },
        { cmd: 'bg', id: bg.alley },
        { cmd: 'text', speaker: '', text: '……気がつくと、見知らぬ石畳の路地裏に倒れていた。' },
        { cmd: 'char_show', id: 'protagonist', position: 'center', emotion: 'surprised' },
        { cmd: 'text', speaker: 'ユウキ', text: 'ここは……どこだ？\nさっきまで学校にいたはずなのに……' },
        { cmd: 'think', text: '（頭がぼんやりする……。周りの建物は中世ヨーロッパみたいだ）' },
        { cmd: 'text', speaker: 'ユウキ', text: '異世界……？まさか、本当にこんなことが……' },
        { cmd: 'se', id: 'scream' },
        { cmd: 'shake', intensity: 8, duration: 400 },
        { cmd: 'text', speaker: '', text: '突然、近くから悲鳴が聞こえた。' },
        { cmd: 'emotion', character: 'protagonist', emotion: 'surprised' },
        { cmd: 'text', speaker: 'ユウキ', text: '！？ 今の悲鳴は……！' },
        { cmd: 'think', text: '（状況がよく分からないけど、放っておけない……！）' },
        { cmd: 'fade', direction: 'out', duration: 800, color: '#000000' },
        { cmd: 'wait', duration: 500 },

        // Arrive at crime scene
        { cmd: 'bg', id: bg.crime_scene },
        { cmd: 'fade', direction: 'in', duration: 800, color: '#000000' },
        { cmd: 'char_show', id: 'protagonist', position: 'left', emotion: 'surprised' },
        { cmd: 'text', speaker: '', text: '駆けつけると、路地の奥に人が倒れていた。' },
        { cmd: 'text', speaker: 'ユウキ', text: 'だ、大丈夫ですか！？' },
        { cmd: 'text', speaker: '', text: '……返事はない。男性は胸を刺されて事切れていた。' },
        { cmd: 'text', speaker: 'ユウキ', text: 'そんな……。殺されて……？' },

        // Guard arrives
        { cmd: 'char_show', id: 'guard', position: 'right', emotion: 'angry' },
        { cmd: 'text', speaker: 'ガルド', text: 'そこの者、動くな！\n……何だ、この有様は！' },
        { cmd: 'text', speaker: 'ガルド', text: '死体の側に立っている貴様……まさか、貴様がやったのか！？' },
        { cmd: 'emotion', character: 'protagonist', emotion: 'surprised' },
        { cmd: 'text', speaker: 'ユウキ', text: 'ち、違います！悲鳴が聞こえて駆けつけたら……！' },
        { cmd: 'text', speaker: 'ガルド', text: 'ふん、そう言うだろうな。とりあえず衛兵詰所へ来てもらう。' },

        { cmd: 'fade', direction: 'out', duration: 800, color: '#000000' },
        { cmd: 'wait', duration: 500 },

        // At guard post
        { cmd: 'scene_change', location: '衛兵詰所', time: '深夜' },
        { cmd: 'bg', id: bg.guard_post },
        { cmd: 'fade', direction: 'in', duration: 800, color: '#000000' },
        { cmd: 'char_show', id: 'protagonist', position: 'left', emotion: 'normal' },
        { cmd: 'char_show', id: 'guard', position: 'right', emotion: 'normal' },

        { cmd: 'text', speaker: 'ガルド', text: 'さて、名前は？' },
        { cmd: 'text', speaker: 'ユウキ', text: '……ユウキです。' },
        { cmd: 'text', speaker: 'ガルド', text: '見慣れない格好だな。どこから来た？' },
        { cmd: 'think', text: '（異世界から来たなんて言っても信じてもらえないだろう……）' },
        { cmd: 'text', speaker: 'ユウキ', text: '遠い国から……旅の途中です。\nこの街には今日着いたばかりで、右も左も分かりません。' },
        { cmd: 'text', speaker: 'ガルド', text: 'ふむ……。被害者は商人のトーマだ。月光亭に泊まっていた。' },
        { cmd: 'text', speaker: 'ガルド', text: 'まあ、本当に通りがかりなら潔白を証明してみせろ。\nこの街では、容疑者が自ら真犯人を見つければ無罪放免だ。' },
        { cmd: 'emotion', character: 'protagonist', emotion: 'surprised' },
        { cmd: 'text', speaker: 'ユウキ', text: '自分で犯人を見つける……？' },
        { cmd: 'text', speaker: 'ガルド', text: 'そうだ。「探偵権」という古い法律だ。\n三日以内に真犯人を突き止めれば、お前の無実が認められる。' },
        { cmd: 'think', text: '（この世界独自の法律か……。やるしかない）' },
        { cmd: 'emotion', character: 'protagonist', emotion: 'normal' },
        { cmd: 'text', speaker: 'ユウキ', text: '……分かりました。やってみます。' },
        { cmd: 'text', speaker: 'ガルド', text: 'よかろう。まずは現場と月光亭を調べるといい。\n夜警のノクトが案内してくれるだろう。' },

        // Get initial evidence
        { cmd: 'person_add', id: 'guard', name: 'ガルド', description: '街の衛兵。厳格だが公正な性格。', image: chars.guard_normal },
        { cmd: 'info_add', id: 'detective_right', name: '探偵権', description: '容疑者自らが真犯人を見つければ無罪放免となる、この世界の法律。三日以内。' },
        { cmd: 'info_add', id: 'victim_info', name: '被害者情報', description: '商人トーマ。月光亭に宿泊中だった。胸を刺されて死亡。' },
        { cmd: 'evidence_add', id: 'map', name: '周辺地図', description: '月光亭周辺の地図。路地裏、広場、衛兵詰所の位置関係が分かる。', image: evidenceIcons.map },

        { cmd: 'text', speaker: '', text: '探偵権を行使し、事件の捜査を開始する。' },

        { cmd: 'fade', direction: 'out', duration: 800, color: '#000000' },
        { cmd: 'wait', duration: 500 },

        { cmd: 'scene_change', location: '探偵パート', time: '犯行現場の調査' },

        // Investigation phase - Crime Scene
        { cmd: 'label', name: 'investigation_hub' },
        { cmd: 'bg', id: bg.crime_scene },
        { cmd: 'fade', direction: 'in', duration: 500, color: '#000000' },
        { cmd: 'char_show', id: 'protagonist', position: 'left', emotion: 'thinking' },
        { cmd: 'char_show', id: 'nightwatch', position: 'right', emotion: 'normal' },

        { cmd: 'person_add', id: 'nightwatch', name: 'ノクト', description: '街の夜警。穏やかな性格で、夜の巡回を担当している。', image: chars.nightwatch_normal },

        { cmd: 'text', speaker: 'ノクト', text: 'ここが現場だ。好きに調べてくれ。\n何か聞きたいことがあれば答えよう。' },

        // Investigation menu
        { cmd: 'label', name: 'crime_scene_menu' },
        { cmd: 'choice', choices: [
          { text: '現場を調べる', next: 'examine_crime_scene' },
          { text: 'ノクトと話す', next: 'talk_nightwatch' },
          { text: '整理する', next: 'organize_menu' },
          { text: '移動する', next: 'move_menu' },
        ]},

        // Examine crime scene
        { cmd: 'label', name: 'examine_crime_scene' },
        { cmd: 'text', speaker: '', text: '現場を注意深く調べる……' },
        { cmd: 'flag_check', flag: 'found_pendant', operator: '==', value: true, trueLabel: 'examine_more', falseLabel: 'find_pendant' },

        { cmd: 'label', name: 'find_pendant' },
        { cmd: 'text', speaker: 'ユウキ', text: 'これは……銀色のペンダントだ。被害者の首元から外れたようだ。' },
        { cmd: 'text', speaker: 'ユウキ', text: '裏面に何か刻まれている……「R.T.へ 永遠の友情を」' },
        { cmd: 'evidence_add', id: 'pendant', name: '銀のペンダント', description: '被害者の首から外れて落ちていた銀色のペンダント。裏面に「R.T.へ 永遠の友情を」と刻まれている。', image: evidenceIcons.pendant },
        { cmd: 'flag_set', flag: 'found_pendant', value: true },
        { cmd: 'text', speaker: '', text: '《銀のペンダント》を証拠品に追加した。' },
        { cmd: 'jump', label: 'crime_scene_menu' },

        { cmd: 'label', name: 'examine_more' },
        { cmd: 'flag_check', flag: 'found_knife', operator: '==', value: true, trueLabel: 'examine_magic', falseLabel: 'find_knife' },

        { cmd: 'label', name: 'find_knife' },
        { cmd: 'text', speaker: 'ユウキ', text: 'あそこの茂みに何か光るものが……ナイフだ！' },
        { cmd: 'text', speaker: 'ノクト', text: '血が付いている……これが凶器か。' },
        { cmd: 'evidence_add', id: 'knife', name: '血染めのナイフ', description: '現場近くの茂みに捨てられていた短剣。刃に血痕が残っている。', image: evidenceIcons.knife },
        { cmd: 'flag_set', flag: 'found_knife', value: true },
        { cmd: 'text', speaker: '', text: '《血染めのナイフ》を証拠品に追加した。' },
        { cmd: 'jump', label: 'crime_scene_menu' },

        { cmd: 'label', name: 'examine_magic' },
        { cmd: 'flag_check', flag: 'found_magic', operator: '==', value: true, trueLabel: 'examine_nothing', falseLabel: 'find_magic' },

        { cmd: 'label', name: 'find_magic' },
        { cmd: 'think', text: '（なんだろう……空気が少し変だ。何か……光のようなものを感じる）' },
        { cmd: 'text', speaker: 'ユウキ', text: 'ノクトさん、ここに何か変な気配を感じるんですが……' },
        { cmd: 'emotion', character: 'nightwatch', emotion: 'surprised' },
        { cmd: 'text', speaker: 'ノクト', text: 'ほう……魔力を感じ取れるのか。確かに微かな魔法の残滓がある。' },
        { cmd: 'text', speaker: 'ノクト', text: 'これは光属性の魔法だな。照明か、あるいは目くらましに使われたか。' },
        { cmd: 'evidence_add', id: 'magic_residue', name: '魔法の残滓', description: '現場に残されていた微かな魔力の痕跡。光属性の魔法が使われた形跡。', image: evidenceIcons.magic_residue },
        { cmd: 'flag_set', flag: 'found_magic', value: true },
        { cmd: 'text', speaker: '', text: '《魔法の残滓》を証拠品に追加した。' },
        { cmd: 'jump', label: 'crime_scene_menu' },

        { cmd: 'label', name: 'examine_nothing' },
        { cmd: 'text', speaker: 'ユウキ', text: 'もうこの現場で見つけられるものはなさそうだ。' },
        { cmd: 'jump', label: 'crime_scene_menu' },

        // Talk to nightwatch
        { cmd: 'label', name: 'talk_nightwatch' },
        { cmd: 'choice', choices: [
          { text: '事件について', next: 'talk_nw_case' },
          { text: '被害者について', next: 'talk_nw_victim' },
          { text: '何か見たか', next: 'talk_nw_witness', condition: 'found_pendant' },
          { text: '魔法について', next: 'talk_nw_magic', condition: 'found_magic' },
          { text: '戻る', next: 'crime_scene_menu' },
        ]},

        { cmd: 'label', name: 'talk_nw_case' },
        { cmd: 'text', speaker: 'ノクト', text: '俺が悲鳴を聞いたのは深夜2時頃だ。\n駆けつけたときには、お前が先にいた。' },
        { cmd: 'text', speaker: 'ノクト', text: '被害者は商人のトーマ。月光亭に泊まっていた客の一人だ。' },
        { cmd: 'jump', label: 'talk_nightwatch' },

        { cmd: 'label', name: 'talk_nw_victim' },
        { cmd: 'text', speaker: 'ノクト', text: 'トーマは行商人だ。各地を回って商売をしている。' },
        { cmd: 'text', speaker: 'ノクト', text: '最近この街に来たのは一週間前。\n同じく商人のリカルドも一緒に来ていたな。' },
        { cmd: 'flag_set', flag: 'know_ricardo', value: true },
        { cmd: 'info_add', id: 'ricardo_info', name: '商人リカルド', description: '被害者トーマと共に街に来た商人。月光亭に宿泊中。' },
        { cmd: 'text', speaker: '', text: '《商人リカルド》の情報を追加した。' },
        { cmd: 'jump', label: 'talk_nightwatch' },

        { cmd: 'label', name: 'talk_nw_witness' },
        { cmd: 'emotion', character: 'nightwatch', emotion: 'thinking' },
        { cmd: 'text', speaker: 'ノクト', text: '実は……悲鳴の少し前に、路地裏で人影を見たんだ。' },
        { cmd: 'text', speaker: 'ノクト', text: 'はっきりとは見えなかったが……暗い外套を着た人物だった。' },
        { cmd: 'text', speaker: 'ノクト', text: '足早に宿屋の方へ向かっていったように見えた。' },
        { cmd: 'evidence_add', id: 'witness_note', name: '目撃メモ', description: '夜警ノクトの証言。「深夜2時頃、路地裏で暗い外套を着た人影が宿屋の方へ向かうのを見た」', image: evidenceIcons.witness_note },
        { cmd: 'flag_set', flag: 'got_witness', value: true },
        { cmd: 'text', speaker: '', text: '《目撃メモ》を証拠品に追加した。' },
        { cmd: 'jump', label: 'talk_nightwatch' },

        { cmd: 'label', name: 'talk_nw_magic' },
        { cmd: 'text', speaker: 'ノクト', text: '光属性の魔法を使えるのは、この街では限られている。' },
        { cmd: 'text', speaker: 'ノクト', text: '宿屋のマルタは元冒険者で魔法が使えるが……まさかな。' },
        { cmd: 'text', speaker: 'ノクト', text: 'あとは、旅人の中に魔法使いがいれば使える可能性がある。' },
        { cmd: 'flag_set', flag: 'know_magic_users', value: true },
        { cmd: 'info_add', id: 'magic_users', name: '光魔法の使い手', description: '光属性の魔法を使えるのはこの街では限られている。宿屋のマルタは元冒険者で魔法が使える。' },
        { cmd: 'text', speaker: '', text: '《光魔法の使い手》の情報を追加した。' },
        { cmd: 'jump', label: 'talk_nightwatch' },

        // Organize
        { cmd: 'label', name: 'organize_menu' },
        { cmd: 'text', speaker: 'ユウキ', text: '手持ちの情報を整理してみよう……' },
        { cmd: 'flag_check', flag: 'found_pendant', operator: '==', value: true, trueLabel: 'organize_check_witness', falseLabel: 'organize_nothing' },

        { cmd: 'label', name: 'organize_check_witness' },
        { cmd: 'flag_check', flag: 'know_ricardo', operator: '==', value: true, trueLabel: 'organize_check_rt', falseLabel: 'organize_nothing' },

        { cmd: 'label', name: 'organize_check_rt' },
        { cmd: 'flag_check', flag: 'deduced_rt', operator: '==', value: true, trueLabel: 'organize_nothing', falseLabel: 'organize_rt_deduction' },

        { cmd: 'label', name: 'organize_rt_deduction' },
        { cmd: 'text', speaker: 'ユウキ', text: 'ペンダントの裏には「R.T.へ」と書いてあった……' },
        { cmd: 'text', speaker: 'ユウキ', text: 'R.T.……リカルド・トーマ？\nいや、被害者がトーマなら、R.T.は別の人物の可能性もある。' },
        { cmd: 'text', speaker: 'ユウキ', text: 'リカルドのイニシャルが R で始まるなら……\nこのペンダントはリカルドに贈られたものかもしれない。' },
        { cmd: 'flag_set', flag: 'deduced_rt', value: true },
        { cmd: 'info_add', id: 'rt_connection', name: 'R.T.の推理', description: 'ペンダントの「R.T.」はリカルドのイニシャルの可能性。トーマとリカルドの間に何か関係があるかもしれない。' },
        { cmd: 'text', speaker: '', text: '《R.T.の推理》の情報を追加した。' },
        { cmd: 'jump', label: 'crime_scene_menu' },

        { cmd: 'label', name: 'organize_nothing' },
        { cmd: 'text', speaker: 'ユウキ', text: 'まだ情報が足りないようだ……もっと調べよう。' },
        { cmd: 'jump', label: 'crime_scene_menu' },

        // Move menu
        { cmd: 'label', name: 'move_menu' },
        { cmd: 'move', destinations: [
          { id: 'inn', name: '宿屋「月光亭」', label: 'go_inn' },
          { id: 'town_square', name: '街の広場', label: 'go_square', condition: 'got_witness' },
          { id: 'crime_scene', name: '犯行現場', label: 'crime_scene_menu' },
        ]},

        // ── Inn scenes ──
        { cmd: 'label', name: 'go_inn' },
        { cmd: 'fade', direction: 'out', duration: 500, color: '#000000' },
        { cmd: 'wait', duration: 300 },
        { cmd: 'bg', id: bg.inn_hall },
        { cmd: 'fade', direction: 'in', duration: 500, color: '#000000' },
        { cmd: 'char_show', id: 'protagonist', position: 'left', emotion: 'normal' },
        { cmd: 'char_show', id: 'innkeeper', position: 'right', emotion: 'sad' },

        { cmd: 'flag_check', flag: 'visited_inn', operator: '==', value: true, trueLabel: 'inn_menu', falseLabel: 'inn_first_visit' },

        { cmd: 'label', name: 'inn_first_visit' },
        { cmd: 'text', speaker: 'マルタ', text: 'あなたが探偵権を行使した旅人さんね……。\nトーマさんのこと、信じられないわ。' },
        { cmd: 'text', speaker: 'ユウキ', text: '大家さんですか。少しお話を聞かせてください。' },
        { cmd: 'text', speaker: 'マルタ', text: 'マルタよ。この月光亭の主人。何でも聞いて。' },
        { cmd: 'person_add', id: 'innkeeper', name: 'マルタ', description: '宿屋「月光亭」の女主人。元冒険者で、光属性の魔法が使える。', image: chars.innkeeper_normal },
        { cmd: 'flag_set', flag: 'visited_inn', value: true },
        { cmd: 'jump', label: 'inn_menu' },

        { cmd: 'label', name: 'inn_menu' },
        { cmd: 'choice', choices: [
          { text: 'マルタと話す', next: 'talk_innkeeper' },
          { text: '宿帳を見せてもらう', next: 'check_register', condition: 'know_ricardo' },
          { text: 'リカルドに会う', next: 'meet_ricardo', condition: 'know_ricardo' },
          { text: '移動する', next: 'move_menu' },
        ]},

        // Talk to innkeeper
        { cmd: 'label', name: 'talk_innkeeper' },
        { cmd: 'choice', choices: [
          { text: 'トーマについて', next: 'talk_mk_toma' },
          { text: '事件の夜のこと', next: 'talk_mk_night' },
          { text: '脅迫状について', next: 'talk_mk_letter', condition: 'found_letter' },
          { text: '戻る', next: 'inn_menu' },
        ]},

        { cmd: 'label', name: 'talk_mk_toma' },
        { cmd: 'text', speaker: 'マルタ', text: 'トーマさんは穏やかな人だったわ。\n一週間前にリカルドさんと一緒に来たの。' },
        { cmd: 'text', speaker: 'マルタ', text: 'でも最近……二人の間にちょっとした緊張感があった気がするわ。' },
        { cmd: 'jump', label: 'talk_innkeeper' },

        { cmd: 'label', name: 'talk_mk_night' },
        { cmd: 'text', speaker: 'マルタ', text: '事件の夜は……深夜1時頃にリカルドさんがロビーに降りてきたわ。' },
        { cmd: 'text', speaker: 'マルタ', text: '「眠れない」と言って少し話をしたの。30分くらいかしら。' },
        { cmd: 'text', speaker: 'マルタ', text: 'その後リカルドさんは部屋に戻って、私も片付けをしていたの。' },
        { cmd: 'flag_set', flag: 'know_alibi', value: true },
        { cmd: 'info_add', id: 'ricardo_alibi', name: 'リカルドのアリバイ', description: 'マルタの証言：深夜1時頃、リカルドがロビーに来て30分ほど話した。その後リカルドは部屋に戻った。' },
        { cmd: 'text', speaker: '', text: '《リカルドのアリバイ》の情報を追加した。' },
        { cmd: 'jump', label: 'talk_innkeeper' },

        { cmd: 'label', name: 'talk_mk_letter' },
        { cmd: 'emotion', character: 'innkeeper', emotion: 'surprised' },
        { cmd: 'text', speaker: 'マルタ', text: '脅迫状……！？ トーマさんがそんなものを……' },
        { cmd: 'text', speaker: 'マルタ', text: '心当たりは……あるかもしれないわ。\nトーマさんとリカルドさんが取引の件で揉めていたから。' },
        { cmd: 'flag_set', flag: 'know_dispute', value: true },
        { cmd: 'info_update', id: 'ricardo_info', name: '商人リカルド', description: '被害者トーマと共に街に来た商人。トーマと取引の件で揉めていた。月光亭に宿泊中。' },
        { cmd: 'jump', label: 'talk_innkeeper' },

        // Check register
        { cmd: 'label', name: 'check_register' },
        { cmd: 'text', speaker: 'マルタ', text: '宿帳ね。はい、どうぞ。' },
        { cmd: 'text', speaker: '', text: '宿帳を確認する。トーマとリカルドは同じ日に宿泊を開始している。' },
        { cmd: 'text', speaker: '', text: 'リカルドのフルネームは「リカルド・ターナー」。' },
        { cmd: 'emotion', character: 'protagonist', emotion: 'surprised' },
        { cmd: 'text', speaker: 'ユウキ', text: 'リカルド・ターナー……R.T.！' },
        { cmd: 'evidence_add', id: 'receipt', name: '宿帳の写し', description: '月光亭の宿帳。被害者トーマと商人リカルド・ターナー（R.T.）が同じ日に宿泊している。', image: evidenceIcons.receipt },
        { cmd: 'flag_set', flag: 'found_register', value: true },
        { cmd: 'text', speaker: '', text: '《宿帳の写し》を証拠品に追加した。' },
        { cmd: 'jump', label: 'inn_menu' },

        // Meet Ricardo
        { cmd: 'label', name: 'meet_ricardo' },
        { cmd: 'char_hide', id: 'innkeeper' },
        { cmd: 'bg', id: bg.inn_room },
        { cmd: 'char_show', id: 'merchant', position: 'right', emotion: 'normal' },
        { cmd: 'flag_check', flag: 'met_ricardo', operator: '==', value: true, trueLabel: 'ricardo_menu', falseLabel: 'ricardo_first' },

        { cmd: 'label', name: 'ricardo_first' },
        { cmd: 'text', speaker: 'リカルド', text: '……誰だ、あんたは。' },
        { cmd: 'text', speaker: 'ユウキ', text: 'トーマさんの事件について調べています。少し話を聞かせてください。' },
        { cmd: 'emotion', character: 'merchant', emotion: 'angry' },
        { cmd: 'text', speaker: 'リカルド', text: 'チッ……仕方ないな。探偵権か何か知らんが、手短に頼む。' },
        { cmd: 'person_add', id: 'merchant', name: 'リカルド', description: '商人リカルド・ターナー。トーマの取引相手。態度が荒い。', image: chars.merchant_normal },
        { cmd: 'flag_set', flag: 'met_ricardo', value: true },
        { cmd: 'jump', label: 'ricardo_menu' },

        { cmd: 'label', name: 'ricardo_menu' },
        { cmd: 'choice', choices: [
          { text: 'トーマとの関係', next: 'talk_rc_relation' },
          { text: '事件の夜のこと', next: 'talk_rc_night' },
          { text: 'ペンダントについて', next: 'talk_rc_pendant', condition: 'found_register' },
          { text: '脅迫状を見せる', next: 'talk_rc_letter', condition: 'found_letter' },
          { text: '戻る', next: 'return_to_inn_hall' },
        ]},

        { cmd: 'label', name: 'talk_rc_relation' },
        { cmd: 'text', speaker: 'リカルド', text: '仕事仲間だよ。一緒に行商をしていた。\nそれ以上でもそれ以下でもない。' },
        { cmd: 'jump', label: 'ricardo_menu' },

        { cmd: 'label', name: 'talk_rc_night' },
        { cmd: 'text', speaker: 'リカルド', text: '眠れなくてロビーに降りた。マルタと少し話をして部屋に戻った。' },
        { cmd: 'text', speaker: 'リカルド', text: 'それだけだ。悲鳴も聞いてない。' },
        { cmd: 'jump', label: 'ricardo_menu' },

        { cmd: 'label', name: 'talk_rc_pendant' },
        { cmd: 'text', speaker: 'ユウキ', text: '現場で見つかったペンダントに「R.T.へ」と刻まれていました。\nリカルド・ターナーさん、これはあなたのものでは？' },
        { cmd: 'emotion', character: 'merchant', emotion: 'surprised' },
        { cmd: 'text', speaker: 'リカルド', text: '……！ それは……！' },
        { cmd: 'text', speaker: 'リカルド', text: '……確かにトーマからもらったものだ。\n昔、二人で商売を始めたときの記念品だ。' },
        { cmd: 'text', speaker: 'リカルド', text: 'だが、なぜあいつがそれを持っていたんだ……\n俺が無くしたと思っていたのに。' },
        { cmd: 'flag_set', flag: 'ricardo_pendant_reaction', value: true },
        { cmd: 'jump', label: 'ricardo_menu' },

        { cmd: 'label', name: 'talk_rc_letter' },
        { cmd: 'emotion', character: 'merchant', emotion: 'angry' },
        { cmd: 'text', speaker: 'リカルド', text: '脅迫状だと……？ 俺は知らん！\nそんなもの書くわけないだろう！' },
        { cmd: 'text', speaker: 'ユウキ', text: '（かなり動揺しているな……）' },
        { cmd: 'jump', label: 'ricardo_menu' },

        { cmd: 'label', name: 'return_to_inn_hall' },
        { cmd: 'char_hide', id: 'merchant' },
        { cmd: 'bg', id: bg.inn_hall },
        { cmd: 'char_show', id: 'innkeeper', position: 'right', emotion: 'normal' },
        { cmd: 'jump', label: 'inn_menu' },

        // Town square
        { cmd: 'label', name: 'go_square' },
        { cmd: 'fade', direction: 'out', duration: 500, color: '#000000' },
        { cmd: 'wait', duration: 300 },
        { cmd: 'bg', id: bg.town_square },
        { cmd: 'fade', direction: 'in', duration: 500, color: '#000000' },
        { cmd: 'char_show', id: 'protagonist', position: 'center', emotion: 'thinking' },

        { cmd: 'text', speaker: 'ユウキ', text: '広場に来た。ここからは月光亭と路地裏の両方が見える。' },

        { cmd: 'flag_check', flag: 'found_letter', operator: '==', value: true, trueLabel: 'square_menu', falseLabel: 'find_letter_scene' },

        { cmd: 'label', name: 'find_letter_scene' },
        { cmd: 'text', speaker: '', text: '広場のベンチの下に、何か紙が挟まっているのが見える。' },
        { cmd: 'text', speaker: 'ユウキ', text: 'これは……手紙？「代金を払わなければ命はない」……！' },
        { cmd: 'text', speaker: 'ユウキ', text: '脅迫状だ！ 宛名は……トーマ宛てになっている！' },
        { cmd: 'evidence_add', id: 'letter', name: '脅迫状', description: '広場で見つかった手紙。トーマ宛てに「代金を払わなければ命はない」と書かれている。筆跡は荒々しい。', image: evidenceIcons.letter },
        { cmd: 'flag_set', flag: 'found_letter', value: true },
        { cmd: 'text', speaker: '', text: '《脅迫状》を証拠品に追加した。' },
        { cmd: 'jump', label: 'square_menu' },

        { cmd: 'label', name: 'square_menu' },
        // Check if ready for debate
        { cmd: 'flag_check', flag: 'ready_for_debate', operator: '==', value: true, trueLabel: 'square_normal_menu', falseLabel: 'check_debate_ready' },

        { cmd: 'label', name: 'check_debate_ready' },
        { cmd: 'flag_check', flag: 'found_letter', operator: '==', value: true, trueLabel: 'check_debate_2', falseLabel: 'square_normal_menu' },
        { cmd: 'label', name: 'check_debate_2' },
        { cmd: 'flag_check', flag: 'found_register', operator: '==', value: true, trueLabel: 'check_debate_3', falseLabel: 'square_normal_menu' },
        { cmd: 'label', name: 'check_debate_3' },
        { cmd: 'flag_check', flag: 'ricardo_pendant_reaction', operator: '==', value: true, trueLabel: 'trigger_debate', falseLabel: 'square_normal_menu' },

        { cmd: 'label', name: 'trigger_debate' },
        { cmd: 'text', speaker: 'ユウキ', text: '……証拠は揃った。リカルドに問い詰める時だ。' },
        { cmd: 'flag_set', flag: 'ready_for_debate', value: true },
        { cmd: 'jump', label: 'square_normal_menu' },

        { cmd: 'label', name: 'square_normal_menu' },
        { cmd: 'choice', choices: [
          { text: 'リカルドと対決する', next: 'start_debate', condition: 'ready_for_debate' },
          { text: '移動する', next: 'move_menu' },
        ]},

        // ── Debate Phase ──
        { cmd: 'label', name: 'start_debate' },
        { cmd: 'scene_change', location: '議論パート', time: 'リカルド・ターナーとの対決' },
        { cmd: 'bg', id: bg.inn_room },
        { cmd: 'fade', direction: 'in', duration: 800, color: '#000000' },
        { cmd: 'char_show', id: 'protagonist', position: 'left', emotion: 'normal' },
        { cmd: 'char_show', id: 'merchant', position: 'right', emotion: 'angry' },

        { cmd: 'text', speaker: 'ユウキ', text: 'リカルドさん。もう一度、事件の夜のことを聞かせてください。' },
        { cmd: 'text', speaker: 'リカルド', text: 'また来たのか……。何度聞いても同じだ。' },

        // Testimony
        { cmd: 'testimony_start',
          title: 'リカルドの証言 ～事件の夜～',
          witness: 'merchant',
          statements: [
            {
              text: '事件の夜、俺は眠れなくて深夜1時頃にロビーに降りた。',
              speaker: 'リカルド',
              emotion: 'normal',
              pressLabel: 'press_1',
              presentTargets: [],
            },
            {
              text: 'マルタと30分ほど話をして、部屋に戻った。',
              speaker: 'リカルド',
              emotion: 'normal',
              pressLabel: 'press_2',
              presentTargets: [],
            },
            {
              text: 'その後は朝まで部屋にいた。悲鳴も聞いていない。',
              speaker: 'リカルド',
              emotion: 'normal',
              pressLabel: 'press_3',
              presentTargets: [
                { evidenceId: 'witness_note', label: 'present_witness_note' },
              ],
            },
            {
              text: 'トーマとは仕事仲間だ。殺す理由なんてない。',
              speaker: 'リカルド',
              emotion: 'angry',
              pressLabel: 'press_4',
              presentTargets: [
                { evidenceId: 'letter', label: 'present_letter' },
              ],
            },
          ],
          crossExamLabel: 'cross_exam_start',
        },

        // Press responses
        { cmd: 'label', name: 'press_1' },
        { cmd: 'hold_it', character: 'ユウキ' },
        { cmd: 'text', speaker: 'ユウキ', text: 'なぜ眠れなかったんですか？' },
        { cmd: 'text', speaker: 'リカルド', text: '……旅の疲れだ。それ以上の理由はない。' },
        { cmd: 'jump', label: 'start_debate' },

        { cmd: 'label', name: 'press_2' },
        { cmd: 'hold_it', character: 'ユウキ' },
        { cmd: 'text', speaker: 'ユウキ', text: 'マルタさんとはどんな話をしていたんですか？' },
        { cmd: 'text', speaker: 'リカルド', text: '世間話だ。この街の魔法のこととか、冒険者時代のこととか。' },
        { cmd: 'jump', label: 'start_debate' },

        { cmd: 'label', name: 'press_3' },
        { cmd: 'hold_it', character: 'ユウキ' },
        { cmd: 'text', speaker: 'ユウキ', text: '部屋に戻ってからは一歩も外に出ていない、と？' },
        { cmd: 'text', speaker: 'リカルド', text: 'ああ、そうだ。疲れていたからすぐに眠った。' },
        { cmd: 'text', speaker: 'ユウキ', text: '（本当だろうか……）' },
        { cmd: 'jump', label: 'start_debate' },

        { cmd: 'label', name: 'press_4' },
        { cmd: 'hold_it', character: 'ユウキ' },
        { cmd: 'text', speaker: 'ユウキ', text: 'トーマさんとの間に、何のトラブルもなかったと？' },
        { cmd: 'emotion', character: 'merchant', emotion: 'angry' },
        { cmd: 'text', speaker: 'リカルド', text: '……ないと言っているだろう！' },
        { cmd: 'jump', label: 'start_debate' },

        // Present witness note at statement 3
        { cmd: 'label', name: 'present_witness_note' },
        { cmd: 'objection', character: 'ユウキ' },
        { cmd: 'flash', color: '#ffffff', duration: 300 },
        { cmd: 'text', speaker: 'ユウキ', text: '夜警のノクトさんは、深夜2時頃に路地裏で人影を目撃しています。' },
        { cmd: 'text', speaker: 'ユウキ', text: 'その人影は暗い外套を着て、宿屋の方へ向かっていた。' },
        { cmd: 'text', speaker: 'ユウキ', text: 'リカルドさん、あなたは本当に部屋にいたんですか？' },
        { cmd: 'emotion', character: 'merchant', emotion: 'surprised' },
        { cmd: 'shake', intensity: 10, duration: 500 },
        { cmd: 'text', speaker: 'リカルド', text: 'そ、それは……俺じゃない！\n暗い外套を着た人間なんて他にもいるだろう！' },
        { cmd: 'text', speaker: 'ユウキ', text: '（動揺している……もう一押しだ！）' },
        { cmd: 'jump', label: 'present_letter' },

        // Present letter at statement 4
        { cmd: 'label', name: 'present_letter' },
        { cmd: 'objection', character: 'ユウキ' },
        { cmd: 'flash', color: '#ffffff', duration: 300 },
        { cmd: 'text', speaker: 'ユウキ', text: 'この脅迫状を見てください。\n「代金を払わなければ命はない」' },
        { cmd: 'text', speaker: 'ユウキ', text: 'トーマさん宛てのこの手紙……\n取引を巡ってトーマさんを脅していたのでは？' },
        { cmd: 'shake', intensity: 12, duration: 600 },
        { cmd: 'emotion', character: 'merchant', emotion: 'surprised' },
        { cmd: 'text', speaker: 'リカルド', text: 'な……！？' },
        { cmd: 'text', speaker: 'ユウキ', text: 'そしてこのペンダント。「R.T.へ」——リカルド・ターナーへ。' },
        { cmd: 'text', speaker: 'ユウキ', text: 'トーマさんはあなたとの友情の証であるペンダントを握りしめていた。' },
        { cmd: 'text', speaker: 'ユウキ', text: '最後に信じた相手……それがあなただったんです。' },

        { cmd: 'shake', intensity: 15, duration: 800 },
        { cmd: 'emotion', character: 'merchant', emotion: 'surprised' },
        { cmd: 'text', speaker: 'リカルド', text: '…………。' },
        { cmd: 'text', speaker: 'リカルド', text: '…………そうだ。俺がやった。' },

        { cmd: 'flash', color: '#ffffff', duration: 200 },
        { cmd: 'text', speaker: '', text: 'リカルドはうなだれ、全てを語り始めた。' },
        { cmd: 'text', speaker: 'リカルド', text: 'トーマの奴、俺から取引先を奪おうとしていたんだ。\n俺たちの商売を独り占めにしようと……' },
        { cmd: 'text', speaker: 'リカルド', text: '頭に血が上って……あの夜、問い詰めようとして路地裏に呼び出した。' },
        { cmd: 'text', speaker: 'リカルド', text: '口論になって……気がついたらナイフを手にしていた。' },
        { cmd: 'text', speaker: 'リカルド', text: 'マルタの光魔法を見よう見まねで使って、\n目くらましにしてから……' },
        { cmd: 'emotion', character: 'protagonist', emotion: 'normal' },
        { cmd: 'text', speaker: 'ユウキ', text: '……それで、ペンダントは。' },
        { cmd: 'text', speaker: 'リカルド', text: 'あいつが……死ぬ間際に俺の胸ぐらを掴んで……\nペンダントが外れて落ちたんだ。' },
        { cmd: 'text', speaker: 'リカルド', text: '……友情の証、か。\n全部、俺が壊したんだな。' },

        // Resolution
        { cmd: 'fade', direction: 'out', duration: 1000, color: '#000000' },
        { cmd: 'wait', duration: 500 },
        { cmd: 'bg', id: bg.guard_post },
        { cmd: 'fade', direction: 'in', duration: 800, color: '#000000' },
        { cmd: 'char_show', id: 'protagonist', position: 'left', emotion: 'normal' },
        { cmd: 'char_show', id: 'guard', position: 'right', emotion: 'normal' },

        { cmd: 'text', speaker: 'ガルド', text: 'まさか本当に犯人を見つけるとはな。\n見事だ、ユウキ。' },
        { cmd: 'text', speaker: 'ガルド', text: 'お前の無実は証明された。探偵権の行使は成功だ。' },
        { cmd: 'text', speaker: 'ユウキ', text: 'ありがとうございます……。' },
        { cmd: 'text', speaker: 'ガルド', text: 'それにしても、異国から来たばかりで見事な推理だったな。\nこの街で探偵業を営むつもりはないか？' },
        { cmd: 'emotion', character: 'protagonist', emotion: 'happy' },
        { cmd: 'text', speaker: 'ユウキ', text: '探偵業……。' },
        { cmd: 'think', text: '（この世界に来た理由はまだ分からない。\nでも、ここで生きていく手段が必要だ）' },
        { cmd: 'text', speaker: 'ユウキ', text: '……考えてみます。' },
        { cmd: 'text', speaker: 'ガルド', text: 'ふっ、楽しみにしている。\n何かあればいつでも衛兵詰所を訪ねるといい。' },

        { cmd: 'fade', direction: 'out', duration: 1500, color: '#000000' },
        { cmd: 'wait', duration: 800 },

        { cmd: 'fullscreen_text', text: '第１章「転移の夜に響く悲鳴」\n\n── 完 ──' },
        { cmd: 'chapter_end', nextChapter: 'chapter2' },
      ],
    },
  };
}
