import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Building2, Calendar, BookOpen, Newspaper,
  Calculator, MapPin, PiggyBank, TrendingUp, ArrowRight,
} from 'lucide-react';
import {
  getBreakingNews, getFeaturedArticles, getLatestArticles,
  getVehicles, getEvents, getOwnerStories, getSalesData, getReviews,
} from '../lib/queries';
import type { Article, VehicleWithBrand, EVEvent, OwnerStory, EVSalesData, ReviewWithVehicle } from '../lib/types';
import { Eyebrow, SectionHeading, Button, formatDate, formatNumber, formatPrice, StarRating } from '../components/ui/Primitives';
import { ArticleCardSmall, ReviewCard, EventCard } from '../components/Cards';

export function HomePage() {
  const [, setBreaking] = useState<Article[]>([]);
  const [featured, setFeatured] = useState<Article[]>([]);
  const [latest, setLatest] = useState<Article[]>([]);
  const [vehicles, setVehicles] = useState<VehicleWithBrand[]>([]);
  const [events, setEvents] = useState<EVEvent[]>([]);
  const [ownerStory, setOwnerStory] = useState<OwnerStory | null>(null);
  const [sales, setSales] = useState<EVSalesData[]>([]);
  const [reviews, setReviews] = useState<ReviewWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBreakingNews(),
      getFeaturedArticles(3),
      getLatestArticles(6),
      getVehicles(),
      getEvents(true),
      getOwnerStories(true),
      getSalesData(),
      getReviews(),
    ])
      .then(([b, f, l, v, e, os, s, r]) => {
        setBreaking(b);
        setFeatured(f);
        setLatest(l);
        setVehicles(v);
        setEvents(e.slice(0, 3));
        setOwnerStory(os[0] || null);
        setSales(s);
        setReviews(r.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[400px] bg-canvas-soft" />
          <div className="h-px bg-hairline" />
          <div className="grid grid-cols-3 gap-xl">
            <div className="h-[300px] bg-canvas-soft" />
            <div className="h-[300px] bg-canvas-soft" />
            <div className="h-[300px] bg-canvas-soft" />
          </div>
        </div>
      </div>
    );
  }

  const heroArticle = featured[0] || latest[0];
  const secondaryFeatured = featured.slice(1, 3);
  const topVehicle = vehicles.find((v) => v.rating >= 4.4) || vehicles[0];
  const industryArticles = latest.filter((a) => a.section === 'industry').slice(0, 3);
  const latestSales = sales.filter((s) => s.year === 2026);
  const salesBySegment = ['2W', '3W', 'Cars', 'Buses'].map((seg) => {
    const segData = latestSales.filter((s) => s.segment === seg);
    return { segment: seg, total: segData.reduce((sum, s) => sum + s.units_sold, 0) };
  });
  const maxSales = Math.max(...salesBySegment.map((s) => s.total));

  const quickNav = [
    { icon: Zap, label: 'For Consumers', desc: 'Buy, compare, review', slug: '/consumers/buyers-guide' },
    { icon: Building2, label: 'Industry', desc: 'Market data, analysis', slug: '/industry' },
    { icon: Calendar, label: 'Events', desc: 'EV events in India', slug: '/events' },
    { icon: TrendingUp, label: 'Brands', desc: 'Every EV brand sold', slug: '/brands' },
    { icon: BookOpen, label: 'EV Basics', desc: 'Learn from scratch', slug: '/basics' },
    { icon: Newspaper, label: 'Magazine', desc: 'In-depth editorial', slug: '/magazine/current' },
  ];

  const tools = [
    { icon: Calculator, label: 'Cost Savings', desc: 'EV vs petrol 5-yr TCO', slug: '/consumers/tools/cost-savings' },
    { icon: Zap, label: 'Range Calculator', desc: 'Real-world range estimate', slug: '/consumers/tools/cost-savings' },
    { icon: PiggyBank, label: 'Subsidy Finder', desc: 'State + vehicle benefits', slug: '/consumers/tools/subsidy' },
    { icon: MapPin, label: 'Charger Locator', desc: 'Find nearby chargers', slug: '/consumers/tools/charger-map' },
  ];

  return (
    <div>
      {/* Hero */}
      {heroArticle && (
        <section className="mx-auto max-w-editorial px-xl pt-3xl pb-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-3xl">
            {/* Lead story */}
            <Link to={`/article/${heroArticle.slug}`} className="group">
              <div className="aspect-[16/9] overflow-hidden bg-canvas-soft mb-xl">
                {heroArticle.image_url ? (
                  <img
                    src={heroArticle.image_url}
                    alt={heroArticle.title}
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <Eyebrow className="text-accent mb-sm block">{heroArticle.category}</Eyebrow>
              <h1 className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] mb-md group-hover:text-body transition-colors">
                {heroArticle.title}
              </h1>
              <p className="font-serif-body text-body-serif-lg text-body max-w-[600px] leading-relaxed">
                {heroArticle.excerpt}
              </p>
              <div className="flex items-center gap-lg mt-lg">
                {heroArticle.author && <Eyebrow>{heroArticle.author}</Eyebrow>}
                <Eyebrow className="text-hairline">{formatDate(heroArticle.published_at)}</Eyebrow>
                <Eyebrow className="text-hairline">{heroArticle.read_time_min} min read</Eyebrow>
              </div>
            </Link>

            {/* Secondary stories */}
            <div className="flex flex-col">
              <div className="border-b border-ink pb-md mb-md">
                <Eyebrow>Top Stories</Eyebrow>
              </div>
              <div className="flex-1">
                {secondaryFeatured.map((a) => (
                  <ArticleCardSmall key={a.id} article={a} />
                ))}
                {latest.slice(0, 3).map((a) => (
                  <ArticleCardSmall key={a.id} article={a} />
                )).slice(0, 3 - secondaryFeatured.length)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick nav cards */}
      <section className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-lg">
            {quickNav.map((item) => (
              <Link
                key={item.label}
                to={item.slug}
                className="group flex flex-col items-start p-xl border border-hairline hover:border-ink bg-canvas transition-all hover:shadow-md"
              >
                <item.icon className="w-[28px] h-[28px] text-ink mb-md group-hover:text-body transition-colors" />
                <p className="font-sans-label text-body-sm-strong uppercase tracking-[0.3px] text-ink mb-xxs">
                  {item.label}
                </p>
                <p className="font-serif-body text-body-serif-md text-body leading-snug">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top stories grid */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading eyebrow="Editorial Picks" title="Top Stories" link="/news" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3xl">
            {latest.slice(0, 3).map((a) => (
              <MediumArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* EV Pulse — sales chart */}
      {salesBySegment.length > 0 && (
        <section className="bg-ink text-on-primary py-4xl">
          <div className="mx-auto max-w-editorial px-xl">
            <div className="flex items-end justify-between border-b border-ink-soft pb-md mb-xl">
              <div>
                <Eyebrow className="text-canvas-soft mb-xs block">EV Pulse · Vahan Data</Eyebrow>
                <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px]">
                  India EV Sales 2026 YTD
                </h2>
              </div>
              <Link
                to="/industry/oem-tracker"
                className="font-sans-label text-body-sm-strong uppercase tracking-[0.3px] text-canvas-soft hover:text-on-primary transition-colors whitespace-nowrap"
              >
                Full Report &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-xl items-end h-[200px]">
              {salesBySegment.map((s) => (
                <div key={s.segment} className="flex flex-col items-center h-full justify-end">
                  <p className="font-sans-label text-body-sm-strong text-on-primary mb-sm">
                    {formatNumber(s.total)}
                  </p>
                  <div
                    className="w-full bg-on-primary hover:bg-canvas-soft transition-colors"
                    style={{ height: `${(s.total / maxSales) * 140}px` }}
                  />
                  <p className="font-sans-label text-body-sm uppercase tracking-[0.3px] text-canvas-soft mt-sm">
                    {s.segment}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-sans-label text-caption text-canvas-soft mt-xl">
              Source: Vahan · Jan–Jun 2026 · Units sold by segment
            </p>
          </div>
        </section>
      )}

      {/* Vehicle spotlight */}
      {topVehicle && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading eyebrow="Vehicle Spotlight" title="Featured Vehicle" link="/consumers/buyers-guide" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl items-center">
            <Link to={`/vehicles/${topVehicle.slug}`} className="group">
              <div className="aspect-[4/3] overflow-hidden bg-canvas-soft">
                {topVehicle.image_url ? (
                  <img
                    src={topVehicle.image_url}
                    alt={topVehicle.name}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-display-md text-hairline">{topVehicle.name}</span>
                  </div>
                )}
              </div>
            </Link>
            <div>
              <Eyebrow className="text-accent mb-sm block">
                {topVehicle.brand?.name} · {topVehicle.segment}
              </Eyebrow>
              <h3 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-md">
                {topVehicle.name}
              </h3>
              {topVehicle.review_excerpt && (
                <p className="font-serif-body text-body-serif-lg text-body leading-relaxed mb-xl">
                  {topVehicle.review_excerpt}
                </p>
              )}
              <div className="grid grid-cols-2 gap-xl mb-xl">
                <SpecRow label="Range" value={`${topVehicle.range_km} km`} />
                <SpecRow label="Price" value={formatPrice(topVehicle.price_inr)} />
                <SpecRow label="Battery" value={`${topVehicle.battery_kwh} kWh`} />
                <SpecRow label="Charge Time" value={topVehicle.charge_time_hrs || '—'} />
              </div>
              {topVehicle.rating > 0 && (
                <div className="mb-xl">
                  <StarRating rating={topVehicle.rating} size="lg" />
                </div>
              )}
              <div className="flex gap-lg">
                <Button to={`/vehicles/${topVehicle.slug}`}>Full Review</Button>
                <Button to="/consumers/compare" variant="outline">Compare</Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tools strip */}
      <section className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <SectionHeading eyebrow="Tools" title="Calculators & Finders" link="/consumers/tools/cost-savings" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-lg">
            {tools.map((tool) => (
              <Link
                key={tool.label}
                to={tool.slug}
                className="group bg-canvas border border-hairline hover:border-ink p-xl transition-all hover:shadow-md flex flex-col"
              >
                <tool.icon className="w-[32px] h-[32px] text-ink mb-lg group-hover:text-accent transition-colors" />
                <p className="font-sans-label text-body-sm-strong uppercase tracking-[0.3px] text-ink mb-xxs">
                  {tool.label}
                </p>
                <p className="font-serif-body text-body-serif-md text-body">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industry brief */}
      {industryArticles.length > 0 && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading eyebrow="Industry" title="Latest Business News" link="/industry" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {industryArticles.map((a) => (
              <Link key={a.id} to={`/article/${a.slug}`} className="group block py-xl border-b border-hairline">
                <Eyebrow className="text-accent mb-xs block">{a.category}</Eyebrow>
                <h3 className="font-display text-[22px] leading-[1.2] tracking-[-0.2px] mb-xs group-hover:text-body transition-colors">
                  {a.title}
                </h3>
                <p className="font-serif-body text-body-serif-md text-body line-clamp-2 mb-sm">
                  {a.excerpt}
                </p>
                <div className="flex items-center gap-md">
                  <Eyebrow className="text-hairline">{formatDate(a.published_at)}</Eyebrow>
                  <Eyebrow className="text-hairline">{a.read_time_min} min</Eyebrow>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Reviews section */}
      {reviews.length > 0 && (
        <section className="bg-canvas-soft border-y border-hairline py-4xl">
          <div className="mx-auto max-w-editorial px-xl">
            <SectionHeading eyebrow="Reviews" title="Latest Reviews" link="/consumers/reviews" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Owner story */}
      {ownerStory && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading eyebrow="Community" title="Real Owner Stories" link="/consumers/owner-stories" />
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3xl">
            <div className="bg-canvas-soft p-3xl border-l-4 border-ink">
              <div className="flex items-center gap-lg mb-xl">
                {ownerStory.photo_url ? (
                  <img
                    src={ownerStory.photo_url}
                    alt={ownerStory.author_name}
                    className="w-[64px] h-[64px] rounded-full object-cover"
                  />
                ) : (
                  <div className="w-[64px] h-[64px] rounded-full bg-ink text-on-primary flex items-center justify-center">
                    <span className="font-display text-[28px]">{ownerStory.author_name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-sans-label text-body-sm-strong text-ink">{ownerStory.author_name}</p>
                  <p className="font-sans-label text-caption text-body">
                    {ownerStory.vehicle} · {ownerStory.city} · {ownerStory.use_case} use
                  </p>
                </div>
              </div>
              {ownerStory.headline && (
                <h3 className="font-display text-display-sm leading-[1.2] tracking-[-0.28px] mb-lg italic">
                  "{ownerStory.headline}"
                </h3>
              )}
              <p className="font-serif-body text-body-serif-lg text-body leading-relaxed line-clamp-4">
                {ownerStory.story_text}
              </p>
              <Button to="/consumers/owner-stories" variant="outline" size="sm" className="mt-xl">
                Read More Stories
              </Button>
            </div>
            <div className="bg-ink text-on-primary p-3xl">
              <Eyebrow className="text-canvas-soft mb-md block">Share Your Story</Eyebrow>
              <h3 className="font-display text-display-sm leading-[1.2] mb-lg text-on-primary">
                Driving an EV? Tell us about your experience.
              </h3>
              <p className="font-serif-body text-body-serif-md text-canvas-soft mb-xl leading-relaxed">
                Your story helps thousands of Indians make the switch to electric.
              </p>
              <Link
                to="/consumers/owner-stories"
                className="font-sans-label text-body-sm-strong uppercase tracking-[0.3px] text-on-primary border border-on-primary px-xl py-sm hover:bg-on-primary hover:text-ink transition-colors inline-flex items-center gap-sm"
              >
                Submit Your Story <ArrowRight className="w-[14px] h-[14px]" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming events */}
      {events.length > 0 && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading eyebrow="Events" title="Upcoming EV Events" link="/events" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter signup */}
      <section className="bg-ink text-on-primary py-5xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl items-center">
            <div>
              <Eyebrow className="text-canvas-soft mb-md block">Newsletter</Eyebrow>
              <h2 className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] mb-lg">
                The week in EVs, delivered every Sunday.
              </h2>
              <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed">
                Join 50,000+ readers getting India's most-read EV newsletter. Market data,
                new launches, reviews, and analysis — free, forever.
              </p>
            </div>
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = '/subscribe';
                }}
                className="flex flex-col sm:flex-row gap-md"
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent border border-on-primary text-on-primary font-serif-body text-body-serif-md px-xl py-lg placeholder:text-canvas-soft focus:outline-none focus:border-canvas-soft"
                />
                <button
                  type="submit"
                  className="font-sans-label text-button uppercase tracking-[0.3px] bg-on-primary text-ink px-2xl py-lg hover:bg-canvas-soft transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="font-sans-label text-caption text-canvas-soft mt-md">
                No spam. Unsubscribe anytime. Privacy protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest magazine edition teaser */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <SectionHeading eyebrow="Magazine" title="Current Issue" link="/magazine/current" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3xl">
          <div className="aspect-[3/4] bg-ink text-on-primary p-3xl flex flex-col justify-between">
            <div>
              <Eyebrow className="text-canvas-soft block mb-md">July 2026 · Issue #07</Eyebrow>
              <h3 className="font-display text-display-md leading-[1.1] tracking-[-0.3px]">
                The Electric Decade
              </h3>
            </div>
            <div>
              <p className="font-serif-body text-body-serif-md text-canvas-soft mb-lg">
                Inside: India's road to 10 million EVs · The battery arms race · Highway charging decoded
              </p>
              <Link
                to="/magazine/current"
                className="font-sans-label text-body-sm-strong uppercase tracking-[0.3px] text-on-primary border border-on-primary px-xl py-sm hover:bg-on-primary hover:text-ink transition-colors inline-block"
              >
                Read Now
              </Link>
            </div>
          </div>
          <div className="space-y-lg">
            {latest.slice(0, 4).map((a) => (
              <ArticleCardSmall key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-hairline pb-md">
      <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">{label}</p>
      <p className="font-sans-label text-body-md-strong text-ink">{value}</p>
    </div>
  );
}

function MediumArticleCard({ article }: { article: Article }) {
  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <div className="aspect-[16/10] overflow-hidden bg-canvas-soft mb-lg">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
      <Eyebrow className="text-accent mb-xs block">{article.category}</Eyebrow>
      <h3 className="font-display text-[22px] leading-[1.2] tracking-[-0.2px] mb-xs group-hover:text-body transition-colors">
        {article.title}
      </h3>
      <p className="font-serif-body text-body-serif-md text-body line-clamp-2">
        {article.excerpt}
      </p>
      <div className="flex items-center gap-md mt-sm">
        <Eyebrow className="text-hairline">{formatDate(article.published_at)}</Eyebrow>
        <Eyebrow className="text-hairline">{article.read_time_min} min</Eyebrow>
      </div>
    </Link>
  );
}
