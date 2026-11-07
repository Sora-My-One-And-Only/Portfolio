import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  GitFork,
  ExternalLink,
  RefreshCw,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';
import { FALLBACK_GITHUB_REPOS, FallbackRepo, Locale, UI_TEXT } from '../data/i18n';
import { soundFX } from '../utils/sound';

interface GitHubLiveModuleProps {
  locale: Locale;
  githubUsername: string;
  onUsernameChange: (newUsername: string) => void;
}

interface SimpleRepo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

export const GitHubLiveModule: React.FC<GitHubLiveModuleProps> = ({
  locale,
  githubUsername,
  onUsernameChange,
}) => {
  const t = UI_TEXT[locale].github;
  const [inputUser, setInputUser] = useState<string>(githubUsername);
  const [loading, setLoading] = useState<boolean>(false);
  const [liveRepos, setLiveRepos] = useState<SimpleRepo[]>([]);
  const [showDeployGuide, setShowDeployGuide] = useState<boolean>(true);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const fallbackRepos: SimpleRepo[] = useMemo(() => {
    return FALLBACK_GITHUB_REPOS.slice(0, 3).map((r: FallbackRepo) => ({
      id: r.id,
      name: r.name,
      html_url: `https://github.com/${githubUsername}/${r.name}`,
      description: r.description[locale],
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
    }));
  }, [locale, githubUsername]);

  const fetchRepos = async (user: string) => {
    const clean = user.trim().replace(/^@/, '').replace(/\.github\.io$/i, '');
    if (!clean) return;
    setLoading(true);
    onUsernameChange(clean);
    setInputUser(clean);

    if (clean.toLowerCase() === 'kurogane-dev') {
      setLiveRepos([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(clean)}/repos?sort=updated&per_page=3`
      );
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLiveRepos(
          data.slice(0, 3).map((r: Record<string, unknown>, i: number) => ({
            id: Number(r.id || i),
            name: String(r.name || 'repo'),
            html_url: String(r.html_url || `https://github.com/${clean}`),
            description: String(r.description || `${clean}.github.io project`),
            language: String(r.language || 'TypeScript'),
            stargazers_count: Number(r.stargazers_count || 0),
            forks_count: Number(r.forks_count || 0),
          }))
        );
        soundFX.playSelect();
      } else {
        setLiveRepos([]);
      }
    } catch {
      setLiveRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (githubUsername && githubUsername !== 'kurogane-dev') {
      fetchRepos(githubUsername);
    }
  }, []);

  const displayList = liveRepos.length > 0 ? liveRepos : fallbackRepos;
  const targetRepoName = `${githubUsername || 'kurogane-dev'}.github.io`;
  const gitPushCommands = `git init -b main
git add -A
git commit -m "feat: publish Official Game Design Works portfolio (.github.io)"
git remote add origin https://github.com/${githubUsername || 'kurogane-dev'}/${targetRepoName}.git
git push -u origin main`;

  const handleCopyCommands = () => {
    soundFX.playSelect();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(gitPushCommands).catch(() => {});
    }
    setCopiedCmd(true);
    window.setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-[#181A1C] dark:border-[#F2EFE9]">
        <div className="min-w-0">
          <div className="text-xs font-mono tracking-[0.24em] text-[#C84B31] dark:text-[#E57052] mb-3 editorial-callout-line">
            CHAPTER 05 // OPEN SOURCE CODE ARCHIVE & GITHUB.IO SYNC
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15] min-h-[1.15em]">
            {locale === 'ja'
              ? 'GitHub 公開リポジトリ索引'
              : locale === 'zh'
              ? 'GitHub 开源代码仓库索引'
              : 'GitHub Repository Index'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchRepos(inputUser);
            }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center h-10 border border-[#E2E0D8] dark:border-[#2E2924] bg-white dark:bg-[#1B1916] px-3.5">
              <input
                type="text"
                value={inputUser}
                onChange={(e) => setInputUser(e.target.value)}
                placeholder="GitHub ID"
                className="w-28 sm:w-32 bg-transparent text-xs font-mono focus:outline-none"
              />
              <span className="text-xs font-mono text-[#888E94]">.github.io</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 h-10 min-w-[104px] px-4 text-xs font-mono tracking-wider btn-3d-primary cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${loading ? 'animate-spin' : ''}`} />
              <span>{t.fetchBtn}</span>
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setShowDeployGuide((prev) => !prev);
            }}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 text-xs font-mono tracking-wider btn-3d-secondary cursor-pointer whitespace-nowrap"
          >
            <Terminal className="w-3.5 h-3.5 text-[#C84B31] dark:text-[#E57052] shrink-0" />
            <span>
              {locale === 'ja'
                ? '.github.io 同期・公開手順'
                : locale === 'zh'
                ? '.github.io 仓库同步指南'
                : '.github.io Sync Guide'}
            </span>
          </button>
        </div>
      </div>

      {/* Interactive .github.io Repository Sync & Deployment Panel */}
      {showDeployGuide && (
        <div className="mb-12 p-6 sm:p-8 card-3d-console border-l-2 border-l-[#C84B31] dark:border-l-[#E57052] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E0D8] dark:border-[#2E2924]">
            <div>
              <div className="text-[11px] font-mono tracking-[0.2em] text-[#C84B31] dark:text-[#E57052]">
                GITHUB PAGES READY // 静态站点与 GitHub Actions 已配置就绪
              </div>
              <h3 className="mt-1 font-editorial text-xl sm:text-2xl font-semibold">
                {locale === 'ja'
                  ? `『${targetRepoName}』として GitHub にアップロード・公開する`
                  : locale === 'zh'
                  ? `一键同步并发布为「${targetRepoName}」个人设定集网站`
                  : `Sync & Publish as "${targetRepoName}" on GitHub Pages`}
              </h3>
            </div>

            <a
              href="https://github.com/new"
              target="_blank"
              rel="noreferrer"
              onClick={() => soundFX.playSelect()}
              className="inline-flex items-center gap-2 h-9 px-4 text-xs font-mono tracking-wider btn-3d-primary self-start sm:self-auto whitespace-nowrap"
            >
              <span>
                {locale === 'ja'
                  ? 'GitHub で新規リポジトリ作成'
                  : locale === 'zh'
                  ? '前往 GitHub 新建 .github.io 仓库'
                  : 'Create .github.io Repo on GitHub'}
              </span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-3 text-xs sm:text-sm text-[#555B61] dark:text-[#B0A89E] leading-relaxed">
              <p>
                <strong className="text-[#181A1C] dark:text-[#F2EFE9] font-mono">
                  STEP 01 (AI Studio 顶部一键同步)：
                </strong>{' '}
                {locale === 'ja'
                  ? `画面右上の「GitHub アイコン（Sync to GitHub）」をクリックし、リポジトリ名を「${targetRepoName}」に設定して同期します。`
                  : locale === 'zh'
                  ? `直接点击当前 AI Studio 界面右上角的「GitHub 图标（导出/同步到 GitHub）」，在弹窗中将仓库名填写为 ${targetRepoName} 即可直接上传到你的 GitHub 账号。`
                  : `Click the GitHub icon in the top-right toolbar of AI Studio and name your repository "${targetRepoName}" to push directly to your GitHub account.`}
              </p>
              <p>
                <strong className="text-[#181A1C] dark:text-[#F2EFE9] font-mono">
                  STEP 02 (开启 GitHub Actions 自动部署)：
                </strong>{' '}
                {locale === 'ja'
                  ? 'GitHub リポジトリの「Settings → Pages → Build and deployment → Source」で「GitHub Actions」を選択すると、内蔵の .github/workflows/deploy.yml が自動でビルド＆公開します。'
                  : locale === 'zh'
                  ? '上传后进入 GitHub 仓库的「Settings → Pages → Source」，选择「GitHub Actions」。仓库内置的 .github/workflows/deploy.yml 会自动构建并发布至 https://' +
                    targetRepoName +
                    '。'
                  : 'In your GitHub repo, go to "Settings → Pages → Source" and select "GitHub Actions". The built-in workflow (.github/workflows/deploy.yml) will automatically build and publish your site.'}
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#888E94] mb-2">
                <span>CLI PUSH COMMANDS (main branch initialized)</span>
                <button
                  type="button"
                  onClick={handleCopyCommands}
                  className="inline-flex items-center gap-1.5 text-[#C84B31] dark:text-[#E57052] hover:underline cursor-pointer"
                >
                  {copiedCmd ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY COMMANDS</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-[#EFEDE6] dark:bg-[#0D0C0A] border border-[#E2E0D8] dark:border-[#2E2924] text-[11px] font-mono text-[#181A1C] dark:text-[#F2EFE9] overflow-x-auto leading-relaxed">
                <code>{gitPushCommands}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayList.map((repo, idx) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => soundFX.playBlip(580)}
            className="group p-6 sm:p-7 min-h-[208px] flex flex-col justify-between card-3d-console"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#888E94] mb-4">
                <span className="text-[#C84B31] dark:text-[#E57052]">
                  REPO 0{idx + 1} // {repo.language}
                </span>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#C84B31] dark:text-[#E57052]" />
                    {repo.stargazers_count}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" />
                    {repo.forks_count}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-medium font-mono group-hover:text-[#C84B31] dark:group-hover:text-[#E57052] transition-colors flex items-center justify-between gap-2">
                <span className="break-words">{repo.name}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-40 shrink-0" />
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-[#555B61] dark:text-[#B0A89E] leading-relaxed min-h-[4.2rem]">
                {repo.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
