import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface JrpgTrackPreset {
  id: string;
  code: string;
  title: {
    ja: string;
    zh: string;
    en: string;
  };
  instrumentation: {
    ja: string;
    zh: string;
    en: string;
  };
  prompt: string;
}

const JRPG_PRESETS: Record<string, JrpgTrackPreset> = {
  'dawn-archive': {
    id: 'dawn-archive',
    code: 'OST-01',
    title: {
      ja: '黎明の書架 — Dawn Archive Prelude',
      zh: '黎明之书架 — 设定集序曲 (木吉他与竖琴)',
      en: 'Dawn Archive Prelude (Acoustic Guitar & Harp)',
    },
    instrumentation: {
      ja: 'ガットギター・コンサートハープ・フェルトピアノ・チェロ',
      zh: '古典尼龙弦木吉他 · 音乐会竖琴 · 柔和毡音钢琴 · 独奏大提琴',
      en: 'Nylon Acoustic Guitar · Concert Harp · Felt Piano · Solo Cello',
    },
    prompt:
      'Generate a 30-second instrumental acoustic JRPG title screen and library sanctuary theme. Warm fingerstyle nylon-string acoustic guitar, delicate concert harp arpeggios, soft felt piano with una corda pedal, and a warm expressive solo cello melody in an intimate wooden chamber hall. Slow peaceful 68 BPM in D major / B minor, nostalgic, healing, organic acoustic instruments only, warm low-mids, gentle high-frequency roll-off, no harsh frequencies, no synthesizers, no drums, no vocals.',
  },
  'twilight-town': {
    id: 'twilight-town',
    code: 'OST-02',
    title: {
      ja: '黄昏の宿場町 — Twilight Sanctuary',
      zh: '黄昏之宿场町 — 旅途休憩曲 (木笛与吉他二重奏)',
      en: 'Twilight Sanctuary (Wooden Flute & Guitar Duet)',
    },
    instrumentation: {
      ja: 'アコースティックギター二重奏・木製フルート・コントラバス',
      zh: '原声木吉他二重奏 · 温暖木笛旋律 · 拨弦低音提琴',
      en: 'Acoustic Guitar Duet · Warm Wooden Flute · Upright Bass',
    },
    prompt:
      'Generate a 30-second instrumental cozy JRPG peaceful town theme at sunset. Warm fingerpicked acoustic guitar duet, a soft wooden alto flute playing a gentle wistful melody, accompanied by warm plucked upright bass and soft celesta harmonics. Relaxing 72 BPM, classic Japanese RPG acoustic soundtrack aesthetic, natural wooden room reverb, soothing and warm, no shrill high notes, no electronic synths, no vocals.',
  },
  'starlight-nocturne': {
    id: 'starlight-nocturne',
    code: 'OST-03',
    title: {
      ja: '星見の回廊 — Starlight Nocturne',
      zh: '观星回廊 — 静谧夜曲 (柔和毡音钢琴与室内弦乐)',
      en: 'Starlight Nocturne (Felt Piano & Chamber Strings)',
    },
    instrumentation: {
      ja: 'フェルトピアノ・ヴィオラ・チェロ・ハープハーモニクス',
      zh: '弱音毡制立式钢琴 · 中提琴与大提琴室内弦乐 · 竖琴泛音',
      en: 'Soft Felt Upright Piano · Viola & Cello Strings · Harp Harmonics',
    },
    prompt:
      'Generate a 30-second instrumental serene JRPG night sanctuary nocturne. Softly felted upright piano playing lush extended maj9 chords, warm acoustic harp harmonics, and lush muted chamber strings (viola and cello). Peaceful 62 BPM, dreamy, healing, intimate acoustic studio recording, warm analog tape warmth, no harsh highs, no electronic synthesizers, no percussion, no vocals.',
  },
};

interface CachedTrack {
  buffer: Buffer;
  mimeType: string;
  description: string;
  model: string;
  createdAt: number;
}

