import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Github, Moon, Sun } from 'lucide-react';
import PortfolioCases from './components/PortfolioCases';
import { languages, portfolioCopy, type PortfolioLanguage } from './data/portfolio';
import { soundFX } from './utils/sound';
import './portfolio.css';

const levelBuilderUrl = 'https://sora-my-one-and-only.github.io/Level-Builder/';
const githubUrl = 'https://github.com/Sora-My-One-And-Only';

export default function App() {
  const [language, setLanguage] = useState<PortfolioLanguage>('ja');
  const [dark, setDark] = useState(false);
  const [sound, setSound] = useState(() => soundFX.getSnapshot());
  const content = portfolioCopy[language];

  useEffect(() => soundFX.subscribe(setSound), []);

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    document.title = content.pageTitle;
  }, [language, content.pageTitle]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <>
      <a className="skip-link" href="#content">{content.skip}</a>
      <header className="portfolio-header">
        <div className="header-inner">
          <a href="#top" className="wordmark">Sora</a>
          <nav className="chapter-nav" aria-label={content.navigation}>
            <a href="#works">{content.works}</a>
            <a href="#tools">{content.tools}</a>
            <a href="#about">{content.about}</a>
          </nav>
          <div className="header-settings">
            <select aria-label={content.language} value={language} onChange={(event) => setLanguage(event.target.value as PortfolioLanguage)}>
              {languages.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
            </select>
            <button type="button" aria-label="BGM" aria-pressed={sound.bgmEnabled} onClick={() => soundFX.setBgmEnabled(!sound.bgmEnabled)}>BGM</button>
            <button type="button" aria-label={content.soundEffects} aria-pressed={sound.sfxEnabled} onClick={() => soundFX.setSfxEnabled(!sound.sfxEnabled)}>SE</button>
            <button type="button" aria-label={dark ? content.lightMode : content.darkMode} onClick={() => setDark(!dark)}>
              {dark ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <main id="content" className="portfolio-main" tabIndex={-1}>
        <section className="portfolio-cover" aria-labelledby="cover-title">
          <div className="cover-copy">
            <p className="cover-role">{content.role}</p>
            <h1 id="cover-title">Sora</h1>
            <p className="cover-focus">{content.focus}</p>
            <p className="cover-intro">{content.intro}</p>
            <div className="cover-actions">
              <a className="folio-button folio-button-primary" href="#works" onClick={() => soundFX.playPageTurn()}>
                {content.seeWork}<ArrowDown aria-hidden="true" size={17} />
              </a>
              <a className="folio-button" href={levelBuilderUrl}>
                {content.tryTool}<ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </div>
          </div>
          <div className="cover-art" aria-hidden="true">
            <div className="book">
              <div className="book-frame">
                <span className="book-ring" />
                <span className="book-diamond" />
                <span className="book-mark">S</span>
                <span className="book-caption">GAME DESIGN PORTFOLIO</span>
              </div>
            </div>
          </div>
        </section>

        <section className="folio-section featured-work" id="works" aria-labelledby="work-title">
          <p className="section-label">{content.featured}</p>
          <div className="work-intro">
            <div>
              <p className="work-series">ARCANE CHRONICLE</p>
              <h2 id="work-title">{content.workTitle}</h2>
              <p className="work-type">{content.workType}</p>
            </div>
            <div className="work-summary">
              <p>{content.workSummary}</p>
              <dl className="work-role">
                <dt>{content.contributionLabel}</dt>
                <dd>{content.contribution}</dd>
              </dl>
              <a className="text-link" href="#battle-design">
                {content.cases}<ArrowDown aria-hidden="true" size={15} />
              </a>
            </div>
          </div>
          <PortfolioCases language={language} />
        </section>

        <section className="folio-section" id="tools" aria-labelledby="tools-title">
          <h2 id="tools-title">{content.tools}</h2>
          <div className="tool-list">
            <article>
              <h3>Level Builder</h3>
              <p>{content.levelDescription}</p>
              <a className="text-link" href={levelBuilderUrl}>{content.tryTool}<ArrowUpRight aria-hidden="true" size={16} /></a>
            </article>
            <article>
              <h3>GSParticleStudio</h3>
              <p>{content.particleDescription}</p>
            </article>
          </div>
        </section>

        <section className="folio-section about-section" id="about" aria-labelledby="about-title">
          <h2 id="about-title">{content.about}</h2>
          <p>{content.aboutDescription}</p>
          <a className="text-link" href={githubUrl}><Github size={16} aria-hidden="true" />GitHub<ArrowRight size={14} aria-hidden="true" /></a>
        </section>
      </main>

      <footer className="portfolio-footer">
        <span>Sora</span>
        <a className="text-link" href="#top">{content.backToTop}<ArrowUp aria-hidden="true" size={15} /></a>
      </footer>
    </>
  );
}
