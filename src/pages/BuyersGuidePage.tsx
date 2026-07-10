import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, SlidersHorizontal, Car } from 'lucide-react';
import { getVehicles } from '../lib/queries';
import type { VehicleWithBrand, Segment } from '../lib/types';
import {
  Eyebrow, Button,
} from '../components/ui/Primitives';
import { VehicleCard } from '../components/Cards';

const SEGMENTS: Segment[] = ['2W', '3W', 'Cars', 'Commercial'];

const PRICE_RANGES = [
  { label: 'Any price', min: 0, max: Infinity },
  { label: 'Under Rs 1 L', min: 0, max: 100000 },
  { label: 'Rs 1–5 L', min: 100000, max: 500000 },
  { label: 'Rs 5–15 L', min: 500000, max: 1500000 },
  { label: 'Rs 15–40 L', min: 1500000, max: 40000000 },
  { label: 'Over Rs 40 L', min: 40000000, max: Infinity },
];

const RANGE_OPTIONS = [
  { label: 'Any range', min: 0 },
  { label: '100+ km', min: 100 },
  { label: '200+ km', min: 200 },
  { label: '300+ km', min: 300 },
  { label: '400+ km', min: 400 },
];

export function BuyersGuidePage() {
  const [vehicles, setVehicles] = useState<VehicleWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSegment, setActiveSegment] = useState<Segment>('Cars');
  const [priceIdx, setPriceIdx] = useState(0);
  const [rangeIdx, setRangeIdx] = useState(0);
  const [brandFilter, setBrandFilter] = useState('all');

  useEffect(() => {
    getVehicles()
      .then((v) => {
        setVehicles(v);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, []);

  // Distinct brands within the active segment for the brand dropdown
  const segmentBrands = useMemo(() => {
    const set = new Map<string, string>();
    vehicles
      .filter((v) => v.segment === activeSegment)
      .forEach((v) => {
        if (v.brand?.name) set.set(v.brand.name, v.brand.name);
      });
    return Array.from(set.values()).sort();
  }, [vehicles, activeSegment]);

  const segmentCounts = useMemo(() => {
    const counts: Record<Segment, number> = { '2W': 0, '3W': 0, Cars: 0, Commercial: 0 };
    vehicles.forEach((v) => {
      counts[v.segment] = (counts[v.segment] || 0) + 1;
    });
    return counts;
  }, [vehicles]);

  const filtered = useMemo(() => {
    const price = PRICE_RANGES[priceIdx];
    const range = RANGE_OPTIONS[rangeIdx];
    return vehicles.filter((v) => {
      if (v.segment !== activeSegment) return false;
      if (brandFilter !== 'all' && v.brand?.name !== brandFilter) return false;
      if (v.price_inr != null && (v.price_inr < price.min || v.price_inr > price.max)) return false;
      if (v.range_km != null && v.range_km < range.min) return false;
      return true;
    });
  }, [vehicles, activeSegment, priceIdx, rangeIdx, brandFilter]);

  const resetFilters = () => {
    setPriceIdx(0);
    setRangeIdx(0);
    setBrandFilter('all');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[280px] bg-canvas-soft" />
          <div className="h-[48px] bg-canvas-soft w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            <div className="h-[340px] bg-canvas-soft" />
            <div className="h-[340px] bg-canvas-soft" />
            <div className="h-[340px] bg-canvas-soft" />
          </div>
        </div>
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
            EV Buyers Guide
          </h1>
          <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[680px]">
            Every electric vehicle on sale in India, compared by range, price,
            battery, and real-world reviews. Filter by segment, budget, and
            brand to find the right EV for you.
          </p>
          <div className="flex items-center gap-xl mt-2xl">
            <div>
              <p className="font-display text-display-sm text-on-primary">
                {vehicles.length}
              </p>
              <Eyebrow className="text-canvas-soft block">Vehicles</Eyebrow>
            </div>
            <div className="w-px h-[40px] bg-ink-soft" />
            <div>
              <p className="font-display text-display-sm text-on-primary">
                {segmentBrands.length}
              </p>
              <Eyebrow className="text-canvas-soft block">Brands</Eyebrow>
            </div>
            <div className="w-px h-[40px] bg-ink-soft" />
            <div>
              <p className="font-display text-display-sm text-on-primary">4</p>
              <Eyebrow className="text-canvas-soft block">Segments</Eyebrow>
            </div>
          </div>
        </div>
      </section>

      {/* Segment tabs */}
      <section className="border-b border-hairline sticky top-0 bg-canvas z-10">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex items-center gap-xxs overflow-x-auto no-scrollbar">
            {SEGMENTS.map((seg) => {
              const active = seg === activeSegment;
              return (
                <button
                  key={seg}
                  onClick={() => {
                    setActiveSegment(seg);
                    setBrandFilter('all');
                  }}
                  className={`group flex items-baseline gap-sm py-lg pr-xl whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? 'border-ink text-ink'
                      : 'border-transparent text-body hover:text-ink'
                  }`}
                >
                  <span className="font-sans-label text-body-md-strong uppercase tracking-[0.3px]">
                    {seg}
                  </span>
                  <span
                    className={`font-sans-label text-caption ${
                      active ? 'text-ink' : 'text-body'
                    }`}
                  >
                    {segmentCounts[seg]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main: sidebar + grid */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-3xl">
          {/* Filter sidebar */}
          <aside className="lg:sticky lg:top-[72px] self-start">
            <div className="flex items-center gap-sm border-b border-ink pb-md mb-xl">
              <SlidersHorizontal className="w-[16px] h-[16px] text-ink" />
              <h2 className="font-sans-label text-body-md-strong text-ink uppercase tracking-[0.3px]">
                Filters
              </h2>
            </div>

            <div className="space-y-xl">
              {/* Price range */}
              <div>
                <label className="font-sans-label text-caption uppercase tracking-[0.4px] text-body block mb-sm">
                  Price range
                </label>
                <select
                  value={priceIdx}
                  onChange={(e) => setPriceIdx(Number(e.target.value))}
                  className="w-full bg-canvas border border-hairline px-lg py-md font-sans-label text-body-sm text-ink focus:border-ink transition-colors"
                >
                  {PRICE_RANGES.map((p, i) => (
                    <option key={i} value={i}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Range */}
              <div>
                <label className="font-sans-label text-caption uppercase tracking-[0.4px] text-body block mb-sm">
                  Min. range
                </label>
                <select
                  value={rangeIdx}
                  onChange={(e) => setRangeIdx(Number(e.target.value))}
                  className="w-full bg-canvas border border-hairline px-lg py-md font-sans-label text-body-sm text-ink focus:border-ink transition-colors"
                >
                  {RANGE_OPTIONS.map((r, i) => (
                    <option key={i} value={i}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="font-sans-label text-caption uppercase tracking-[0.4px] text-body block mb-sm">
                  Brand
                </label>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="w-full bg-canvas border border-hairline px-lg py-md font-sans-label text-body-sm text-ink focus:border-ink transition-colors"
                >
                  <option value="all">All brands</option>
                  {segmentBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="font-sans-label text-body-sm uppercase tracking-[0.3px] text-link hover:text-ink transition-colors"
              >
                Reset filters
              </button>
            </div>

            {/* Quick stat */}
            <div className="mt-3xl p-lg bg-canvas-soft border-l-4 border-ink">
              <Eyebrow className="block mb-xxs">{activeSegment} segment</Eyebrow>
              <p className="font-display text-display-sm leading-[1.1]">
                {filtered.length}
              </p>
              <p className="font-serif-body text-body-serif-md text-body leading-snug mt-xs">
                {filtered.length === 0
                  ? 'No vehicles match your filters.'
                  : filtered.length === 1
                    ? 'vehicle matches your filters.'
                    : 'vehicles match your filters.'}
              </p>
            </div>
          </aside>

          {/* Vehicle grid */}
          <div>
            <div className="flex items-end justify-between border-b border-ink pb-md mb-xl">
              <div>
                <Eyebrow className="mb-xs block">{activeSegment}</Eyebrow>
                <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px]">
                  {activeSegment === '2W'
                    ? 'Two-Wheelers'
                    : activeSegment === '3W'
                      ? 'Three-Wheelers'
                      : activeSegment === 'Cars'
                        ? 'Electric Cars'
                        : 'Commercial EVs'}
                </h2>
              </div>
              {filtered.length > 0 && (
                <span className="font-sans-label text-body-sm text-body whitespace-nowrap">
                  Showing {filtered.length}
                </span>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
                {filtered.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            ) : (
              <div className="border border-hairline py-6xl text-center">
                <Car className="w-[40px] h-[40px] text-hairline mx-auto mb-lg" />
                <h3 className="font-display text-display-sm mb-sm">No vehicles found</h3>
                <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[400px] mx-auto">
                  Try adjusting your filters — no vehicles in this segment match
                  your current price, range, and brand selections.
                </p>
                <Button onClick={resetFilters} variant="outline" size="sm">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comparison CTA strip */}
      <section className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-xl bg-canvas border border-hairline p-3xl">
            <div className="flex items-start gap-xl">
              <div className="w-[56px] h-[56px] bg-ink text-on-primary flex items-center justify-center flex-shrink-0">
                <SlidersHorizontal className="w-[24px] h-[24px]" />
              </div>
              <div>
                <Eyebrow className="mb-xs block">Compare Side-by-Side</Eyebrow>
                <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-sm">
                  Can't decide? Compare up to 4 vehicles.
                </h2>
                <p className="font-serif-body text-body-serif-md text-body leading-snug max-w-[520px]">
                  Stack range, price, battery, charging, and ratings next to each
                  other to find your best match.
                </p>
              </div>
            </div>
            <Button to="/consumers/compare" className="whitespace-nowrap">
              Open Compare Tool
              <ArrowRight className="w-[16px] h-[16px] ml-sm" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
