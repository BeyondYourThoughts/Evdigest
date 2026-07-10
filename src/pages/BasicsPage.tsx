import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Battery, Plug, IndianRupee, Landmark, BookOpen, Search, X,
  ArrowRight, Check, XCircle, Sparkles, Compass, GraduationCap,
} from 'lucide-react';
import { getGlossaryTerms, getArticlesBySection } from '../lib/queries';
import type { GlossaryTerm, Article } from '../lib/types';
import {
  Eyebrow, SectionHeading, Button,
} from '../components/ui/Primitives';
import { ArticleCardMedium } from '../components/Cards';

const TOPICS = [
  {
    icon: Zap,
    title: 'How EVs Work',
    desc: 'Motors, controllers, and the basics of electric drivetrains.',
    href: '/basics',
  },
  {
    icon: Battery,
    title: 'Battery',
    desc: 'Lithium-ion chemistry, capacity, degradation, and longevity.',
    href: '/basics',
  },
  {
    icon: Plug,
    title: 'Charging',
    desc: 'AC vs DC, connector types, charging speeds, and networks.',
    href: '/basics',
  },
  {
    icon: IndianRupee,
    title: 'Buying',
    desc: 'Costs, subsidies, financing, and the total cost of ownership.',
    href: '/consumers/buyers-guide',
  },
  {
    icon: Landmark,
    title: 'Govt Policy',
    desc: 'FAME-II, state subsidies, PLI schemes, and regulations.',
    href: '/industry',
  },
  {
    icon: BookOpen,
    title: 'Glossary',
    desc: 'Every EV term defined — from A to Z.',
    href: '#glossary',
  },
];

const BEGINNER_PATH = [
  {
    step: '01',
    title: 'Understand the basics',
    desc: 'Start here if EVs are brand new to you. Learn how an electric vehicle differs from a petrol or diesel car, and what makes it move.',
  },
  {
    step: '02',
    title: 'Range & charging',
    desc: 'Demystify range figures, battery capacity, and charging speeds. Figure out how an EV fits your daily driving and where you would charge it.',
  },
  {
    step: '03',
    title: 'Costs & subsidies',
    desc: 'Compare the real cost of owning an EV — purchase price, running costs, and the government subsidies that bring the price down.',
  },
];

const MYTHS_VS_FACTS = [
  {
    myth: 'EVs catch fire more often than petrol cars.',
    fact: 'Statistically, EV battery fires are far rarer than fuel fires in ICE vehicles. Battery management systems and rigorous testing keep failure rates extremely low.',
  },
  {
    myth: 'EVs are too expensive for the average Indian.',
    fact: 'With FAME-II and state subsidies, many EVs reach price parity with petrol equivalents — and save Rs 60,000+ a year in running costs.',
  },
  {
    myth: 'EV range drops to nothing in Indian summers.',
    fact: 'Modern thermal management systems keep batteries in their sweet spot. Real-world range loss in extreme heat is typically 10–15%, not a collapse.',
  },
  {
    myth: 'There are almost no chargers in India.',
    fact: "India's public charging network is growing fast — over 16,000 public chargers and counting, concentrated along highways and in metros.",
  },
];

