// Official Game Design Works Audio Engine
// 1. BGM Engine (Independent Toggle: `bgmEnabled`):
//    Plays the pre-generated Gemini Lyria acoustic JRPG soundtrack file (`/audio/jrpg-sanctuary-bgm.mp3`)
//    directly via HTML5 `<audio loop>` with smooth fade-in / fade-out.
// 2. Artbook Paper & Page-Turn Foley Engine (Independent Toggle: `sfxEnabled`):
//    Synthesizes multi-layered physical cotton-rag paper friction, bookmark ribbon glide,
//    hardcover linen spine taps, and 3-stage stereo double-spread page turns.

const BGM_STORAGE_KEY = 'kurogane_bgm_enabled';
const SFX_STORAGE_KEY = 'kurogane_sfx_enabled';
const STATIC_BGM_URL = `${import.meta.env.BASE_URL}audio/jrpg-sanctuary-bgm.mp3`;

export interface SoundEngineSnapshot {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  bgmPlaying: boolean;
  volume: number;
}

type SoundListener = (snapshot: SoundEngineSnapshot) => void;

class ArtbookStaticAudioEngine {
  private audioEl: HTMLAudioElement | null = null;
  private fadeTimerId: number | null = null;
  private ctx: AudioContext | null = null;
  private cottonPaperNoiseBuffer: AudioBuffer | null = null; // 1/f Pink noise for crisp paper fibers
  private heavyBoardNoiseBuffer: AudioBuffer | null = null;  // 1/f^2 Brown noise for warm hardcover body
  private lastHoverFoleyMs = 0;
  private hoverPanStep = 0;
  private listeners = new Set<SoundListener>();

