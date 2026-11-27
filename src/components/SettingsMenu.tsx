import { useEffect, useRef, useState, type FC, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Music, Settings2, Volume2, X } from 'lucide-react';
import type { Locale } from '../content/interface-copy';
import { DEFAULT_THEME, THEMES, type ThemeGroup, type ThemeMode, type ThemeOption } from '../content/themes';

/**
 * 右上の「設定」ボタンと、画面中央に開く設定のウィンドウ。言語と昼夜の切り替え以外はここにまとめる。
 *   - サウンド：BGM と効果音
 *   - 配色テーマ：昼と夜で別々に選べる。系統ごとに折りたたみ、選んでいるテーマの系統だけ最初に開く
 * 選んだテーマは localStorage に保存し、index.html の小さなスクリプトが描画前に html へ反映する（ちらつき防止）。
 */

export const THEME_STORE_KEY = 'sora-theme';

type Stored = Record<ThemeMode, string>;

const readStored = (): Stored => {
  try {
    const raw = JSON.parse(localStorage.getItem(THEME_STORE_KEY) || '{}');
    const valid = (mode: ThemeMode, id: unknown) =>
      typeof id === 'string' && THEMES.some((t) => t.mode === mode && t.id === id) ? id : DEFAULT_THEME[mode];
    return { light: valid('light', raw.light), dark: valid('dark', raw.dark) };
  } catch {
    return { ...DEFAULT_THEME };
  }
};

const COPY: Record<
  Locale,
  {
    settings: string;
    close: string;
    done: string;
    sound: string;
    bgm: string;
    bgmNote: string;
    sfx: string;
    sfxNote: string;
    theme: string;
    themeNote: string;
    day: string;
    night: string;
    current: string;
    groups: Record<ThemeGroup, string>;
    reset: string;
  }
> = {
  ja: {
    settings: '設定',
    close: '閉じる',
    done: '完了',
    sound: 'サウンド',
    bgm: 'BGM',
    bgmNote: 'JRPG 風の室内楽',
    sfx: '効果音',
    sfxNote: '紙とページめくりの音',
    theme: '配色テーマ',
    themeNote: '昼と夜で、それぞれ別のテーマを選べます',
    day: '昼',
    night: '夜',
    current: '使用中',
    groups: { game: 'ゲーム', classic: '美術・旧世紀', modern: '美術・近現代', living: '暮らしの色' },
    reset: '初期設定に戻す',
  },
  zh: {
    settings: '设置',
    close: '关闭',
    done: '完成',
    sound: '声音',
    bgm: '背景音乐',
    bgmNote: '日式 RPG 风格的室内乐',
    sfx: '音效',
    sfxNote: '纸张与翻页的声音',
    theme: '配色主题',
    themeNote: '日间与夜间可分别选择',
    day: '日间',
    night: '夜间',
    current: '使用中',
    groups: { game: '游戏', classic: '美术·旧世纪', modern: '美术·近现代', living: '生活之色' },
    reset: '恢复默认',
  },
  en: {
    settings: 'Settings',
    close: 'Close',
    done: 'Done',
    sound: 'Sound',
    bgm: 'Music',
    bgmNote: 'JRPG-style chamber music',
    sfx: 'Sound effects',
    sfxNote: 'Paper and page-turn foley',
    theme: 'Colour theme',
    themeNote: 'Day and night are chosen separately',
    day: 'Day',
    night: 'Night',
    current: 'In use',
    groups: { game: 'Games', classic: 'Classic art', modern: 'Modern art', living: 'Everyday colours' },
    reset: 'Reset to default',
  },
};

const GROUP_ORDER: ThemeGroup[] = ['game', 'classic', 'modern', 'living'];

/** 地・文字・差し色・補助色を、面積の比率（6:2:1:1）で並べた見本 */
const Swatch: FC<{ colors: ThemeOption['swatch']; className?: string }> = ({ colors, className = '' }) => (
  <span className={`flex overflow-hidden border border-[var(--c-rule)] ${className}`}>
    <span className="block h-full" style={{ width: '60%', background: colors[0] }} />
    <span className="block h-full" style={{ width: '20%', background: colors[1] }} />
    <span className="block h-full" style={{ width: '10%', background: colors[2] }} />
    <span className="block h-full" style={{ width: '10%', background: colors[3] }} />
  </span>
);

