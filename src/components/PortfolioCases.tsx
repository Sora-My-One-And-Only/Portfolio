import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { portfolioCopy, type PortfolioLanguage } from '../data/portfolio';

type CasesProps = {
  language: PortfolioLanguage;
};

export default function PortfolioCases({ language }: CasesProps) {
  const content = portfolioCopy[language];
  const [stageIndex, setStageIndex] = useState(0);
  const stage = content.arenaStages[stageIndex];

  return (
    <div className="design-cases">
      <section id="battle-design" aria-labelledby="battle-title">
        <h3 id="battle-title">{content.battleTitle}</h3>
        <p>{content.battleDescription}</p>
        <ol className="combat-loop">
          {content.battleSteps.map((step, index) => (
            <li key={step}>
              <span>{step}</span>
              {index < content.battleSteps.length - 1 && <ArrowRight aria-hidden="true" size={16} />}
            </li>
          ))}
        </ol>
      </section>
      <section id="level-design" aria-labelledby="level-title">
        <h3 id="level-title">{content.arenaTitle}</h3>
        <p>{content.arenaDescription}</p>
        <figure className="arena-figure">
          <div className="arena-controls" role="group" aria-label={content.arenaCaption}>
            {content.arenaStages.map(({ name }, index) => (
              <button key={name} type="button" aria-pressed={stageIndex === index} onClick={() => setStageIndex(index)}>
                {name}
              </button>
            ))}
          </div>
          <div className={`arena-map arena-map--${stageIndex}`} aria-hidden="true">
            <span className="arena-platform platform-a">A</span>
            <span className="arena-platform platform-b">B</span>
            <span className="arena-platform platform-c">C</span>
            <span className="arena-platform platform-center">{content.centerPlatform}</span>
            <span className="arena-bridge bridge-a" />
            <span className="arena-bridge bridge-b" />
            <span className="arena-bridge bridge-c" />
            <ArrowDown className="arena-transfer" size={23} />
          </div>
          <figcaption>
            <span>{content.arenaCaption}</span>
            <p aria-live="polite">{stage.description}</p>
          </figcaption>
        </figure>
      </section>
    </div>
  );
}
