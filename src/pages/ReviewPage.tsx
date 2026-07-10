import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock } from 'lucide-react';
import { getReviewBySlug } from '../lib/queries';
import type { ReviewWithVehicle } from '../lib/types';
import { Eyebrow, Button, Tag, StarRating, formatDate } from '../components/ui/Primitives';

/** Convert **bold** and [text](url) to HTML, escaping everything else first. */
function inlineFormat(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function renderBody(body: string) {
  const blocks = body.split('\n\n');
  const elements: React.ReactNode[] = [];
  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (key: number) => {
    if (!listBuffer) return;
    const TagEl = listBuffer.type === 'ul' ? 'ul' : 'ol';
    elements.push(
      <TagEl key={`list-${key}`}>
        {listBuffer.items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
        ))}
      </TagEl>,
    );
    listBuffer = null;
  };

  blocks.forEach((raw, i) => {
    const block = raw.trim();
    if (!block) return;

    if (block.split('\n').every((l) => l.trim().startsWith('- '))) {
      const items = block.split('\n').map((l) => l.trim().replace(/^- /, ''));
      if (listBuffer && listBuffer.type === 'ul') {
        listBuffer.items.push(...items);
      } else {
        flushList(i);
        listBuffer = { type: 'ul', items };
      }
      return;
    }

    if (block.split('\n').every((l) => /^\d+\.\s/.test(l.trim()))) {
      const items = block.split('\n').map((l) => l.trim().replace(/^\d+\.\s/, ''));
      if (listBuffer && listBuffer.type === 'ol') {
        listBuffer.items.push(...items);
      } else {
        flushList(i);
        listBuffer = { type: 'ol', items };
      }
      return;
    }

    flushList(i);

    if (block.startsWith('### ')) {
      elements.push(<h3 key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(block.slice(4)) }} />);
    } else if (block.startsWith('## ')) {
      elements.push(<h2 key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(block.slice(3)) }} />);
    } else if (block.startsWith('> ')) {
      elements.push(<blockquote key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(block.slice(2)) }} />);
    } else {
      elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(block) }} />);
    }
  });

  flushList(blocks.length);
  return elements;
}

