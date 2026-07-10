import { Link } from 'react-router-dom';
import type { Article, ReviewWithVehicle, VehicleWithBrand, EVEvent, OwnerStory } from '../lib/types';
import { Eyebrow, Tag, StarRating, formatDate, formatPrice } from './ui/Primitives';

export function ArticleCardLarge({ article }: { article: Article }) {
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
          <div className="w-full h-full flex items-center justify-center bg-canvas-soft">
            <span className="font-display text-display-sm text-hairline">EVDigest</span>
          </div>
        )}
      </div>
      <Tag className="mb-sm">{article.category}</Tag>
      <h3 className="font-display text-display-sm leading-[1.15] tracking-[-0.28px] mb-sm group-hover:text-body transition-colors">
        {article.title}
      </h3>
      <p className="font-serif-body text-body-serif-md text-body line-clamp-2 mb-md">
        {article.excerpt}
      </p>
      <div className="flex items-center gap-md">
        {article.author && (
          <Eyebrow>{article.author}</Eyebrow>
        )}
        <Eyebrow className="text-hairline">{formatDate(article.published_at)}</Eyebrow>
        <Eyebrow className="text-hairline">{article.read_time_min} min read</Eyebrow>
      </div>
    </Link>
  );
}

export function ArticleCardMedium({ article }: { article: Article }) {
  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <div className="aspect-[16/10] overflow-hidden bg-canvas-soft mb-md">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-display-sm text-hairline">EVDigest</span>
          </div>
        )}
      </div>
      <Tag className="mb-xs">{article.category}</Tag>
      <h3 className="font-display text-[20px] leading-[1.2] tracking-[-0.28px] mb-xs group-hover:text-body transition-colors">
        {article.title}
      </h3>
      <p className="font-serif-body text-body-serif-md text-body line-clamp-2">
        {article.excerpt}
      </p>
      <div className="flex items-center gap-md mt-sm">
        <Eyebrow>{formatDate(article.published_at)}</Eyebrow>
        <Eyebrow className="text-hairline">{article.read_time_min} min</Eyebrow>
      </div>
    </Link>
  );
}

export function ArticleCardSmall({ article }: { article: Article }) {
  return (
    <Link to={`/article/${article.slug}`} className="group flex gap-lg items-start py-lg border-b border-hairline">
      <div className="w-[120px] h-[80px] flex-shrink-0 overflow-hidden bg-canvas-soft">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Eyebrow className="text-accent">{article.category}</Eyebrow>
        <h4 className="font-display text-[18px] leading-[1.2] tracking-[-0.2px] mt-xs group-hover:text-body transition-colors line-clamp-2">
          {article.title}
        </h4>
        <p className="font-sans-label text-caption text-body mt-xs">{formatDate(article.published_at)}</p>
      </div>
    </Link>
  );
}

export function ReviewCard({ review }: { review: ReviewWithVehicle }) {
  return (
    <Link to={`/reviews/${review.slug}`} className="group block border border-hairline hover:border-ink transition-colors p-lg">
      <div className="aspect-[16/10] overflow-hidden bg-canvas-soft mb-md">
        {(review.image_url || review.vehicle?.image_url) ? (
          <img
            src={review.image_url || review.vehicle?.image_url || ''}
            alt={review.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
      <div className="flex items-center justify-between mb-xs">
        <Tag>{review.review_type}</Tag>
        <StarRating rating={review.rating} size="sm" />
      </div>
      <h3 className="font-display text-[18px] leading-[1.2] tracking-[-0.2px] mb-xs group-hover:text-body transition-colors">
        {review.title}
      </h3>
      <p className="font-serif-body text-body-serif-md text-body line-clamp-2">
        {review.excerpt}
      </p>
      <Eyebrow className="mt-sm block">{review.author} · {formatDate(review.published_at)}</Eyebrow>
    </Link>
  );
}

export function VehicleCard({ vehicle }: { vehicle: VehicleWithBrand }) {
  return (
    <div className="border border-hairline hover:border-ink transition-colors group">
      <Link to={`/vehicles/${vehicle.slug}`}>
        <div className="aspect-[16/10] overflow-hidden bg-canvas-soft">
          {vehicle.image_url ? (
            <img
              src={vehicle.image_url}
              alt={vehicle.name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-display-sm text-hairline">{vehicle.name}</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-lg">
        <div className="flex items-center justify-between mb-xs">
          <Eyebrow>{vehicle.brand?.name}</Eyebrow>
          <span className="font-sans-label text-caption text-body">{vehicle.segment}</span>
        </div>
        <Link to={`/vehicles/${vehicle.slug}`}>
          <h3 className="font-display text-[20px] leading-[1.2] tracking-[-0.2px] mb-sm group-hover:text-body transition-colors">
            {vehicle.name}
          </h3>
        </Link>
        <div className="grid grid-cols-2 gap-md text-sm">
          <div>
            <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body">Range</p>
            <p className="font-sans-label text-body-sm-strong text-ink">{vehicle.range_km} km</p>
          </div>
          <div>
            <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body">Price</p>
            <p className="font-sans-label text-body-sm-strong text-ink">{formatPrice(vehicle.price_inr)}</p>
          </div>
          <div>
            <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body">Battery</p>
            <p className="font-sans-label text-body-sm-strong text-ink">{vehicle.battery_kwh} kWh</p>
          </div>
          <div>
            <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body">Rating</p>
            <p className="font-sans-label text-body-sm-strong text-ink">{vehicle.rating > 0 ? `${vehicle.rating}/5` : '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventCard({ event }: { event: EVEvent }) {
  return (
    <Link to={`/events/${event.slug}`} className="group block border border-hairline hover:border-ink transition-colors">
      <div className="aspect-[16/9] overflow-hidden bg-canvas-soft">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
      <div className="p-lg">
        <Tag className="mb-xs">{event.type}</Tag>
        <h3 className="font-display text-[18px] leading-[1.2] tracking-[-0.2px] mb-sm group-hover:text-body transition-colors">
          {event.name}
        </h3>
        <div className="flex items-center gap-md">
          <Eyebrow>{formatDate(event.start_date)}</Eyebrow>
          {event.city && <Eyebrow className="text-body">{event.city}</Eyebrow>}
        </div>
      </div>
    </Link>
  );
}

export function OwnerStoryCard({ story }: { story: OwnerStory }) {
  return (
    <div className="border border-hairline hover:border-ink transition-colors p-lg">
      <div className="flex items-center gap-md mb-md">
        {story.photo_url ? (
          <img
            src={story.photo_url}
            alt={story.author_name}
            className="w-[48px] h-[48px] rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-[48px] h-[48px] rounded-full bg-canvas-soft flex items-center justify-center">
            <span className="font-display text-[20px] text-body">
              {story.author_name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-sans-label text-body-sm-strong text-ink">{story.author_name}</p>
          <p className="font-sans-label text-caption text-body">
            {story.vehicle} · {story.city}
          </p>
        </div>
      </div>
      {story.headline && (
        <h3 className="font-display text-[18px] leading-[1.2] tracking-[-0.2px] mb-sm">
          "{story.headline}"
        </h3>
      )}
      <p className="font-serif-body text-body-serif-md text-body line-clamp-3">
        {story.story_text}
      </p>
    </div>
  );
}
