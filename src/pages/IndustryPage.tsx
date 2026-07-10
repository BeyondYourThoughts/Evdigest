import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, TrendingUp, TrendingDown, BarChart3, Mic,
  Lightbulb, Mail, ArrowRight, PieChart, MapPin, Crown,
} from 'lucide-react';
import { getArticlesBySection, getSalesData, getBrands } from '../lib/queries';
import type { Article, EVSalesData, Brand } from '../lib/types';
import {
  Eyebrow, SectionHeading, Tag, formatDate, formatNumber,
} from '../components/ui/Primitives';
import { ArticleCardMedium, ArticleCardSmall } from '../components/Cards';

export function IndustryPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sales, setSales] = useState<EVSalesData[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(false);

  useEffect(() => {
    Promise.all([
      getArticlesBySection('industry'),
      getSalesData(),
      getBrands(),
    ])
      .then(([a, s, b]) => {
        setArticles(a);
        setSales(s);
        setBrands(b);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
    window.scrollTo(0, 0);
  }, []);

  // --- Derived data ---
  const marketSnapshot = useMemo(() => {
    if (sales.length === 0) return null;
    const currentYear = Math.max(...sales.map((s) => s.year));
    const ytdData = sales.filter((s) => s.year === currentYear);
    const totalYTD = ytdData.reduce((sum, s) => sum + s.units_sold, 0);

    // Fastest growing segment: compare last year vs current year
    const prevYear = currentYear - 1;
    const segments = Array.from(new Set(sales.map((s) => s.segment)));
    let fastestSegment = '—';
    let fastestGrowth = -Infinity;

    segments.forEach((seg) => {
      const currentSeg = sales.filter((s) => s.year === currentYear && s.segment === seg);
      const prevSeg = sales.filter((s) => s.year === prevYear && s.segment === seg);
      const currentTotal = currentSeg.reduce((sum, s) => sum + s.units_sold, 0);
      const prevTotal = prevSeg.reduce((sum, s) => sum + s.units_sold, 0);
      if (prevTotal > 0) {
        const growth = ((currentTotal - prevTotal) / prevTotal) * 100;
        if (growth > fastestGrowth) {
          fastestGrowth = growth;
          fastestSegment = seg;
        }
      }
    });

    // Top segment by volume
    const segTotals = segments.map((seg) => ({
      seg,
      total: ytdData
        .filter((s) => s.segment === seg)
        .reduce((sum, s) => sum + s.units_sold, 0),
    }));
    const topSegment = segTotals.sort((a, b) => b.total - a.total)[0];

    return {
      totalYTD,
      currentYear,
      fastestSegment,
      fastestGrowth: fastestGrowth > -Infinity ? fastestGrowth : 0,
      topSegment: topSegment?.seg || '—',
    };
  }, [sales]);

  const oemTracker = useMemo(() => {
    const sorted = [...brands].sort((a, b) => b.vehicle_count - a.vehicle_count);
    const top = sorted.slice(0, 8);
    const maxCount = top.length > 0 ? top[0].vehicle_count : 1;
    return top.map((b) => ({
      ...b,
      sharePct: maxCount > 0 ? (b.vehicle_count / maxCount) * 100 : 0,
    }));
  }, [brands]);

  const interviews = useMemo(
    () => articles.filter((a) => a.category === 'interview').slice(0, 1),
    [articles]
  );

  const expertOpinions = useMemo(
    () => articles.filter((a) => a.category === 'opinion' || a.category === 'investment').slice(0, 3),
    [articles]
  );

  const latestReports = useMemo(
    () => articles.filter((a) => a.category !== 'interview' && a.category !== 'opinion' && a.category !== 'investment').slice(0, 6),
    [articles]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[300px] bg-canvas-soft" />
          <div className="grid grid-cols-3 gap-xl">
            <div className="h-[200px] bg-canvas-soft" />
            <div className="h-[200px] bg-canvas-soft" />
            <div className="h-[200px] bg-canvas-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <p className="font-serif-body text-body-serif-lg text-body">
          Could not load industry data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* Page hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <Eyebrow className="text-canvas-soft mb-md block">For Business</Eyebrow>
          <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
            Industry
          </h1>
          <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[680px]">
            For CEOs, analysts, and fleet operators tracking India's electric mobility
            transition. Market data, OEM intelligence, executive interviews, and expert
            analysis — updated weekly.
          </p>
          <div className="flex flex-wrap items-center gap-xl mt-2xl">
            <div className="flex items-center gap-sm">
              <BarChart3 className="w-[18px] h-[18px] text-canvas-soft" />
              <Eyebrow className="text-canvas-soft">Market Data</Eyebrow>
            </div>
            <div className="w-px h-[20px] bg-ink-soft" />
            <div className="flex items-center gap-sm">
              <Building2 className="w-[18px] h-[18px] text-canvas-soft" />
              <Eyebrow className="text-canvas-soft">OEM Tracker</Eyebrow>
            </div>
            <div className="w-px h-[20px] bg-ink-soft" />
            <div className="flex items-center gap-sm">
              <Mic className="w-[18px] h-[18px] text-canvas-soft" />
              <Eyebrow className="text-canvas-soft">CEO Interviews</Eyebrow>
            </div>
          </div>
        </div>
      </section>

      {/* Market snapshot */}
      {marketSnapshot && (
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-editorial px-xl py-3xl">
            <div className="flex items-center gap-sm mb-xl">
              <PieChart className="w-[20px] h-[20px] text-ink" />
              <h2 className="font-sans-label text-body-md-strong uppercase tracking-[0.3px] text-ink">
                Market Snapshot · {marketSnapshot.currentYear} YTD
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
              {/* Total EV sales YTD */}
              <div className="border-l-4 border-ink p-xl bg-canvas-soft">
                <Eyebrow className="block mb-sm">Total EV Sales YTD</Eyebrow>
                <p className="font-display text-display-md leading-[1.05] tracking-[-0.3px] mb-xs">
                  {formatNumber(marketSnapshot.totalYTD)}
                </p>
                <p className="font-serif-body text-body-serif-md text-body">
                  units sold across all segments in {marketSnapshot.currentYear}
                </p>
              </div>
              {/* Fastest growing segment */}
              <div className="border-l-4 border-accent p-xl bg-canvas-soft">
                <Eyebrow className="text-accent block mb-sm">Fastest-Growing Segment</Eyebrow>
                <p className="font-display text-display-md leading-[1.05] tracking-[-0.3px] mb-xs">
                  {marketSnapshot.fastestSegment}
                </p>
                <p className="font-serif-body text-body-serif-md text-body flex items-center gap-xs">
                  {marketSnapshot.fastestGrowth >= 0 ? (
                    <TrendingUp className="w-[16px] h-[16px] text-accent inline" />
                  ) : (
                    <TrendingDown className="w-[16px] h-[16px] text-body inline" />
                  )}
                  {marketSnapshot.fastestGrowth >= 0 ? '+' : ''}
                  {marketSnapshot.fastestGrowth.toFixed(1)}% YoY
                </p>
              </div>
              {/* Top segment by volume */}
              <div className="border-l-4 border-ink p-xl bg-canvas-soft">
                <Eyebrow className="block mb-sm">Top Segment by Volume</Eyebrow>
                <p className="font-display text-display-md leading-[1.05] tracking-[-0.3px] mb-xs">
                  {marketSnapshot.topSegment}
                </p>
                <p className="font-serif-body text-body-serif-md text-body">
                  leading unit sales in {marketSnapshot.currentYear}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest reports */}
      {latestReports.length > 0 && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading
            eyebrow="Reports & Analysis"
            title="Latest Industry Reports"
            link="/news"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
            {latestReports.map((a) => (
              <ArticleCardMedium key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* OEM tracker */}
      {oemTracker.length > 0 && (
        <section className="bg-canvas-soft border-y border-hairline py-4xl">
          <div className="mx-auto max-w-editorial px-xl">
            <SectionHeading
              eyebrow="OEM Intelligence"
              title="OEM Tracker"
              link="/brands"
            />
            <div className="bg-canvas border border-hairline">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_120px_1fr_80px] gap-md p-lg border-b border-ink items-center">
                <span className="font-sans-label text-caption uppercase tracking-[0.4px] text-body">
                  Brand
                </span>
                <span className="font-sans-label text-caption uppercase tracking-[0.4px] text-body">
                  Segment
                </span>
                <span className="font-sans-label text-caption uppercase tracking-[0.4px] text-body">
                  Market Presence
                </span>
                <span className="font-sans-label text-caption uppercase tracking-[0.4px] text-body text-right">
                  Models
                </span>
              </div>
              {/* Rows */}
              {oemTracker.map((b, i) => (
                <div
                  key={b.id}
                  className={`grid grid-cols-[1fr_120px_1fr_80px] gap-md p-lg border-b border-hairline last:border-b-0 items-center ${
                    i % 2 === 0 ? 'bg-canvas' : 'bg-canvas-soft/50'
                  }`}
                >
                  <div className="flex items-center gap-md">
                    {i === 0 && <Crown className="w-[14px] h-[14px] text-accent flex-shrink-0" />}
                    <Link
                      to={`/brands/${b.slug}`}
                      className="font-sans-label text-body-sm-strong text-ink hover:text-link transition-colors"
                    >
                      {b.name}
                    </Link>
                  </div>
                  <span className="font-sans-label text-body-sm text-body">{b.segment}</span>
                  {/* Market share bar */}
                  <div className="flex items-center gap-sm">
                    <div className="flex-1 h-[8px] bg-canvas-soft border border-hairline">
                      <div
                        className="h-full bg-ink transition-all duration-300"
                        style={{ width: `${b.sharePct}%` }}
                      />
                    </div>
                    <span className="font-sans-label text-caption text-body whitespace-nowrap">
                      {b.sharePct.toFixed(0)}%
                    </span>
                  </div>
                  <span className="font-sans-label text-body-sm-strong text-ink text-right">
                    {b.vehicle_count}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-sans-label text-caption text-body mt-md">
              Market presence calculated relative to the brand with the most models. Vehicle counts based on catalogue listings.
            </p>
          </div>
        </section>
      )}

      {/* CEO Interview */}
      {interviews.length > 0 && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading eyebrow="Executive Conversations" title="CEO Interview" />
          {interviews.map((a) => (
            <Link
              key={a.id}
              to={`/article/${a.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-3xl items-center border border-hairline hover:border-ink transition-colors p-3xl bg-canvas"
            >
              <div className="aspect-[4/3] overflow-hidden bg-canvas-soft">
                {a.image_url ? (
                  <img
                    src={a.image_url}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-ink">
                    <Mic className="w-[48px] h-[48px] text-canvas-soft" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-md mb-md">
                  <Tag>Interview</Tag>
                  {a.is_featured && (
                    <span className="font-sans-label text-caption uppercase tracking-[0.3px] text-accent">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-md group-hover:text-body transition-colors">
                  {a.title}
                </h3>
                <p className="font-serif-body text-body-serif-lg text-body leading-relaxed mb-xl line-clamp-3">
                  {a.excerpt}
                </p>
                <div className="flex items-center gap-lg">
                  {a.author && <Eyebrow>{a.author}{a.author_role ? ` · ${a.author_role}` : ''}</Eyebrow>}
                  <Eyebrow className="text-hairline">{formatDate(a.published_at)}</Eyebrow>
                  <Eyebrow className="text-hairline">{a.read_time_min} min read</Eyebrow>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Expert opinion grid */}
      {expertOpinions.length > 0 && (
        <section className="bg-canvas-soft border-y border-hairline py-4xl">
          <div className="mx-auto max-w-editorial px-xl">
            <SectionHeading
              eyebrow="Expert Analysis"
              title="Opinion & Investment"
              link="/news"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
              {expertOpinions.map((a) => (
                <Link
                  key={a.id}
                  to={`/article/${a.slug}`}
                  className="group bg-canvas border border-hairline hover:border-ink transition-colors p-xl"
                >
                  <div className="flex items-center gap-sm mb-md">
                    <Lightbulb className="w-[16px] h-[16px] text-accent" />
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

      {/* More industry articles list */}
      {articles.length > 10 && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading eyebrow="More Reading" title="All Industry Articles" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {articles.slice(6, 14).map((a) => (
              <ArticleCardSmall key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* B2B Newsletter subscribe */}
      <section className="bg-ink text-on-primary py-5xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3xl items-center">
            <div>
              <Eyebrow className="text-canvas-soft mb-md block">B2B Newsletter</Eyebrow>
              <h2 className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] mb-lg text-on-primary">
                The India EV Brief — for decision makers.
              </h2>
              <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed mb-xl">
                A weekly briefing for EV industry professionals. Sales data, policy changes,
                OEM moves, supply chain shifts, and investment signals — delivered every
                Monday at 7 AM IST.
              </p>
              <div className="flex flex-wrap items-center gap-xl">
                <div className="flex items-center gap-sm">
                  <Mail className="w-[16px] h-[16px] text-canvas-soft" />
                  <Eyebrow className="text-canvas-soft">Weekly · Free</Eyebrow>
                </div>
                <div className="w-px h-[20px] bg-ink-soft" />
                <div className="flex items-center gap-sm">
                  <Building2 className="w-[16px] h-[16px] text-canvas-soft" />
                  <Eyebrow className="text-canvas-soft">12,000+ subscribers</Eyebrow>
                </div>
                <div className="w-px h-[20px] bg-ink-soft" />
                <div className="flex items-center gap-sm">
                  <MapPin className="w-[16px] h-[16px] text-canvas-soft" />
                  <Eyebrow className="text-canvas-soft">India-focused</Eyebrow>
                </div>
              </div>
            </div>
            <div>
              {emailSubscribed ? (
                <div className="border border-on-primary p-3xl text-center">
                  <h3 className="font-display text-display-sm mb-sm text-on-primary">
                    You're subscribed.
                  </h3>
                  <p className="font-serif-body text-body-serif-md text-canvas-soft">
                    Look out for the next issue this Monday at 7 AM IST.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEmailSubscribed(true);
                  }}
                  className="flex flex-col gap-md"
                >
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    className="bg-transparent border border-on-primary text-on-primary font-serif-body text-body-serif-md px-xl py-lg placeholder:text-canvas-soft focus:outline-none focus:border-canvas-soft"
                  />
                  <input
                    type="email"
                    required
                    placeholder="work@email.com"
                    className="bg-transparent border border-on-primary text-on-primary font-serif-body text-body-serif-md px-xl py-lg placeholder:text-canvas-soft focus:outline-none focus:border-canvas-soft"
                  />
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    className="bg-transparent border border-on-primary text-on-primary font-serif-body text-body-serif-md px-xl py-lg placeholder:text-canvas-soft focus:outline-none focus:border-canvas-soft"
                  />
                  <button
                    type="submit"
                    className="font-sans-label text-button uppercase tracking-[0.3px] bg-on-primary text-ink px-2xl py-lg hover:bg-canvas-soft transition-colors whitespace-nowrap flex items-center justify-center gap-sm"
                  >
                    Subscribe to Brief
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
