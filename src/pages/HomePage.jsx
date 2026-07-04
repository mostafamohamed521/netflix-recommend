import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import TitleCard from '../components/TitleCard';
import HeroSearch from '../components/HeroSearch';
import { useAuth } from '../context/AuthContext';
import * as homeApi from '../api/home';
import './HomePage.css';
import './BrowsePages.css';

const STAGE_COPY = {
  stranger: { eyebrow: 'Welcome', title: "See what's popular right now" },
  explorer: { eyebrow: 'Just getting started', title: 'Add a few favorites to sharpen your picks' },
  regular: { eyebrow: 'Your taste, mapped', title: 'Picked for you' },
  loyal: { eyebrow: 'We know you well by now', title: 'New for you' },
};

export default function HomePage() {
  const { user } = useAuth();
  const location = useLocation();

  const introRequested = Boolean(location.state?.justAuthenticated);
  const [introStage, setIntroStage] = useState(introRequested ? 'welcome' : 'done');

  useEffect(() => {
    if (!introRequested) return;
    const t1 = setTimeout(() => setIntroStage('morph'), 1400);
    const t2 = setTimeout(() => setIntroStage('done'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [introRequested]);

  const [stage, setStage] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    homeApi.getHome(user?.email).then(res => {
      if (cancelled) return;
      setStage(res.data.stage);
      setSections(res.data.sections);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user?.email]);

  const copy = STAGE_COPY[stage] || STAGE_COPY.stranger;
  const heroBaseDelay = introRequested ? 2300 : 100;
  const contentClass =
    introStage === 'welcome' ? 'hp__content--hidden' :
    introStage === 'morph' ? 'hp__content--revealing' : '';

  return (
    <div className="hp">
      {introRequested && introStage !== 'done' && (
        <div className={`intro-welcome ${introStage === 'morph' ? 'intro-welcome--morph' : ''}`}>
          {introStage === 'welcome' && <div className="intro-welcome__flash" />}
          <p className="intro-welcome__kicker">Welcome back</p>
          <h1 className="intro-welcome__name">
            {(user?.email || '').split('@')[0].split('').map((ch, i) => (
              <span key={i} style={{ animationDelay: `${0.4 + i * 0.045}s` }}>{ch}</span>
            ))}
          </h1>
          <span className="intro-welcome__ring" />
        </div>
      )}

      <div className={`hp__content ${contentClass}`}>
        <Header />

        <section className="hero-search">
          <div className="hero-search__intro" style={{ animationDelay: `${heroBaseDelay}ms` }}>
            <p className="hero-search__eyebrow" style={{ animationDelay: `${heroBaseDelay + 100}ms` }}>
              AI-powered content matching
            </p>
            <h1 className="hero-search__title" style={{ animationDelay: `${heroBaseDelay + 220}ms` }}>
              Find Your Next Obsession
              <span className="hero-search__underline" style={{ animationDelay: `${heroBaseDelay + 600}ms` }} />
            </h1>
            <p className="hero-search__quote" style={{ animationDelay: `${heroBaseDelay + 780}ms` }}>
              "Type a title you love — we'll find the 10 closest matches by genre, country, and rating."
            </p>
          </div>
          <HeroSearch style={{ animationDelay: `${heroBaseDelay + 1150}ms` }} />
        </section>

        <main className="bp__main">
          <p className="hp__stage-label">{copy.eyebrow} — {copy.title}</p>

          {loading && (
            <>
              {[0, 1, 2].map(i => (
                <section className="row" key={i}>
                  <div className="sk-title" />
                  <div className="sk-row__track">
                    {Array.from({ length: 6 }).map((_, j) => <div className="sk-card" key={j} />)}
                  </div>
                </section>
              ))}
            </>
          )}

          {!loading && sections.map((section, sIdx) => (
            <section key={section.key} className="row">
              <h2 className="row__title">{section.title}</h2>
              <div className="row__track">
                {section.items.map((item, i) => (
                  <div className="row__item" key={item.title} style={{ animationDelay: `${sIdx * 80 + i * 45}ms` }}>
                    <TitleCard title={item} reason={item.reason} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