  public bgmEnabled: boolean = true;
  public sfxEnabled: boolean = true;
  public bgmPlaying: boolean = false;
  public volume: number = 0.13;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedBgm = window.localStorage.getItem(BGM_STORAGE_KEY);
        if (savedBgm !== null) {
          this.bgmEnabled = savedBgm === 'true';
        }
        const savedSfx = window.localStorage.getItem(SFX_STORAGE_KEY);
        if (savedSfx !== null) {
          this.sfxEnabled = savedSfx === 'true';
        }
      } catch {
        // Ignore storage restrictions
      }

      this.initAudioElement();
      this.setupFirstInteractionAutoPlay();

      if (this.bgmEnabled) {
        window.setTimeout(() => {
          if (this.bgmEnabled && !this.bgmPlaying) {
            this.startBGM();
          }
        }, 250);
      }
    }
  }

  /** Backward-compatible getter */
  public get enabled(): boolean {
    return this.sfxEnabled;
  }

  private initAudioElement() {
    if (typeof window === 'undefined' || this.audioEl) return;
    const audio = new Audio(STATIC_BGM_URL);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = this.volume;

    audio.addEventListener('play', () => {
      this.bgmPlaying = true;
      this.notify();
    });

    audio.addEventListener('pause', () => {
      this.bgmPlaying = false;
      this.notify();
    });

    this.audioEl = audio;
  }

  private setupFirstInteractionAutoPlay() {
    if (typeof window === 'undefined') return;
    const tryUnlock = () => {
      if (this.bgmEnabled && this.audioEl && this.audioEl.paused) {
        this.fadeInAudioElement();
      }
    };
    window.addEventListener('pointerdown', tryUnlock, { passive: true });
    window.addEventListener('keydown', tryUnlock, { passive: true });
  }

  public getSnapshot(): SoundEngineSnapshot {
    return {
      bgmEnabled: this.bgmEnabled,
      sfxEnabled: this.sfxEnabled,
      bgmPlaying: this.bgmPlaying,
      volume: this.volume,
    };
  }

  public subscribe(listener: SoundListener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const snap = this.getSnapshot();
    this.listeners.forEach((fn) => fn(snap));
  }

  /**
   * Independently toggles the pre-generated Gemini Lyria JRPG Background Music (`/audio/jrpg-sanctuary-bgm.mp3`)
   */
  public setBgmEnabled(val: boolean) {
    this.bgmEnabled = val;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(BGM_STORAGE_KEY, String(val));
      } catch {
        // Ignore
      }
    }
    if (val) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    this.notify();
  }

  /**
   * Independently toggles the Artbook Paper & Page-Turn UI Foley
   */
  public setSfxEnabled(val: boolean) {
    this.sfxEnabled = val;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(SFX_STORAGE_KEY, String(val));
      } catch {
        // Ignore
      }
    }
    this.notify();
  }

  public setVolume(val: number) {
    const clamped = Math.max(0.02, Math.min(1, val));
    this.volume = clamped;
    if (this.audioEl) {
      this.audioEl.volume = clamped;
    }
    this.notify();
  }

  public startBGM() {
    if (!this.bgmEnabled || typeof window === 'undefined') return;
    this.initAudioElement();
    this.fadeInAudioElement();
  }

  public stopBGM() {
    if (this.fadeTimerId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.fadeTimerId);
      this.fadeTimerId = null;
    }
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause();
    }
    this.bgmPlaying = false;
    this.notify();
  }

  private fadeInAudioElement() {
    if (!this.audioEl || !this.bgmEnabled) return;
    if (this.fadeTimerId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.fadeTimerId);
      this.fadeTimerId = null;
    }

    const targetVol = this.volume;
    this.audioEl.volume = Math.min(0.015, targetVol);

    const playPromise = this.audioEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.bgmPlaying = true;
          this.notify();

          let currentVol = this.audioEl ? this.audioEl.volume : 0.015;
          const step = Math.max(0.005, (targetVol - currentVol) / 18);
          this.fadeTimerId = window.setInterval(() => {
            if (!this.audioEl || !this.bgmEnabled || this.audioEl.paused) {
              if (this.fadeTimerId !== null) {
                window.clearInterval(this.fadeTimerId);
                this.fadeTimerId = null;
              }
              return;
            }
            currentVol = Math.min(targetVol, currentVol + step);
            this.audioEl.volume = currentVol;
            if (currentVol >= targetVol - 0.003) {
              this.audioEl.volume = targetVol;
              if (this.fadeTimerId !== null) {
                window.clearInterval(this.fadeTimerId);
                this.fadeTimerId = null;
              }
            }
          }, 60);
        })
        .catch(() => {
          this.bgmPlaying = false;
          this.notify();
        });
    }
  }

  // ============================================================================
  // Tactile Artbook Paper, Vellum & Hardcover Page-Turn Foley Engine
  // (Purely organic paper acoustics — zero tonal oscillators or electronic beeps)
  // ============================================================================

  private getFoleyContext(): AudioContext | null {
    if (!this.sfxEnabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * 1/f Pink Noise Buffer — Normalized to 0.85 peak for clear cotton-rag artbook paper grain
   */
  private getCottonPaperNoise(ctx: AudioContext): AudioBuffer {
    if (this.cottonPaperNoiseBuffer && this.cottonPaperNoiseBuffer.sampleRate === ctx.sampleRate) {
      return this.cottonPaperNoiseBuffer;
    }
    const bufferSize = Math.floor(ctx.sampleRate * 0.6);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    let maxAbs = 0.001;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const sample = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] = sample;
      b6 = white * 0.115926;
      const abs = Math.abs(sample);
      if (abs > maxAbs) maxAbs = abs;
    }
    const normScale = 0.85 / maxAbs;
    for (let i = 0; i < bufferSize; i++) {
      output[i] *= normScale;
    }
    this.cottonPaperNoiseBuffer = buffer;
    return buffer;
  }

  /**
   * 1/f^2 Brown/Red Noise Buffer — Normalized to 0.85 peak for warm hardcover book-board body
   */
  private getHeavyBoardNoise(ctx: AudioContext): AudioBuffer {
    if (this.heavyBoardNoiseBuffer && this.heavyBoardNoiseBuffer.sampleRate === ctx.sampleRate) {
      return this.heavyBoardNoiseBuffer;
    }
    const bufferSize = Math.floor(ctx.sampleRate * 0.6);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0.0;
    let maxAbs = 0.001;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.035 * white) / 1.035;
      output[i] = lastOut;
      const abs = Math.abs(lastOut);
      if (abs > maxAbs) maxAbs = abs;
    }
    const normScale = 0.85 / maxAbs;
    for (let i = 0; i < bufferSize; i++) {
      output[i] *= normScale;
    }
    this.heavyBoardNoiseBuffer = buffer;
    return buffer;
  }

  /**
   * Schedules a shaped paper-friction or page-flex layer
   */
  private schedulePaperLayer(
    ctx: AudioContext,
    opts: {
      sourceType: 'cotton' | 'board';
      filterType: BiquadFilterType;
      startFreq: number;
      peakFreq: number;
      endFreq: number;
      q: number;
      startTime: number;
      attackSec: number;
      durationSec: number;
      peakGain: number;
      pan?: number;
    }
  ) {
    const src = ctx.createBufferSource();
    src.buffer =
      opts.sourceType === 'cotton'
        ? this.getCottonPaperNoise(ctx)
        : this.getHeavyBoardNoise(ctx);

    const maxOffset = Math.max(0, src.buffer.duration - opts.durationSec - 0.02);
    const randomOffset = Math.random() * maxOffset;

    const filter = ctx.createBiquadFilter();
    filter.type = opts.filterType;
    filter.Q.setValueAtTime(opts.q, opts.startTime);
    filter.frequency.setValueAtTime(opts.startFreq, opts.startTime);
    filter.frequency.exponentialRampToValueAtTime(
      opts.peakFreq,
      opts.startTime + opts.durationSec * 0.45
    );
    filter.frequency.exponentialRampToValueAtTime(
      opts.endFreq,
      opts.startTime + opts.durationSec
    );

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, opts.startTime);
    gain.gain.linearRampToValueAtTime(opts.peakGain, opts.startTime + opts.attackSec);
    gain.gain.exponentialRampToValueAtTime(0.0001, opts.startTime + opts.durationSec);

    src.connect(filter);
    filter.connect(gain);

    if (typeof ctx.createStereoPanner === 'function' && typeof opts.pan === 'number') {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-0.7, Math.min(0.7, opts.pan)), opts.startTime);
      gain.connect(panner);
      panner.connect(ctx.destination);
    } else {
      gain.connect(ctx.destination);
    }

    src.start(opts.startTime, randomOffset, opts.durationSec + 0.015);
    src.stop(opts.startTime + opts.durationSec + 0.02);
  }

  /**
   * 1. Hover / Index Scan (`playBlip`):
   *    "栞・紙面の指先スライド" — Soft fingertip gliding across matte cotton artbook paper
   */
  public playBlip(_pitchHint?: number) {
    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (nowMs - this.lastHoverFoleyMs < 60) return;
    this.lastHoverFoleyMs = nowMs;

    const ctx = this.getFoleyContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const pan = ((this.hoverPanStep % 5) - 2) * 0.12;
      this.hoverPanStep = (this.hoverPanStep + 1) % 5;

      this.schedulePaperLayer(ctx, {
        sourceType: 'cotton',
        filterType: 'bandpass',
        startFreq: 420,
        peakFreq: 680,
        endFreq: 350,
        q: 1.25,
        startTime: now,
        attackSec: 0.01,
        durationSec: 0.062,
        peakGain: 0.18,
        pan,
      });

      this.schedulePaperLayer(ctx, {
        sourceType: 'board',
        filterType: 'lowpass',
        startFreq: 240,
        peakFreq: 300,
        endFreq: 150,
        q: 0.75,
        startTime: now,
        attackSec: 0.008,
        durationSec: 0.055,
        peakGain: 0.15,
        pan,
      });
    } catch {
      // Ignore
    }
  }

  /**
   * 2. Button / Chapter Click (`playSelect`):
   *    "インデックス紙片めくり" — Crisp cardstock index tab press & short page leaf flick
   */
  public playSelect() {
    const ctx = this.getFoleyContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      this.schedulePaperLayer(ctx, {
        sourceType: 'board',
        filterType: 'lowpass',
        startFreq: 320,
        peakFreq: 210,
        endFreq: 110,
        q: 0.85,
        startTime: now,
        attackSec: 0.006,
        durationSec: 0.08,
        peakGain: 0.32,
        pan: -0.08,
      });

      this.schedulePaperLayer(ctx, {
        sourceType: 'cotton',
        filterType: 'bandpass',
        startFreq: 520,
        peakFreq: 920,
        endFreq: 460,
        q: 1.15,
        startTime: now + 0.012,
        attackSec: 0.015,
        durationSec: 0.105,
        peakGain: 0.30,
        pan: 0.1,
      });
    } catch {
      // Ignore
    }
  }

  /**
   * 3. Folio Spread / Subpage Open (`playPageTurn`):
   *    "見開き厚紙ページめくり音" — Authentic 3-stage stereo artbook page turn
   */
  public playPageTurn() {
    const ctx = this.getFoleyContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Stage 1: Crisp paper corner lift (right)
      this.schedulePaperLayer(ctx, {
        sourceType: 'cotton',
        filterType: 'bandpass',
        startFreq: 560,
        peakFreq: 960,
        endFreq: 640,
        q: 1.3,
        startTime: now,
        attackSec: 0.01,
        durationSec: 0.055,
        peakGain: 0.28,
        pan: 0.28,
      });

      // Stage 2: Full heavy artbook page arc & fiber whoosh (center)
      this.schedulePaperLayer(ctx, {
        sourceType: 'cotton',
        filterType: 'bandpass',
        startFreq: 380,
        peakFreq: 820,
        endFreq: 320,
        q: 1.0,
        startTime: now + 0.025,
        attackSec: 0.045,
        durationSec: 0.165,
        peakGain: 0.42,
        pan: 0.0,
      });

      // Stage 3: Warm cushioned page settle onto opposite binding (left)
      this.schedulePaperLayer(ctx, {
        sourceType: 'board',
        filterType: 'lowpass',
        startFreq: 260,
        peakFreq: 180,
        endFreq: 95,
        q: 0.8,
        startTime: now + 0.135,
        attackSec: 0.016,
        durationSec: 0.095,
        peakGain: 0.34,
        pan: -0.25,
      });
    } catch {
      // Ignore
    }
  }

  /**
   * 4. Day Print / Night Archive Edition Switch (`playThemeSwitch`):
   *    "布張り函・装丁スライド音" — Smooth linen book-slipcase slide
   */
  public playThemeSwitch(toDark: boolean) {
    const ctx = this.getFoleyContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.schedulePaperLayer(ctx, {
        sourceType: 'cotton',
        filterType: 'bandpass',
        startFreq: toDark ? 680 : 360,
        peakFreq: 520,
        endFreq: toDark ? 300 : 660,
        q: 1.1,
        startTime: now,
        attackSec: 0.035,
        durationSec: 0.18,
        peakGain: 0.32,
        pan: toDark ? -0.15 : 0.15,
      });

      this.schedulePaperLayer(ctx, {
        sourceType: 'board',
        filterType: 'lowpass',
        startFreq: 240,
        peakFreq: 190,
        endFreq: 115,
        q: 0.75,
        startTime: now + 0.02,
        attackSec: 0.03,
        durationSec: 0.15,
        peakGain: 0.28,
      });
    } catch {
      // Ignore
    }
  }

  public playTransitionSweep() {
    this.playPageTurn();
  }

  public playSlashHit() {
    this.playSelect();
  }

  public playParrySpark() {
    this.playPageTurn();
  }

  public playFanfare() {
    this.playPageTurn();
  }
}

export const soundFX = new ArtbookStaticAudioEngine();
