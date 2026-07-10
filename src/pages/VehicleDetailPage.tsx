import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Battery, Gauge, Zap, Users, Calendar, IndianRupee, Car, ArrowLeft, Check, X,
} from 'lucide-react';
import { getVehicleBySlug, getReviewsByVehicle } from '../lib/queries';
import type { Vehicle, Review } from '../lib/types';
import {
  Eyebrow, Button, Tag, StarRating, formatDate, formatPrice,
} from '../components/ui/Primitives';

function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-hairline py-lg flex items-center gap-lg">
      <div className="w-[40px] h-[40px] flex items-center justify-center bg-canvas-soft flex-shrink-0">
        <Icon className="w-[18px] h-[18px] text-ink" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body">
          {label}
        </p>
        <p className="font-sans-label text-body-md-strong text-ink">{value}</p>
      </div>
    </div>
  );
}

export function VehicleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    getVehicleBySlug(slug)
      .then(async (v) => {
        if (!v) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setVehicle(v);
        try {
          const r = await getReviewsByVehicle(v.id);
          setReviews(r);
        } catch {
          setReviews([]);
        }
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
          <div className="h-[420px] bg-canvas-soft" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl">
            <div className="h-[300px] bg-canvas-soft" />
            <div className="h-[300px] bg-canvas-soft" />
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
          Vehicle not found
        </h1>
        <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[500px] mx-auto">
          The vehicle you're looking for isn't in our database yet.
        </p>
        <Button to="/consumers/buyers-guide">Browse Buyers Guide</Button>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="fade-in-up">
      {/* Hero */}
      <section className="w-full bg-canvas-soft">
        <div className="mx-auto max-w-editorial px-xl pt-3xl pb-4xl">
          <Link
            to="/consumers/buyers-guide"
            className="inline-flex items-center gap-sm font-sans-label text-body-sm uppercase tracking-[0.4px] text-body hover:text-ink transition-colors mb-xl"
          >
            <ArrowLeft className="w-[14px] h-[14px]" />
            Buyers Guide
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl items-center">
            <div
              className="aspect-[4/3] overflow-hidden bg-canvas-soft order-2 lg:order-1"
            >
              {vehicle.image_url ? (
                <img
                  src={vehicle.image_url}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-display-md text-hairline">
                    {vehicle.name}
                  </span>
                </div>
              )}
            </div>
            <div className="order-1 lg:order-2">
              <Eyebrow className="text-accent mb-sm block">
                {vehicle.segment} · {vehicle.body_type || 'EV'}
              </Eyebrow>
              <h1 className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] mb-lg">
                {vehicle.name}
              </h1>
              {vehicle.rating > 0 && (
                <div className="mb-lg">
                  <StarRating rating={vehicle.rating} size="lg" />
                </div>
              )}
              {vehicle.review_excerpt && (
                <p className="font-serif-body text-body-serif-lg text-body leading-relaxed mb-xl max-w-[500px]">
                  "{vehicle.review_excerpt}"
                </p>
              )}
              <div className="flex flex-wrap gap-lg">
                <Button to="/consumers/compare">Compare</Button>
                <Button to="/consumers/buyers-guide" variant="outline">
                  All Vehicles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs + pros/cons */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-3xl">
          {/* Spec grid */}
          <div>
            <div className="border-b border-ink pb-md mb-xl">
              <Eyebrow>Specifications</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mt-xs">
                The Numbers
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3xl">
              <SpecRow
                icon={Gauge}
                label="Range"
                value={vehicle.range_km ? `${vehicle.range_km} km` : '—'}
              />
              <SpecRow
                icon={Battery}
                label="Battery"
                value={vehicle.battery_kwh ? `${vehicle.battery_kwh} kWh` : '—'}
              />
              <SpecRow
                icon={Zap}
                label="Charge Time"
                value={vehicle.charge_time_hrs || '—'}
              />
              <SpecRow
                icon={Gauge}
                label="Top Speed"
                value={vehicle.top_speed_kmph ? `${vehicle.top_speed_kmph} km/h` : '—'}
              />
              <SpecRow
                icon={Users}
                label="Seating"
                value={vehicle.seating ? `${vehicle.seating} seats` : '—'}
              />
              <SpecRow
                icon={IndianRupee}
                label="Price"
                value={formatPrice(vehicle.price_inr)}
              />
              <SpecRow
                icon={Car}
                label="Body Type"
                value={vehicle.body_type || '—'}
              />
              <SpecRow
                icon={Calendar}
                label="Launch Date"
                value={vehicle.launch_date ? formatDate(vehicle.launch_date) : '—'}
              />
            </div>
          </div>

          {/* Pros / cons */}
          <div className="space-y-3xl">
            {(vehicle.pros.length > 0 || vehicle.cons.length > 0) && (
              <>
                {/* Pros */}
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
                    {vehicle.pros.length > 0 ? (
                      vehicle.pros.map((p, i) => (
                        <li key={i} className="flex gap-md items-start">
                          <Check className="w-[16px] h-[16px] text-ink flex-shrink-0 mt-xs" />
                          <span className="font-serif-body text-body-serif-md text-ink leading-snug">
                            {p}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="font-serif-body text-body-serif-md text-body">—</li>
                    )}
                  </ul>
                </div>

                {/* Cons */}
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
                    {vehicle.cons.length > 0 ? (
                      vehicle.cons.map((c, i) => (
                        <li key={i} className="flex gap-md items-start">
                          <X className="w-[16px] h-[16px] text-body flex-shrink-0 mt-xs" />
                          <span className="font-serif-body text-body-serif-md text-ink leading-snug">
                            {c}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="font-serif-body text-body-serif-md text-body">—</li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Reviews for this vehicle */}
      {reviews.length > 0 && (
        <section className="bg-canvas-soft border-y border-hairline py-4xl">
          <div className="mx-auto max-w-editorial px-xl">
            <div className="flex items-end justify-between border-b border-ink pb-md mb-xl">
              <div>
                <Eyebrow className="mb-xs block">Reviews</Eyebrow>
                <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px]">
                  What People Say
                </h2>
              </div>
              <Link
                to="/consumers/reviews"
                className="font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-link hover:text-ink transition-colors whitespace-nowrap"
              >
                All Reviews &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
              {reviews.map((r) => (
                <Link
                  key={r.id}
                  to={`/reviews/${r.slug}`}
                  className="group block bg-canvas border border-hairline hover:border-ink transition-colors p-lg"
                >
                  <div className="flex items-center justify-between mb-xs">
                    <Tag>{r.review_type}</Tag>
                    <StarRating rating={r.rating} size="sm" />
                  </div>
                  <h3 className="font-display text-[18px] leading-[1.2] tracking-[-0.2px] mb-xs group-hover:text-body transition-colors">
                    {r.title}
                  </h3>
                  <p className="font-serif-body text-body-serif-md text-body line-clamp-2 mb-sm">
                    {r.excerpt}
                  </p>
                  <Eyebrow className="block">
                    {r.author} · {formatDate(r.published_at)}
                  </Eyebrow>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Compare CTA */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <div className="bg-ink text-on-primary p-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-xl">
          <div>
            <Eyebrow className="text-canvas-soft mb-xs block">Compare</Eyebrow>
            <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] text-on-primary">
              Stack {vehicle.name} against the competition
            </h2>
          </div>
          <Button to="/consumers/compare" variant="secondary" className="whitespace-nowrap">
            Open Compare Tool
          </Button>
        </div>
      </section>
    </div>
  );
}