export function BasicsPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState<string>('All');

  useEffect(() => {
    Promise.all([getGlossaryTerms(), getArticlesBySection('basics')])
      .then(([t, a]) => {
        setTerms(t);
        setArticles(a);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    window.scrollTo(0, 0);
  }, []);

  const filteredTerms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return terms.filter((t) => {
      if (activeLetter !== 'All' && !t.term.toLowerCase().startsWith(activeLetter.toLowerCase())) {
        return false;
      }
      if (q && !t.term.toLowerCase().includes(q) && !t.definition.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [terms, search, activeLetter]);

  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((t) => {
      const letter = t.term.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(t);
    });
    return Object.keys(groups)
      .sort()
      .map((letter) => ({ letter, items: groups[letter] }));
  }, [filteredTerms]);

  const availableLetters = useMemo(() => {
    const set = new Set(terms.map((t) => t.term.charAt(0).toUpperCase()));
    return ['All', ...Array.from(set).sort()];
  }, [terms]);

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[320px] bg-canvas-soft" />
          <div className="grid grid-cols-3 gap-xl">
            <div className="h-[200px] bg-canvas-soft" />
            <div className="h-[200px] bg-canvas-soft" />
            <div className="h-[200px] bg-canvas-soft" />
          </div>
          <div className="h-[400px] bg-canvas-soft" />
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* Page hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <Eyebrow className="text-canvas-soft mb-md block">Learning Center</Eyebrow>
          <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
            EV Basics
          </h1>
          <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[680px]">
            New to electric vehicles? Start here. Plain-English explainers on how
            EVs work, batteries, charging, buying, and government policy — plus a
            full glossary and common myths, busted.
          </p>
          <div className="flex flex-wrap items-center gap-xl mt-2xl">
            <div className="flex items-center gap-sm">
              <Sparkles className="w-[18px] h-[18px] text-canvas-soft" />
              <Eyebrow className="text-canvas-soft">Beginner Friendly</Eyebrow>
            </div>
            <div className="w-px h-[20px] bg-ink-soft" />
            <div className="flex items-center gap-sm">
              <BookOpen className="w-[18px] h-[18px] text-canvas-soft" />
              <Eyebrow className="text-canvas-soft">{terms.length} Glossary Terms</Eyebrow>
            </div>
            <div className="w-px h-[20px] bg-ink-soft" />
            <div className="flex items-center gap-sm">
              <Compass className="w-[18px] h-[18px] text-canvas-soft" />
              <Eyebrow className="text-canvas-soft">3-Step Path</Eyebrow>
            </div>
          </div>
        </div>
      </section>

      {/* Topic cards */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <SectionHeading eyebrow="Explore" title="Start With a Topic" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-xl">
          {TOPICS.map((topic) => (
            <Link
              key={topic.title}
              to={topic.href}
              className="group flex items-start gap-lg border border-hairline hover:border-ink transition-colors p-xl bg-canvas"
            >
              <div className="w-[48px] h-[48px] bg-ink text-on-primary flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                <topic.icon className="w-[24px] h-[24px]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-display-xs leading-[1.2] tracking-[-0.2px] mb-xs group-hover:text-body transition-colors">
                  {topic.title}
                </h3>
                <p className="font-serif-body text-body-serif-md text-body leading-snug">
                  {topic.desc}
                </p>
              </div>
              <ArrowRight className="w-[16px] h-[16px] text-hairline group-hover:text-ink transition-colors flex-shrink-0 mt-xs" />
            </Link>
          ))}
        </div>
      </section>

      {/* Beginner path */}
      <section className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <SectionHeading eyebrow="For First-Time Readers" title="Your Beginner Path" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {BEGINNER_PATH.map((p) => (
              <div
                key={p.step}
                className="bg-canvas border border-hairline p-3xl relative"
              >
                <span className="font-display text-display-lg leading-none text-hairline absolute top-lg right-xl select-none">
                  {p.step}
                </span>
                <div className="w-[40px] h-[40px] bg-ink text-on-primary flex items-center justify-center mb-xl">
                  <GraduationCap className="w-[20px] h-[20px]" />
                </div>
                <h3 className="font-display text-display-sm leading-[1.15] tracking-[-0.28px] mb-sm">
                  {p.title}
                </h3>
                <p className="font-serif-body text-body-serif-md text-body leading-snug">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Article grid */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading
            eyebrow="Explainers"
            title="Basics Articles"
            link="/basics"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
            {articles.slice(0, 6).map((a) => (
              <ArticleCardMedium key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* EV Glossary */}
      <section id="glossary" className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <SectionHeading eyebrow="Reference" title="EV Glossary" />

          {/* Search + A-Z */}
          <div className="flex flex-col gap-lg mb-xl">
            <div className="flex items-center gap-md bg-canvas border border-hairline focus-within:border-ink transition-colors px-lg py-md max-w-[520px]">
              <Search className="w-[18px] h-[18px] text-body flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search terms or definitions…"
                className="flex-1 bg-transparent text-ink font-serif-body text-body-serif-md placeholder:text-body focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-body hover:text-ink transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-[16px] h-[16px]" />
                </button>
              )}
            </div>

            {/* A-Z letters */}
            <div className="flex flex-wrap gap-xxs">
              {availableLetters.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setActiveLetter(letter)}
                  className={`font-sans-label text-caption uppercase tracking-[0.4px] px-sm py-xs border transition-colors ${
                    activeLetter === letter
                      ? 'border-ink bg-ink text-on-primary'
                      : 'border-hairline text-body hover:border-ink hover:text-ink'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Definition list */}
          {groupedTerms.length > 0 ? (
            <div className="space-y-3xl">
              {groupedTerms.map((group) => (
                <div key={group.letter}>
                  <div className="flex items-baseline gap-lg border-b border-ink pb-sm mb-lg">
                    <span className="font-display text-display-md leading-none tracking-[-0.3px]">
                      {group.letter}
                    </span>
                    <span className="font-sans-label text-caption uppercase tracking-[0.4px] text-body">
                      {group.items.length} {group.items.length === 1 ? 'term' : 'terms'}
                    </span>
                  </div>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-3xl gap-y-lg">
                    {group.items.map((t) => (
                      <div key={t.id} className="border-b border-hairline pb-lg">
                        <dt className="font-sans-label text-body-md-strong text-ink mb-xs">
                          {t.term}
                          {t.category && (
                            <span className="font-sans-label text-caption uppercase tracking-[0.4px] text-body ml-md">
                              {t.category}
                            </span>
                          )}
                        </dt>
                        <dd className="font-serif-body text-body-serif-md text-body leading-snug">
                          {t.definition}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-hairline bg-canvas py-5xl text-center">
              <BookOpen className="w-[40px] h-[40px] text-hairline mx-auto mb-lg" />
              <h3 className="font-display text-display-sm mb-sm">No terms found</h3>
              <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[400px] mx-auto">
                No glossary terms match your search. Try a different keyword or
                letter.
              </p>
              <Button
                onClick={() => {
                  setSearch('');
                  setActiveLetter('All');
                }}
                variant="outline"
                size="sm"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Myths vs Facts */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <SectionHeading eyebrow="Misconceptions" title="Myths vs. Facts" />
        <p className="font-serif-body text-body-serif-lg text-body leading-relaxed max-w-[680px] mb-3xl -mt-lg">
          Electric vehicles attract a lot of misinformation. Here are the most
          common myths — and the facts that set them straight.
        </p>
        <div className="space-y-lg">
          {MYTHS_VS_FACTS.map((mf, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-hairline"
            >
              {/* Myth */}
              <div className="p-xl bg-canvas-soft border-b md:border-b-0 md:border-r border-hairline">
                <div className="flex items-center gap-sm mb-md">
                  <span className="w-[28px] h-[28px] bg-accent text-on-primary flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-[16px] h-[16px]" />
                  </span>
                  <Eyebrow className="text-accent">Myth</Eyebrow>
                </div>
                <p className="font-display text-[20px] leading-[1.2] tracking-[-0.2px] text-ink">
                  "{mf.myth}"
                </p>
              </div>
              {/* Fact */}
              <div className="p-xl bg-canvas">
                <div className="flex items-center gap-sm mb-md">
                  <span className="w-[28px] h-[28px] bg-ink text-on-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-[16px] h-[16px]" />
                  </span>
                  <Eyebrow>Fact</Eyebrow>
                </div>
                <p className="font-serif-body text-body-serif-md text-ink leading-snug">
                  {mf.fact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-xl">
            <div>
              <Eyebrow className="text-canvas-soft mb-xs block">Ready to Buy?</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] text-on-primary">
                Put your knowledge to work
              </h2>
              <p className="font-serif-body text-body-serif-md text-canvas-soft mt-sm max-w-[520px]">
                Browse every EV on sale in India, compare specs, and read real
                reviews in our Buyers Guide.
              </p>
            </div>
            <Button to="/consumers/buyers-guide" variant="secondary" className="whitespace-nowrap">
              Open Buyers Guide <ArrowRight className="w-[16px] h-[16px] ml-sm" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
