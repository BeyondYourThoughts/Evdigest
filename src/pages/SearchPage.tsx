import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, ArrowRight, Compass, BookOpen, Building2, Zap, Loader2,
} from 'lucide-react';
import { searchArticles, getLatestArticles } from '../lib/queries';
import type { Article } from '../lib/types';
import {
  Eyebrow, Button, formatNumber,
} from '../components/ui/Primitives';
import { ArticleCardMedium } from '../components/Cards';

const POPULAR_LINKS = [
  { icon: BookOpen, label: 'Buyers Guide', desc: 'Compare every EV sold in India', slug: '/consumers/buyers-guide' },
  { icon: Search, label: 'Reviews', desc: 'Independent expert road tests', slug: '/consumers/reviews' },
  { icon: Building2, label: 'Brands', desc: 'Every manufacturer, one page', slug: '/brands' },
  { icon: Zap, label: 'EV Basics', desc: 'Start from scratch — no jargon', slug: '/basics' },
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [input, setInput] = useState(query);
  const [results, setResults] = useState<Article[]>([]);
  const [latest, setLatest] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Keep the input box in sync when the URL query changes externally
  useEffect(() => {
    setInput(query);
  }, [query]);

  // Fetch results whenever the URL `q` changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    searchArticles(query.trim())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [query]);

  // Load "latest" articles once for the empty-query state
  useEffect(() => {
    if (query.trim()) return;
    getLatestArticles(6)
      .then((data) => setLatest(data))
      .catch(() => setLatest([]));
  }, [query]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = input.trim();
    if (!next) return;
    setSearchParams({ q: next });
  };

  return (
    <div className="fade-in-up">
      {/* Hero / search bar */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="max-w-[720px] mx-auto">
            <Eyebrow className="text-canvas-soft mb-md block">Search</Eyebrow>
            <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary text-center">
              {query ? `Results for "${query}"` : 'Search EVDigest'}
            </h1>
            <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed mb-2xl text-center">
              Find reviews, news, analysis, and guides from across the magazine.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-md"
              role="search"
            >
              <div className="flex-1 relative">
                <Search className="w-[20px] h-[20px] text-canvas-soft absolute left-lg top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Search articles, reviews, brands..."
                  className="w-full bg-transparent border border-on-primary text-on-primary font-serif-body text-body-serif-md pl-3xl pr-lg py-lg placeholder:text-canvas-soft focus:outline-none focus:border-canvas-soft"
                  aria-label="Search EVDigest"
                />
              </div>
              <button
                type="submit"
                className="font-sans-label text-button uppercase tracking-[0.3px] bg-on-primary text-ink px-2xl py-lg hover:bg-canvas-soft transition-colors whitespace-nowrap inline-flex items-center justify-center gap-sm"
              >
                <Search className="w-[16px] h-[16px]" />
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Results / states */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        {/* Empty query */}
        {!query.trim() && (
          <div className="text-center max-w-[520px] mx-auto">
            <Compass className="w-[40px] h-[40px] text-hairline mx-auto mb-lg" />
            <h2 className="font-display text-display-sm mb-sm">Start your search</h2>
            <p className="font-serif-body text-body-serif-md text-body mb-3xl leading-relaxed">
              Type a vehicle name, a brand, a topic, or a question above. Try
              "Tata Nexon", "charging", or "subsidy".
            </p>
            {/* Popular links */}
            <div className="text-left">
              <div className="border-b border-ink pb-md mb-xl">
                <Eyebrow>Popular Links</Eyebrow>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                {POPULAR_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.slug}
                    className="group flex items-start gap-lg p-xl border border-hairline hover:border-ink transition-colors bg-canvas"
                  >
                    <link.icon className="w-[24px] h-[24px] text-ink flex-shrink-0 mt-xxs group-hover:text-accent transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans-label text-body-sm-strong uppercase tracking-[0.3px] text-ink mb-xxs">
                        {link.label}
                      </p>
                      <p className="font-serif-body text-body-serif-md text-body leading-snug">
                        {link.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-[16px] h-[16px] text-hairline group-hover:text-ink flex-shrink-0 mt-sm transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Latest articles when no query */}
            {latest.length > 0 && (
              <div className="text-left mt-3xl">
                <div className="border-b border-ink pb-md mb-xl">
                  <Eyebrow>Latest Stories</Eyebrow>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
                  {latest.map((a) => (
                    <ArticleCardMedium key={a.id} article={a} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {query.trim() && loading && (
          <div className="text-center py-3xl">
            <Loader2 className="w-[32px] h-[32px] text-ink mx-auto mb-lg animate-spin" />
            <p className="font-serif-body text-body-serif-lg text-body">
              Searching the archive...
            </p>
          </div>
        )}

        {/* Error */}
        {query.trim() && error && !loading && (
          <div className="text-center max-w-[480px] mx-auto">
            <p className="font-display text-display-sm mb-sm">Search hit a snag</p>
            <p className="font-serif-body text-body-serif-md text-body mb-xl leading-relaxed">
              We couldn't complete your search. Please try again in a moment.
            </p>
            <Button onClick={() => setSearchParams({ q: query.trim() })} variant="outline" size="md">
              Try Again
            </Button>
          </div>
        )}

        {/* Results */}
        {query.trim() && !loading && !error && (
          <div>
            {/* Result count */}
            <div className="flex items-end justify-between border-b border-ink pb-md mb-xl">
              <div>
                <Eyebrow className="text-accent mb-xs block">
                  {results.length > 0 ? `${formatNumber(results.length)} ${results.length === 1 ? 'result' : 'results'}` : 'No results'}
                </Eyebrow>
                <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px]">
                  {results.length > 0 ? 'Matching stories' : 'Nothing matched'}
                </h2>
              </div>
              <Eyebrow className="text-hairline whitespace-nowrap">for "{query}"</Eyebrow>
            </div>

            {/* No results */}
            {results.length === 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3xl">
                <div className="border border-hairline py-5xl text-center">
                  <Search className="w-[40px] h-[40px] text-hairline mx-auto mb-lg" />
                  <h3 className="font-display text-display-sm mb-sm">No matching stories</h3>
                  <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[420px] mx-auto leading-relaxed">
                    We couldn't find anything for "{query}". Check your spelling,
                    try a broader term, or browse the popular links below.
                  </p>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-md max-w-[440px] mx-auto"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Try another search"
                      className="flex-1 bg-canvas border border-hairline px-lg py-md font-serif-body text-body-serif-md text-ink focus:border-ink transition-colors placeholder:text-hairline"
                    />
                    <Button type="submit" size="md">
                      <Search className="w-[14px] h-[14px] mr-sm" />
                      Search
                    </Button>
                  </form>
                </div>

                {/* Popular links sidebar */}
                <div className="space-y-lg">
                  <div className="border-b border-ink pb-md">
                    <Eyebrow>Popular Links</Eyebrow>
                  </div>
                  {POPULAR_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      to={link.slug}
                      className="group flex items-start gap-lg p-lg border border-hairline hover:border-ink transition-colors"
                    >
                      <link.icon className="w-[22px] h-[22px] text-ink flex-shrink-0 mt-xxs group-hover:text-accent transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans-label text-body-sm-strong uppercase tracking-[0.3px] text-ink mb-xxs">
                          {link.label}
                        </p>
                        <p className="font-serif-body text-body-serif-md text-body leading-snug">
                          {link.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              /* Results grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
                {results.map((a) => (
                  <ArticleCardMedium key={a.id} article={a} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
