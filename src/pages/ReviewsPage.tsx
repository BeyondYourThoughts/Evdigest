import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, Video, ClipboardList, User, ArrowRight, Filter } from 'lucide-react';
import { getReviews } from '../lib/queries';
import type { ReviewWithVehicle } from '../lib/types';
import {
  Eyebrow, SectionHeading, Button, StarRating, Tag, formatDate,
} from '../components/ui/Primitives';
import { ReviewCard } from '../components/Cards';

type FilterType = 'all' | 'expert' | 'owner' | 'long-term' | 'video';

const FILTERS: { key: FilterType; label: string; icon: typeof Star }[] = [
  { key: 'all', label: 'All Reviews', icon: Star },
  { key: 'expert', label: 'Expert', icon: ClipboardList },
  { key: 'owner', label: 'Owner', icon: User },
  { key: 'long-term', label: 'Long-Term', icon: MessageSquare },
  { key: 'video', label: 'Video', icon: Video },
];

export function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    getReviews()
      .then((r) => {
        setReviews(r);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
    window.scrollTo(0, 0);
  }, []);

  const featured = useMemo(() => {
    if (reviews.length === 0) return null;
    return [...reviews].sort((a, b) => b.rating - a.rating)[0];
  }, [reviews]);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return reviews;
    return reviews.filter((r) => r.review_type === activeFilter);
  }, [reviews, activeFilter]);

  const typeCounts = useMemo(() => {
    const counts: Record<FilterType, number> = {
      all: reviews.length,
      expert: 0,
      owner: 0,
      'long-term': 0,
      video: 0,
    };
    reviews.forEach((r) => {
      counts[r.review_type] = (counts[r.review_type] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[280px] bg-canvas-soft" />
          <div className="h-[48px] bg-canvas-soft w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            <div className="h-[340px] bg-canvas-soft" />
            <div className="h-[340px] bg-canvas-soft" />
            <div className="h-[340px] bg-canvas-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <p className="font-serif-body text-body-serif-lg text-body">
          Could not load reviews. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* Page hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <Eyebrow className="text-canvas-soft mb-md block">For Consumers</Eyebrow>
          <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
            Reviews
          </h1>
          <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[680px]">
            Expert road tests, long-term ownership reports, and real-world video reviews
            of every electric vehicle sold in India. Filter by review type to find exactly
            what you need.
          </p>
          <div className="flex items-center gap-xl mt-2xl">
            <div>
              <p className="font-display text-display-sm text-on-primary">{reviews.length}</p>
              <Eyebrow className="text-canvas-soft block">Total Reviews</Eyebrow>
            </div>
            <div className="w-px h-[40px] bg-ink-soft" />
            <div>
              <p className="font-display text-display-sm text-on-primary">
                {typeCounts.expert}
              </p>
              <Eyebrow className="text-canvas-soft block">Expert</Eyebrow>
            </div>
            <div className="w-px h-[40px] bg-ink-soft" />
            <div>
              <p className="font-display text-display-sm text-on-primary">
                {typeCounts['long-term']}
              </p>
              <Eyebrow className="text-canvas-soft block">Long-Term</Eyebrow>
            </div>
          </div>
        </div>
      </section>

      {/* Featured review */}
      {featured && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading eyebrow="Top Rated" title="Featured Review" />
          <Link
            to={`/reviews/${featured.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-3xl items-center border border-hairline hover:border-ink transition-colors p-3xl bg-canvas"
          >
            <div className="aspect-[16/10] overflow-hidden bg-canvas-soft">
              {featured.image_url || featured.vehicle?.image_url ? (
                <img
                  src={featured.image_url || featured.vehicle?.image_url || ''}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-display-md text-hairline">EVDigest</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-md mb-md">
                <Tag>{featured.review_type}</Tag>
                {featured.rating >= 4.5 && (
                  <span className="inline-flex items-center gap-xxs font-sans-label text-caption uppercase tracking-[0.3px] text-accent">
                    <Star className="w-[12px] h-[12px] fill-accent" /> Editor's Choice
                  </span>
                )}
              </div>
              <h3 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-md group-hover:text-body transition-colors">
                {featured.title}
              </h3>
              <p className="font-serif-body text-body-serif-lg text-body leading-relaxed mb-xl line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-xl mb-xl">
                <StarRating rating={featured.rating} size="lg" />
              </div>
              <div className="flex items-center gap-lg">
                {featured.author && (
                  <Eyebrow>
                    {featured.author}
                    {featured.author_role ? ` · ${featured.author_role}` : ''}
                  </Eyebrow>
                )}
                <Eyebrow className="text-hairline">{formatDate(featured.published_at)}</Eyebrow>
              </div>
              {featured.vehicle && (
                <div className="mt-lg pt-lg border-t border-hairline">
                  <Eyebrow className="text-link block">Reviewing: {featured.vehicle.name}</Eyebrow>
                </div>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Filter pills */}
      <section className="border-y border-hairline sticky top-0 bg-canvas z-10">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex items-center gap-xxs overflow-x-auto no-scrollbar py-lg">
            <Filter className="w-[16px] h-[16px] text-body flex-shrink-0 mr-sm" />
            {FILTERS.map((f) => {
              const active = f.key === activeFilter;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-sm whitespace-nowrap font-sans-label text-body-sm-strong uppercase tracking-[0.3px] px-xl py-sm border transition-colors ${
                    active
                      ? 'border-ink bg-ink text-on-primary'
                      : 'border-hairline text-body hover:border-ink hover:text-ink'
                  }`}
                >
                  <f.icon className="w-[14px] h-[14px]" />
                  {f.label}
                  <span
                    className={`font-sans-label text-caption ${
                      active ? 'text-canvas-soft' : 'text-hairline'
                    }`}
                  >
                    {typeCounts[f.key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <div className="flex items-end justify-between border-b border-ink pb-md mb-xl">
          <div>
            <Eyebrow className="mb-xs block">
              {activeFilter === 'all' ? 'All Reviews' : `${FILTERS.find((f) => f.key === activeFilter)?.label} Reviews`}
            </Eyebrow>
            <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px]">
              {filtered.length} {filtered.length === 1 ? 'Review' : 'Reviews'}
            </h2>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
            {filtered.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        ) : (
          <div className="border border-hairline py-6xl text-center">
            <MessageSquare className="w-[40px] h-[40px] text-hairline mx-auto mb-lg" />
            <h3 className="font-display text-display-sm mb-sm">No reviews found</h3>
            <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[400px] mx-auto">
              There are no {FILTERS.find((f) => f.key === activeFilter)?.label.toLowerCase()} reviews
              in our database yet. Try a different filter.
            </p>
            <Button onClick={() => setActiveFilter('all')} variant="outline" size="sm">
              Show All Reviews
            </Button>
          </div>
        )}
      </section>

      {/* CTA strip */}
      <section className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-xl bg-canvas border border-hairline p-3xl">
            <div>
              <Eyebrow className="mb-xs block">Buying a vehicle?</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-sm">
                Compare specs side-by-side.
              </h2>
              <p className="font-serif-body text-body-serif-md text-body leading-snug max-w-[520px]">
                Stack range, price, battery, and ratings next to each other to find your
                best match.
              </p>
            </div>
            <Button to="/consumers/compare" className="whitespace-nowrap">
              Open Compare Tool <ArrowRight className="w-[16px] h-[16px] ml-sm" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
