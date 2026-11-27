/**
 * プレイ履歴の両側に並べていた人物の立ち絵（public/portraits）。
 * 著作権の配慮で、いまはどのページにも表示していない。素材とこの部品は、再利用に備えて残している。
 */
const playStation = [
  'djeeta', 'kliff', 'tarnished', 'cloud', 'aloy', 'jin-sakai', 'clive', 'noctis',
  'sam-bridges', 'kratos', 'musashi', 'ellie', 'jack-garland', 'nameless-militia',
  'destined-one', 'joel', 'soul', 'astro', 'sifu-disciple', 'hogwarts-student',
];

const steam = [
  'nomad', 'pioneer', 'magnus', 'franklin', 'sam-bridges', 'astroneer', 'yuito',
  'alphen', 'fifth-fleet-hunter', 'may', 'jake-higgins', 'traveller', 'bayek',
  'ryza', 'v', 'zoe', 'leon', 'ori', 'kyle-crane', 'beatrix',
];

/**
 * 立ち絵の顔の向き（画面上で）：l＝左を向く、r＝右を向く、f＝正面。
 * 左の余白の人物は右（本文のほう）を、右の余白の人物は左を向くよう、逆向きのものは左右を反転する。
 */
const facing: Record<string, 'l' | 'r' | 'f'> = {
  djeeta: 'f', kliff: 'l', tarnished: 'l', cloud: 'r', aloy: 'r', 'jin-sakai': 'r', clive: 'f', noctis: 'r',
  'sam-bridges': 'r', kratos: 'l', musashi: 'l', ellie: 'r', 'jack-garland': 'l', 'nameless-militia': 'f',
  'destined-one': 'r', joel: 'r', soul: 'r', astro: 'f', 'sifu-disciple': 'l',
  nomad: 'r', pioneer: 'r', magnus: 'r', franklin: 'l', astroneer: 'r', yuito: 'r', alphen: 'r',
  'fifth-fleet-hunter': 'r', may: 'f', 'jake-higgins': 'r', traveller: 'r', bayek: 'l', ryza: 'l',
  zoe: 'r', leon: 'l', ori: 'r', beatrix: 'l',
};

export function CharacterMargins() {
  return (
    <div className="character-margins" aria-hidden="true">
      {[playStation, steam].map((ranking, side) => (
        <div className="character-margin" key={side}>
          {ranking.map((name) => {
            const face = facing[name] ?? 'f';
            const flip = (side === 0 && face === 'l') || (side === 1 && face === 'r');
            return (
              <div className={`character-vignette${flip ? ' is-flipped' : ''}`} key={name}>
                <img
                  src={`${import.meta.env.BASE_URL}portraits/${name}.webp`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  // 立ち絵がまだ無い人物は枠ごと詰める
                  onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