export function ReviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [review, setReview] = useState<ReviewWithVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    getReviewBySlug(slug)
      .then((r) => {
        if (!r) setNotFound(true);
        else setReview(r);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[440px] bg-canvas-soft" />
          <div className="mx-auto max-w-[800px] space-y-lg">
            <div className="h-[40px] bg-canvas-soft w-1/4" />
            <div className="h-[56px] bg-canvas-soft w-full" />
            <div className="h-[20px] bg-canvas-soft w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-6xl text-center">
        <Eyebrow className="text-accent mb-md block">404</Eyebrow>
        <h1 className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] mb-lg">
          Review not found
        </h1>
        <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[500px] mx-auto">
          This review may have been removed or the link is broken.
        </p>
        <Button to="/consumers/reviews">Browse Reviews</Button>
      </div>
    );
  }

  if (!review) return null;

  const breakdownEntries = review.rating_breakdown
    ? Object.entries(review.rating_breakdown)
    : [];
  const maxRating = 5;

  return (
    <article className="fade-in-up">
      {/* Full-width hero */}
      {review.image_url && (
        <div className="w-full bg-canvas-soft">
          <div className="aspect-[16/9] max-h-[520px] overflow-hidden">
            <img
              src={review.image_url}
              alt={review.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Review body — constrained width */}
      <div className="mx-auto max-w-[800px] px-xl py-4xl">
        {/* Tag + vehicle link */}
        <div className="flex items-center gap-md mb-xl">
          <Tag>{review.review_type}</Tag>
          {review.vehicle && (
            <Link
              to={`/vehicles/${review.vehicle.slug}`}
              className="font-sans-label text-body-sm uppercase tracking-[0.4px] text-link hover:text-ink transition-colors"
            >
              {review.vehicle.name}
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] mb-xl">
          {review.title}
        </h1>

        {/* Excerpt deck */}
        {review.excerpt && (
          <p className="font-serif-body text-body-serif-lg text-body leading-relaxed mb-2xl">
            {review.excerpt}
          </p>
        )}

        {/* Byline + rating */}
        <div className="flex flex-wrap items-center justify-between gap-xl border-y border-hairline py-lg mb-3xl">
          <div className="flex items-center gap-lg">
            {review.author && (
              <div className="flex items-center gap-sm">
                <div className="w-[36px] h-[36px] rounded-full bg-ink text-on-primary flex items-center justify-center">
                  <span className="font-display text-[16px]">
                    {review.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-sans-label text-body-sm-strong text-ink">
                    {review.author}
                  </p>
                  {review.author_role && (
                    <p className="font-sans-label text-caption text-body">
                      {review.author_role}
                    </p>
                  )}
                </div>
              </div>
            )}
            <Eyebrow className="text-hairline">{formatDate(review.published_at)}</Eyebrow>
          </div>
          {review.rating > 0 && <StarRating rating={review.rating} size="lg" />}
        </div>

        {/* Body */}
        {review.body && (
          <div className="article-body">{renderBody(review.body)}</div>
        )}

        {/* Rating breakdown */}
        {breakdownEntries.length > 0 && (
          <div className="mt-4xl pt-xl border-t border-hairline">
            <Eyebrow className="mb-lg block">Rating Breakdown</Eyebrow>
            <div className="space-y-lg">
              {breakdownEntries.map(([label, score]) => {
                const pct = Math.min(100, (score / maxRating) * 100);
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-xxs">
                      <span className="font-sans-label text-body-sm-strong text-ink">
                        {label}
                      </span>
                      <span className="font-sans-label text-body-sm text-body">
                        {score.toFixed(1)}/5
                      </span>
                    </div>
                    <div className="h-[8px] bg-canvas-soft overflow-hidden">
                      <div
                        className="h-full bg-ink transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-lg flex items-center justify-between">
              <span className="font-sans-label text-body-sm uppercase tracking-[0.3px] text-body">
                Overall
              </span>
              <StarRating rating={review.rating} size="md" />
            </div>
          </div>
        )}

        {/* Pros / Cons */}
        {(review.pros.length > 0 || review.cons.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3xl mt-4xl pt-xl border-t border-hairline">
            <div>
              <div className="flex items-center gap-sm border-b border-ink pb-md mb-lg">
                <span className="w-[24px] h-[24px] rounded-full bg-ink text-on-primary flex items-center justify-center">
                  <Check className="w-[14px] h-[14px]" />
                </span>
                <h3 className="font-sans-label text-body-md-strong text-ink uppercase tracking-[0.3px]">
                  Pros
                </h3>
              </div>
              <ul className="space-y-md">
                {review.pros.map((p, i) => (
                  <li key={i} className="flex gap-md items-start">
                    <Check className="w-[16px] h-[16px] text-ink flex-shrink-0 mt-xs" />
                    <span className="font-serif-body text-body-serif-md text-ink leading-snug">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-sm border-b border-ink pb-md mb-lg">
                <span className="w-[24px] h-[24px] rounded-full border border-ink text-ink flex items-center justify-center">
                  <X className="w-[14px] h-[14px]" />
                </span>
                <h3 className="font-sans-label text-body-md-strong text-ink uppercase tracking-[0.3px]">
                  Cons
                </h3>
              </div>
              <ul className="space-y-md">
                {review.cons.map((c, i) => (
                  <li key={i} className="flex gap-md items-start">
                    <X className="w-[16px] h-[16px] text-body flex-shrink-0 mt-xs" />
                    <span className="font-serif-body text-body-serif-md text-ink leading-snug">
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer link */}
        <div className="mt-3xl flex items-center justify-between">
          <Link
            to="/consumers/reviews"
            className="inline-flex items-center gap-sm font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-link hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-[14px] h-[14px]" />
            All Reviews
          </Link>
          {review.vehicle && (
            <Link
              to={`/vehicles/${review.vehicle.slug}`}
              className="inline-flex items-center gap-sm font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-link hover:text-ink transition-colors"
            >
              View {review.vehicle.name}
              <Clock className="w-[14px] h-[14px]" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
