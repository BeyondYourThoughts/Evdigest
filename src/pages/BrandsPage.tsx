import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Bike, Car, Truck, X, Building2, MapPin,
} from 'lucide-react';
import { getBrands } from '../lib/queries';
import type { Brand, Segment } from '../lib/types';
import {
  Eyebrow, Button, Tag, formatNumber,
} from '../components/ui/Primitives';

const SEGMENTS: Segment[] = ['2W', '3W', 'Cars', 'Commercial'];

const SEGMENT_META: Record<Segment, { label: string; icon: typeof Car }> = {
  '2W': { label: 'Two-Wheelers', icon: Bike },
  '3W': { label: 'Three-Wheelers', icon: Car },
  Cars: { label: 'Electric Cars', icon: Car },
  Commercial: { label: 'Commercial', icon: Truck },
};

export function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [activeSegment, setActiveSegment] = useState<Segment | 'all'>('all');

  useEffect(() => {
    getBrands()
      .then((b) => {
        setBrands(b);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
    window.scrollTo(0, 0);
  }, []);

  const segmentCounts = useMemo(() => {
    const counts: Record<Segment, number> = { '2W': 0, '3W': 0, Cars: 0, Commercial: 0 };
    brands.forEach((b) => {
      counts[b.segment] = (counts[b.segment] || 0) + 1;
    });
    return counts;
  }, [brands]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return brands.filter((b) => {
      if (activeSegment !== 'all' && b.segment !== activeSegment) return false;
      if (q && !b.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [brands, search, activeSegment]);

  const totalVehicles = useMemo(
    () => brands.reduce((sum, b) => sum + b.vehicle_count, 0),
    [brands]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[320px] bg-canvas-soft" />
          <div className="h-[56px] bg-canvas-soft w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-xl">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[220px] bg-canvas-soft" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <p className="font-serif-body text-body-serif-lg text-body">
          Could not load brands. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* Page hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <Eyebrow className="text-canvas-soft mb-md block">Manufacturers</Eyebrow>
          <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
            EV Brands in India
          </h1>
          <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[680px]">
            Every electric vehicle manufacturer operating in India — from
            two-wheeler startups to legacy automakers. Browse by segment, search
            by name, and dive into each brand's lineup, history, and charging
            network.
          </p>
          <div className="flex items-center gap-xl mt-2xl">
            <div>
              <p className="font-display text-display-sm text-on-primary">
                {brands.length}
              </p>
              <Eyebrow className="text-canvas-soft block">Brands</Eyebrow>
            </div>
            <div className="w-px h-[40px] bg-ink-soft" />
            <div>
              <p className="font-display text-display-sm text-on-primary">
                {formatNumber(totalVehicles)}
              </p>
              <Eyebrow className="text-canvas-soft block">Total Models</Eyebrow>
            </div>
            <div className="w-px h-[40px] bg-ink-soft" />
            <div>
              <p className="font-display text-display-sm text-on-primary">4</p>
              <Eyebrow className="text-canvas-soft block">Segments</Eyebrow>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-3xl max-w-[520px]">
            <div className="flex items-center gap-md bg-ink-soft border border-ink-soft focus-within:border-canvas-soft transition-colors px-lg py-md">
              <Search className="w-[18px] h-[18px] text-canvas-soft flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brands by name…"
                className="flex-1 bg-transparent text-on-primary font-serif-body text-body-serif-md placeholder:text-canvas-soft focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-canvas-soft hover:text-on-primary transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-[16px] h-[16px]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Segment tabs */}
      <section className="border-b border-hairline sticky top-0 bg-canvas z-10">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex items-center gap-xxs overflow-x-auto no-scrollbar">
            <SegmentTab
              active={activeSegment === 'all'}
              onClick={() => setActiveSegment('all')}
              label="All"
              count={brands.length}
            />
            {SEGMENTS.map((seg) => (
              <SegmentTab
                key={seg}
                active={activeSegment === seg}
                onClick={() => setActiveSegment(seg)}
                label={seg}
                count={segmentCounts[seg]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brand grid */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <div className="flex items-end justify-between border-b border-ink pb-md mb-xl">
          <div>
            <Eyebrow className="mb-xs block">
              {activeSegment === 'all'
                ? 'All Segments'
                : SEGMENT_META[activeSegment].label}
            </Eyebrow>
            <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px]">
              {filtered.length} {filtered.length === 1 ? 'Brand' : 'Brands'}
            </h2>
          </div>
          {search && (
            <span className="font-sans-label text-body-sm text-body whitespace-nowrap">
              Matching "{search}"
            </span>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-xl">
            {filtered.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        ) : (
          <div className="border border-hairline py-6xl text-center">
            <Building2 className="w-[40px] h-[40px] text-hairline mx-auto mb-lg" />
            <h3 className="font-display text-display-sm mb-sm">No brands found</h3>
            <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[400px] mx-auto">
              No brands match your search{activeSegment !== 'all' ? ' in this segment' : ''}.
              Try a different name or segment.
            </p>
            <Button
              onClick={() => {
                setSearch('');
                setActiveSegment('all');
              }}
              variant="outline"
              size="sm"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function SegmentTab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-baseline gap-sm py-lg pr-xl whitespace-nowrap border-b-2 transition-colors ${
        active
          ? 'border-ink text-ink'
          : 'border-transparent text-body hover:text-ink'
      }`}
    >
      <span className="font-sans-label text-body-md-strong uppercase tracking-[0.3px]">
        {label}
      </span>
      <span
        className={`font-sans-label text-caption ${
          active ? 'text-ink' : 'text-body'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      to={`/brands/${brand.slug}`}
      className="group block border border-hairline hover:border-ink transition-colors bg-canvas"
    >
      {/* Letter-based logo */}
      <div className="aspect-[16/10] bg-ink flex items-center justify-center relative overflow-hidden">
        {brand.cover_url ? (
          <img
            src={brand.cover_url}
            alt={brand.name}
            className="w-full h-full object-cover opacity-60 group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
        ) : null}
        <span className="font-display text-display-lg text-on-primary leading-none relative z-10 group-hover:scale-105 transition-transform duration-300">
          {brand.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Body */}
      <div className="p-lg">
        <div className="flex items-center justify-between mb-xs">
          <Tag>{brand.segment}</Tag>
          <span className="font-sans-label text-caption text-body">
            {brand.vehicle_count} {brand.vehicle_count === 1 ? 'model' : 'models'}
          </span>
        </div>
        <h3 className="font-display text-display-xs leading-[1.2] tracking-[-0.2px] mb-xs group-hover:text-body transition-colors">
          {brand.name}
        </h3>
        {brand.tagline && (
          <p className="font-serif-body text-body-serif-md text-body line-clamp-2 leading-snug">
            {brand.tagline}
          </p>
        )}
        <div className="flex items-center gap-md mt-md pt-md border-t border-hairline">
          {brand.hq_city && (
            <span className="inline-flex items-center gap-xs font-sans-label text-caption text-body">
              <MapPin className="w-[12px] h-[12px]" />
              {brand.hq_city}
            </span>
          )}
          {brand.founded_year && (
            <span className="inline-flex items-center gap-xs font-sans-label text-caption text-body">
              <Building2 className="w-[12px] h-[12px]" />
              Est. {brand.founded_year}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
