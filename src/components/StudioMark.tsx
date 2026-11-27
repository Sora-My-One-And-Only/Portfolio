import { useId, type FC } from 'react';

/**
 * 工作室のマーク（オリジナル）。
 * 六角形の枠に、ボタンの目（× の縫い目）をした垂れ耳うさぎのぬいぐるみと、首のリボンを入れたもの。
 * 面は currentColor。目・リボン・耳と頭のすき間はマスクで透明に抜くので、どの背景色の上でもそのまま使える。
 * （以前の線画ロゴ public/brand/sora-mark.svg は素材として残している）
 */
const EAR = 'M52 43 C48 29 34 27 28 37 C22 47 22 70 26 88 C28 95 35.5 96 37 89 C38 78 38.5 64 45 54 C48 50 50 46.5 52 43 Z';

export const StudioMark: FC<{ className?: string; title?: string }> = ({ className = 'w-8 h-8', title }) => {
  const mask = `studio-mark-${useId().replace(/:/g, '')}`;
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        {/* 白＝塗る、黒＝抜く。上に描いたものが下を上書きする */}
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
          {/* 頭のてっぺんから長く垂れた耳（左右対称） */}
          <path d={EAR} fill="white" />
          <path d={EAR} fill="white" transform="translate(120 0) scale(-1 1)" />
          {/* 頭。黒い縁取りで耳との間にすき間を作る */}
          <ellipse cx="60" cy="62" rx="22" ry="20" fill="white" stroke="black" strokeWidth="3" />
          {/* ボタンの目（× の縫い目） */}
          <g fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="50.5" cy="60" r="5.6" />
            <path d="M47.7 57.2 L53.3 62.8 M53.3 57.2 L47.7 62.8" />
            <circle cx="69.5" cy="60" r="5.6" />
            <path d="M66.7 57.2 L72.3 62.8 M72.3 57.2 L66.7 62.8" />
          </g>
          {/* 首のリボン（輪 2 つと結び目） */}
          <g fill="black" stroke="white" strokeWidth="2.2" strokeLinejoin="round">
            <path d="M60 87 L46.5 80.5 L46.5 93.5 Z" />
            <path d="M60 87 L73.5 80.5 L73.5 93.5 Z" />
          </g>
          <circle cx="60" cy="87" r="3.6" fill="white" />
        </mask>
      </defs>

      {/* 六角形の枠（表紙の紋章） */}
      <polygon
        points="60,7 107,33.5 107,86.5 60,113 13,86.5 13,33.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <rect width="120" height="120" fill="currentColor" mask={`url(#${mask})`} />
    </svg>
  );
};