const audioCache = new Map<string, CachedTrack>();
const inFlightGenerations = new Map<string, Promise<CachedTrack>>();

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY or API_KEY in environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateLyriaTrack(
  cacheKey: string,
  prompt: string,
  model: 'lyria-3-clip-preview' | 'lyria-3-pro-preview'
): Promise<CachedTrack> {
  const existingPromise = inFlightGenerations.get(cacheKey);
  if (existingPromise) {
    return existingPromise;
  }

  const generationPromise = (async () => {
    try {
      const ai = getGenAIClient();
      const response = await ai.models.generateContentStream({
        model,
        contents: prompt,
      });

      const audioChunks: Buffer[] = [];
      let description = '';
      let mimeType = 'audio/mpeg';

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (audioChunks.length === 0 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioChunks.push(Buffer.from(part.inlineData.data, 'base64'));
          }
          if (part.text) {
            description += part.text;
          }
        }
      }

      if (audioChunks.length === 0) {
        throw new Error('Lyria model completed without returning audio chunks.');
      }

      const combinedBuffer = Buffer.concat(audioChunks);
      const cached: CachedTrack = {
        buffer: combinedBuffer,
        mimeType,
        description: description.trim(),
        model,
        createdAt: Date.now(),
      };

      audioCache.set(cacheKey, cached);
      return cached;
    } finally {
      inFlightGenerations.delete(cacheKey);
    }
  })();

  inFlightGenerations.set(cacheKey, generationPromise);
  return generationPromise;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  // List available JRPG presets and their cache status
  app.get('/api/bgm/presets', (_req, res) => {
    const presets = Object.values(JRPG_PRESETS).map((preset) => ({
      ...preset,
      cachedClip: audioCache.has(`${preset.id}:lyria-3-clip-preview`),
      cachedPro: audioCache.has(`${preset.id}:lyria-3-pro-preview`),
    }));
    res.json({ presets });
  });

  // Stream a cached track directly as binary MP3 with range support for smooth <audio loop>
  app.get('/api/bgm/stream/:cacheKey', (req, res) => {
    const key = decodeURIComponent(req.params.cacheKey);
    const track = audioCache.get(key);
    if (!track) {
      res.status(404).json({ error: 'Track not found in cache' });
      return;
    }

    const total = track.buffer.length;
    const range = req.headers.range;

    res.setHeader('Content-Type', track.mimeType || 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-store');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
      const chunksize = end - start + 1;
      const sliced = track.buffer.subarray(start, end + 1);

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Content-Length': chunksize,
      });
      res.end(sliced);
    } else {
      res.setHeader('Content-Length', total);
      res.end(track.buffer);
    }
  });

  // Generate or retrieve a JRPG BGM track using Gemini Lyria
  app.post('/api/bgm/generate', async (req, res) => {
    try {
      const {
        presetId = 'dawn-archive',
        customPrompt,
        model = 'lyria-3-clip-preview',
        forceRegenerate = false,
      } = req.body || {};

      const selectedModel: 'lyria-3-clip-preview' | 'lyria-3-pro-preview' =
        model === 'lyria-3-pro-preview' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

      const preset = JRPG_PRESETS[presetId] || JRPG_PRESETS['dawn-archive'];
      const effectivePrompt =
        typeof customPrompt === 'string' && customPrompt.trim().length > 0
          ? `${customPrompt.trim()}. Instrumental acoustic JRPG soundtrack, warm organic acoustic instruments, soothing, no harsh highs, no vocals.`
          : preset.prompt;

      const cacheKey =
        typeof customPrompt === 'string' && customPrompt.trim().length > 0
          ? `custom:${Buffer.from(customPrompt.trim()).toString('base64').slice(0, 24)}:${selectedModel}`
          : `${preset.id}:${selectedModel}`;

      if (!forceRegenerate && audioCache.has(cacheKey)) {
        const cached = audioCache.get(cacheKey)!;
        res.json({
          cacheKey,
          presetId: preset.id,
          model: cached.model,
          mimeType: cached.mimeType,
          description: cached.description,
          audioUrl: `/api/bgm/stream/${encodeURIComponent(cacheKey)}?t=${cached.createdAt}`,
          cached: true,
        });
        return;
      }

      const generated = await generateLyriaTrack(cacheKey, effectivePrompt, selectedModel);

      res.json({
        cacheKey,
        presetId: preset.id,
        model: generated.model,
        mimeType: generated.mimeType,
        description: generated.description,
        audioUrl: `/api/bgm/stream/${encodeURIComponent(cacheKey)}?t=${generated.createdAt}`,
        cached: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown Lyria generation error';
      console.error('[Lyria BGM Generation Error]:', message);
      res.status(500).json({
        error: message,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