const Switch: FC<{ on: boolean; label: string; note: string; icon: ReactNode; onToggle: () => void }> = ({
  on,
  label,
  note,
  icon,
  onToggle,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={onToggle}
    className="flex items-center gap-3 px-3 py-2.5 text-left border border-[var(--c-rule)] hover:border-[var(--c-ink-3)] transition-colors cursor-pointer"
  >
    <span className={on ? 'text-[var(--c-accent)]' : 'text-[var(--c-ink-3)]'}>{icon}</span>
    <span className="flex-1 min-w-0">
      <span className="block text-sm text-[var(--c-ink)]">{label}</span>
      <span className="block text-[11px] text-[var(--c-ink-3)] truncate">{note}</span>
    </span>
    <span
      aria-hidden
      className={`relative w-9 h-5 shrink-0 border transition-colors ${
        on ? 'bg-[var(--c-accent)] border-[var(--c-accent)]' : 'bg-[var(--c-inset)] border-[var(--c-rule)]'
      }`}
    >
      <span
        className={`absolute top-[2px] w-3.5 h-3.5 transition-all ${
          on ? 'left-[18px] bg-[var(--c-bg)]' : 'left-[2px] bg-[var(--c-ink-3)]'
        }`}
      />
    </span>
  </button>
);

export const SettingsMenu: FC<{
  locale: Locale;
  darkMode: boolean;
  onToggleTheme: () => void;
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  onToggleBgm: () => void;
  onToggleSfx: () => void;
}> = ({ locale, darkMode, onToggleTheme, bgmEnabled, sfxEnabled, onToggleBgm, onToggleSfx }) => {
  const t = COPY[locale];
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<Stored>(readStored);
  const [tab, setTab] = useState<ThemeMode>(darkMode ? 'dark' : 'light');
  const [openGroups, setOpenGroups] = useState<Set<ThemeGroup>>(new Set());
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const groupOf = (id: string) => THEMES.find((o) => o.id === id)?.group ?? 'classic';

  // テーマを html に反映して保存
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.light = chosen.light;
    root.dataset.dark = chosen.dark;
    try {
      localStorage.setItem(THEME_STORE_KEY, JSON.stringify(chosen));
    } catch {
      /* 保存できなくても表示はそのまま */
    }
  }, [chosen]);

  // 開いたら：いまの時間帯のタブを出し、選んでいるテーマの系統だけ開く。Esc で閉じ、背面のスクロールを止める
  useEffect(() => {
    if (!open) return;
    const mode: ThemeMode = darkMode ? 'dark' : 'light';
    setTab(mode);
    setOpenGroups(new Set([groupOf(chosen[mode])]));
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      root.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      triggerRef.current?.focus();
    };
    // 開いた瞬間の状態だけで決める
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const switchTab = (mode: ThemeMode) => {
    setTab(mode);
    setOpenGroups(new Set([groupOf(chosen[mode])]));
  };

  const toggleGroup = (g: ThemeGroup) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });

  const pick = (mode: ThemeMode, id: string) => {
    setChosen((prev) => ({ ...prev, [mode]: id }));
    // 選んだテーマがすぐ見えるよう、その時間帯に切り替える
    if ((mode === 'dark') !== darkMode) onToggleTheme();
  };

  const list = THEMES.filter((o) => o.mode === tab);
  const currentOption = list.find((o) => o.id === chosen[tab]);

  const dialog = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="settings-dialog"
          className="fixed inset-0 z-[400] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* 背面 */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-hidden />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[560px] max-h-[88vh] flex flex-col bg-[var(--c-surface)] border border-[var(--c-rule)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] text-[var(--c-ink)]"
          >
            {/* 見出し */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--c-rule)]">
              <h2 id="settings-title" className="flex items-center gap-2.5 font-logo text-lg font-semibold tracking-wide">
                <Settings2 className="w-4 h-4 text-[var(--c-accent)]" />
                {t.settings}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="w-8 h-8 flex items-center justify-center border border-[var(--c-rule)] hover:border-[var(--c-ink)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-7">
              {/* サウンド */}
              <section>
                <p className="mb-2.5 text-[10px] font-mono tracking-[0.2em] text-[var(--c-ink-3)]">{t.sound}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Switch on={bgmEnabled} label={t.bgm} note={t.bgmNote} icon={<Music className="w-4 h-4" />} onToggle={onToggleBgm} />
                  <Switch on={sfxEnabled} label={t.sfx} note={t.sfxNote} icon={<Volume2 className="w-4 h-4" />} onToggle={onToggleSfx} />
                </div>
              </section>

              {/* 配色テーマ */}
              <section>
                <div className="flex items-end justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[10px] font-mono tracking-[0.2em] text-[var(--c-ink-3)]">{t.theme}</p>
                    <p className="mt-1 text-[11px] text-[var(--c-ink-3)]">{t.themeNote}</p>
                  </div>
                  <div className="grid grid-cols-2 border border-[var(--c-rule)] text-xs shrink-0">
                    {(['light', 'dark'] as ThemeMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => switchTab(m)}
                        aria-pressed={tab === m}
                        className={`px-4 py-1.5 cursor-pointer transition-colors ${
                          tab === m ? 'bg-[var(--c-ink)] text-[var(--c-bg)]' : 'text-[var(--c-ink-2)] hover:text-[var(--c-ink)]'
                        }`}
                      >
                        {m === 'light' ? t.day : t.night}
                      </button>
                    ))}
                  </div>
                </div>

                {/* いま選んでいるテーマ */}
                {currentOption && (
                  <div className="flex items-center gap-3 px-3 py-2.5 mb-3 bg-[var(--c-inset)]">
                    <Swatch colors={currentOption.swatch} className="w-16 h-8 shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-[10px] font-mono tracking-[0.16em] text-[var(--c-accent)]">{t.current}</span>
                      <span className="block text-sm">{currentOption.name[locale]}</span>
                    </span>
                  </div>
                )}

                {/* 系統ごとに折りたたみ。昼／夜のタブを切り替えると、一覧がふわっと入れ替わる */}
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-[var(--c-rule)]"
                >
                  {GROUP_ORDER.map((g) => {
                    const items = list.filter((o) => o.group === g);
                    if (!items.length) return null;
                    const expanded = openGroups.has(g);
                    const hasCurrent = items.some((o) => o.id === chosen[tab]);
                    return (
                      <div key={g} className="border-b border-[var(--c-rule)]">
                        <button
                          type="button"
                          onClick={() => toggleGroup(g)}
                          aria-expanded={expanded}
                          className="w-full flex items-center gap-3 py-3 text-left cursor-pointer group"
                        >
                          <ChevronDown
                            className={`w-4 h-4 shrink-0 text-[var(--c-ink-3)] transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`}
                          />
                          <span className="text-sm group-hover:text-[var(--c-accent)] transition-colors">{t.groups[g]}</span>
                          <span className="text-[10px] font-mono text-[var(--c-ink-3)]">{items.length}</span>
                          {hasCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-accent)]" aria-hidden />}
                          {/* 閉じていても系統の雰囲気がわかるよう、差し色だけ並べる */}
                          <span className="ml-auto flex gap-1" aria-hidden>
                            {items.slice(0, 10).map((o) => (
                              <span key={o.id} className="block w-2.5 h-2.5" style={{ background: o.swatch[2] }} />
                            ))}
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.div
                              key="list"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-3">
                                {items.map((o) => {
                                  const selected = chosen[tab] === o.id;
                                  return (
                                    <button
                                      key={o.id}
                                      type="button"
                                      onClick={() => pick(tab, o.id)}
                                      aria-pressed={selected}
                                      className={`relative flex flex-col gap-2 p-2.5 text-left border transition-colors cursor-pointer ${
                                        selected
                                          ? 'border-[var(--c-accent)] bg-[var(--c-inset)]'
                                          : 'border-[var(--c-rule)] hover:border-[var(--c-ink-3)]'
                                      }`}
                                    >
                                      <Swatch colors={o.swatch} className="w-full h-7" />
                                      <span className="min-w-0 pr-5">
                                        <span className="block text-[13px] leading-tight">{o.name[locale]}</span>
                                      </span>
                                      {selected && <Check className="absolute right-2 bottom-2.5 w-4 h-4 text-[var(--c-accent)]" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              </section>
            </div>

            {/* 下部 */}
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-[var(--c-rule)]">
              <button
                type="button"
                onClick={() => {
                  setChosen({ ...DEFAULT_THEME });
                  setOpenGroups(new Set([groupOf(DEFAULT_THEME[tab])]));
                }}
                className="text-[11px] text-[var(--c-ink-3)] hover:text-[var(--c-accent)] underline underline-offset-4 cursor-pointer"
              >
                {t.reset}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-5 py-1.5 text-xs bg-[var(--c-ink)] text-[var(--c-bg)] hover:bg-[var(--c-accent)] transition-colors cursor-pointer"
              >
                {t.done}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.settings}
        aria-haspopup="dialog"
        title={t.settings}
        className="group w-8 h-8 flex items-center justify-center border border-[var(--c-rule)] hover:border-[var(--c-ink)] transition-colors cursor-pointer shrink-0 text-[var(--c-ink)]"
      >
        <Settings2 className="w-3.5 h-3.5 transition-transform duration-500 ease-out group-hover:rotate-90" />
      </button>
      {/* ヘッダーは transform を持つので、ウィンドウは body 直下に出す */}
      {typeof document !== 'undefined' && createPortal(dialog, document.body)}
    </>
  );
};
