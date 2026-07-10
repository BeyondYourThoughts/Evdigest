import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, ArrowRight, Mail, Clock, User, Star, Quote,
} from 'lucide-react';
import { getArticlesBySection, getLatestArticles } from '../lib/queries';
import type { Article } from '../lib/types';
import {
  Eyebrow, SectionHeading, Tag, formatDate,
} from '../components/ui/Primitives';
import { ArticleCardMedium } from '../components/Cards';

export function MagazinePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    Promise.all([
      getArticlesBySection('magazine'),
      getLatestArticles(10),
    ])
      .then(([m, l]) => {
        // Prefer magazine-section articles; fall back to latest if none.
        setArticles(m.length > 0 ? m : l);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
    window.scrollTo(0, 0);
  }, []);

  const featuredStory = useMemo(
    () => articles.find((a) => a.is_featured) || articles[0] || null,
    [articles]
  );

  const issueContents = useMemo(
    () => articles.filter((a) => a.id !== featuredStory?.id),
    [articles, featuredStory]
  );

  const longReads = useMemo(
    () => issueContents.filter((a) => a.read_time_min >= 8).slice(0, 3),
    [issueContents]
  );

  const editorsPicks = useMemo(
    () => issueContents.slice(0, 3),
    [issueContents]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[420px] bg-canvas-soft" />
          <div className="h-[300px] bg-canvas-soft" />
          <div className="grid grid-cols-3 gap-xl">
            <div className="h-[280px] bg-canvas-soft" />
            <div className="h-[280px] bg-canvas-soft" />
            <div className="h-[280px] bg-canvas-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <p className="font-serif-body text-body-serif-lg text-body">
          Could not load the magazine. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* Page hero — Current Issue */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3xl items-start">
            <div>
              <Eyebrow className="text-canvas-soft mb-md block">The Magazine</Eyebrow>
              <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
                Current Issue
              </h1>

              {/* Issue meta row */}
              <div className="flex flex-wrap items-center gap-xl mb-3xl">
                <div className="flex items-center gap-sm">
                  <BookOpen className="w-[18px] h-[18px] text-canvas-soft" />
                  <span className="font-sans-label text-body-md-strong text-on-primary">
                    July 2026
                  </span>
                </div>
                <div className="w-px h-[20px] bg-ink-soft" />
                <span className="font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-canvas-soft">
                  Issue #07
                </span>
                <div className="w-px h-[20px] bg-ink-soft" />
                <span className="font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-canvas-soft">
                  {articles.length} {articles.length === 1 ? 'Story' : 'Stories'}
                </span>
              </div>

              {/* Cover headline */}
              <div className="border-l-2 border-canvas-soft pl-xl max-w-[680px]">
                <p className="font-serif-body text-body-serif-lg text-canvas-soft mb-md">
                  This month:
                </p>
                <h2 className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] text-on-primary mb-lg">
                  The Highway Revolution
                </h2>
                <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed">
                  India's charging corridors go national, the year's biggest EV
                  launches dissected, and an exclusive sit-down with the founder
                  reshaping two-wheeler mobility.
                </p>
              </div>
            </div>

            {/* Editor's note */}
            <div className="lg:w-[320px] border border-ink-soft p-3xl bg-ink-soft/30">
              <div className="flex items-center gap-sm mb-md">
                <Quote className="w-[18px] h-[18px] text-canvas-soft" />
                <Eyebrow className="text-canvas-soft">Editor's Note</Eyebrow>
              </div>
              <p className="font-serif-body text-body-serif-md text-canvas-soft leading-relaxed mb-lg italic">
                "This issue is about reach — how far an EV can take you, how far
                the charging network has come, and how far India's manufacturers
                are willing to push. We drove the corridors and asked the
                questions so you don't have to."
              </p>
              <div className="flex items-center gap-sm pt-lg border-t border-ink-soft">
                <div className="w-[36px] h-[36px] rounded-full bg-on-primary text-ink flex items-center justify-center font-display text-[16px]">
                  A
                </div>
                <div>
                  <p className="font-sans-label text-body-sm-strong text-on-primary">
                    Anika Rao
                  </p>
                  <p className="font-sans-label text-caption text-canvas-soft">
                    Editor-in-Chief
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured story */}
      {featuredStory && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading eyebrow="Lead Story" title="Featured This Issue" />
          <Link
            to={`/article/${featuredStory.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-0 border border-hairline hover:border-ink transition-colors bg-canvas"
          >
            <div className="aspect-[16/10] lg:aspect-auto overflow-hidden bg-canvas-soft">
              {featuredStory.image_url ? (
                <img
                  src={featuredStory.image_url}
                  alt={featuredStory.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-ink">
                  <span className="font-display text-display-md text-canvas-soft">
                    EVDigest
                  </span>
                </div>
              )}
            </div>
            <div className="p-3xl flex flex-col">
              <div className="flex items-center gap-md mb-md">
                <Tag>{featuredStory.category}</Tag>
                <span className="inline-flex items-center gap-xxs font-sans-label text-caption uppercase tracking-[0.3px] text-accent">
                  <Star className="w-[12px] h-[12px] fill-accent" /> Cover Story
                </span>
              </div>
              <h3 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-md group-hover:text-body transition-colors">
                {featuredStory.title}
              </h3>
              <p className="font-serif-body text-body-serif-lg text-body leading-relaxed mb-xl line-clamp-4">
                {featuredStory.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-lg mt-auto pt-lg border-t border-hairline">
                {featuredStory.author && (
                  <span className="inline-flex items-center gap-xs font-sans-label text-caption text-body">
                    <User className="w-[12px] h-[12px]" />
                    {featuredStory.author}
                  </span>
                )}
                <span className="inline-flex items-center gap-xs font-sans-label text-caption text-body">
                  <Clock className="w-[12px] h-[12px]" />
                  {featuredStory.read_time_min} min read
                </span>
                <span className="font-sans-label text-caption text-body">
                  {formatDate(featuredStory.published_at)}
                </span>
              </div>
              <span className="hidden lg:inline-flex items-center gap-sm font-sans-label text-body-sm-strong uppercase tracking-[0.3px] text-ink group-hover:text-body transition-colors mt-xl">
                Read the story <ArrowRight className="w-[16px] h-[16px]" />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Issue contents */}
      {issueContents.length > 0 && (
        <section className="bg-canvas-soft border-y border-hairline py-4xl">
          <div className="mx-auto max-w-editorial px-xl">
            <SectionHeading eyebrow="In This Issue" title="Issue Contents" />
            <div className="bg-canvas border border-hairline">
              {issueContents.map((a, i) => (
                <Link
                  key={a.id}
                  to={`/article/${a.slug}`}
                  className="group grid grid-cols-[40px_1fr_auto] gap-lg items-center p-lg border-b border-hairline last:border-b-0 hover:bg-canvas-soft transition-colors"
                >
                  <span className="font-display text-display-xs leading-none text-hairline group-hover:text-ink transition-colors text-center">
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-md mb-xs">
                      <Tag>{a.category}</Tag>
                      {a.is_featured && (
                        <span className="font-sans-label text-caption uppercase tracking-[0.3px] text-accent">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-[20px] leading-[1.2] tracking-[-0.2px] group-hover:text-body transition-colors line-clamp-1">
                      {a.title}
                    </h3>
                    {a.excerpt && (
                      <p className="font-serif-body text-body-serif-md text-body line-clamp-1 mt-xs">
                        {a.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="hidden md:flex flex-col items-end gap-xs whitespace-nowrap">
                    <span className="font-sans-label text-caption text-body">
                      {a.read_time_min} min
                    </span>
                    <ArrowRight className="w-[16px] h-[16px] text-hairline group-hover:text-ink transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Long reads */}
      {longReads.length > 0 && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading eyebrow="In-Depth" title="Long Reads" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {longReads.map((a) => (
              <ArticleCardMedium key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* Editor's picks */}
      {editorsPicks.length > 0 && (
        <section className="bg-canvas-soft border-y border-hairline py-4xl">
          <div className="mx-auto max-w-editorial px-xl">
            <SectionHeading eyebrow="Curated" title="Editor's Picks" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
              {editorsPicks.map((a) => (
                <Link
                  key={a.id}
                  to={`/article/${a.slug}`}
                  className="group bg-canvas border border-hairline hover:border-ink transition-colors p-xl"
                >
                  <div className="flex items-center gap-sm mb-md">
                    <Star className="w-[14px] h-[14px] text-accent" />
                    <Tag>{a.category}</Tag>
                  </div>
                  <h3 className="font-display text-[20px] leading-[1.2] tracking-[-0.2px] mb-sm group-hover:text-body transition-colors">
                    {a.title}
                  </h3>
                  <p className="font-serif-body text-body-serif-md text-body line-clamp-3 mb-md">
                    {a.excerpt}
                  </p>
                  <div className="flex items-center gap-md">
                    {a.author && <Eyebrow>{a.author}</Eyebrow>}
                    <Eyebrow className="text-hairline">{a.read_time_min} min</Eyebrow>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subscribe banner */}
      <section className="bg-ink text-on-primary py-5xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3xl items-center">
            <div>
              <Eyebrow className="text-canvas-soft mb-md block">Subscribe</Eyebrow>
              <h2 className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] mb-lg text-on-primary">
                The EVDigest Monthly — delivered.
              </h2>
              <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed mb-xl">
                Get every issue in your inbox, plus the editor's three
                must-reads each week. Long-form journalism on India's electric
                transition — free, always.
              </p>
              <div className="flex flex-wrap items-center gap-xl">
                <div className="flex items-center gap-sm">
                  <Mail className="w-[16px] h-[16px] text-canvas-soft" />
                  <Eyebrow className="text-canvas-soft">Monthly · Free</Eyebrow>
                </div>
                <div className="w-px h-[20px] bg-ink-soft" />
                <div className="flex items-center gap-sm">
                  <BookOpen className="w-[16px] h-[16px] text-canvas-soft" />
                  <Eyebrow className="text-canvas-soft">Issue #07 out now</Eyebrow>
                </div>
              </div>
            </div>

            <div>
              {subscribed ? (
                <div className="border border-on-primary p-3xl text-center">
                  <h3 className="font-display text-display-sm mb-sm text-on-primary">
                    You're subscribed.
                  </h3>
                  <p className="font-serif-body text-body-serif-md text-canvas-soft">
                    The next issue of EVDigest Monthly lands in your inbox soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubscribed(true);
                  }}
                  className="flex flex-col gap-md"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-transparent border border-on-primary text-on-primary font-serif-body text-body-serif-md px-xl py-lg placeholder:text-canvas-soft focus:outline-none focus:border-canvas-soft"
                  />
                  <button
                    type="submit"
                    className="font-sans-label text-button uppercase tracking-[0.3px] bg-on-primary text-ink px-2xl py-lg hover:bg-canvas-soft transition-colors whitespace-nowrap flex items-center justify-center gap-sm"
                  >
                    Subscribe
                    <ArrowRight className="w-[16px] h-[16px]" />
                  </button>
                  <p className="font-sans-label text-caption text-canvas-soft mt-xs">
                    No spam. Unsubscribe anytime. Privacy protected.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
