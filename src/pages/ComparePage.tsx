import { useEffect, useMemo, useState } from 'react';
import {
  GitCompare, Car, Trophy, Battery, Zap, Gauge,
  Users, Banknote, Star, Crown, ArrowRight, Check,
} from 'lucide-react';
import { getVehicles } from '../lib/queries';
import type { VehicleWithBrand } from '../lib/types';
import {
  Eyebrow, SectionHeading, Button, StarRating, formatPrice, formatNumber,
} from '../components/ui/Primitives';

type SlotValue = string | '';

interface SpecRow {
  key: string;
  label: string;
  icon: typeof Battery;
  accessor: (v: VehicleWithBrand) => number | string | null;
  format: (v: VehicleWithBrand) => string;
  numeric: (v: VehicleWithBrand) => number | null;
  best: 'max' | 'min';
}

export function ComparePage() {
  const [vehicles, setVehicles] = useState<VehicleWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<[SlotValue, SlotValue, SlotValue]>(['', '', '']);
  const [error, setError] = useState(false);

  useEffect(() => {
    getVehicles()
      .then((v) => {
        setVehicles(v);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
    window.scrollTo(0, 0);
  }, []);

  const selectedVehicles = useMemo(() => {
    return slots
      .map((id) => vehicles.find((v) => v.id === id))
      .filter((v): v is VehicleWithBrand => v !== undefined);
  }, [slots, vehicles]);

  const specRows: SpecRow[] = [
    {
      key: 'range_km',
      label: 'Range',
      icon: Zap,
      accessor: (v) => v.range_km,
      format: (v) => (v.range_km != null ? `${formatNumber(v.range_km)} km` : '—'),
      numeric: (v) => v.range_km,
      best: 'max',
    },
    {
      key: 'battery_kwh',
      label: 'Battery',
      icon: Battery,
      accessor: (v) => v.battery_kwh,
      format: (v) => (v.battery_kwh != null ? `${v.battery_kwh} kWh` : '—'),
      numeric: (v) => v.battery_kwh,
      best: 'max',
    },
    {
      key: 'price_inr',
      label: 'Price',
      icon: Banknote,
      accessor: (v) => v.price_inr,
      format: (v) => formatPrice(v.price_inr),
      numeric: (v) => v.price_inr,
      best: 'min',
    },
    {
      key: 'charge_time_hrs',
      label: 'Charge Time',
      icon: Gauge,
      accessor: (v) => v.charge_time_hrs,
      format: (v) => v.charge_time_hrs || '—',
      numeric: (v) => {
        const n = parseFloat(v.charge_time_hrs || '');
        return isNaN(n) ? null : n;
      },
      best: 'min',
    },
    {
      key: 'top_speed_kmph',
      label: 'Top Speed',
      icon: Gauge,
      accessor: (v) => v.top_speed_kmph,
      format: (v) => (v.top_speed_kmph != null ? `${v.top_speed_kmph} km/h` : '—'),
      numeric: (v) => v.top_speed_kmph,
      best: 'max',
    },
    {
      key: 'seating',
      label: 'Seating',
      icon: Users,
      accessor: (v) => v.seating,
      format: (v) => (v.seating != null ? `${v.seating} seats` : '—'),
      numeric: (v) => v.seating,
      best: 'max',
    },
    {
      key: 'body_type',
      label: 'Body Type',
      icon: Car,
      accessor: (v) => v.body_type,
      format: (v) => v.body_type || '—',
      numeric: () => null,
      best: 'max',
    },
    {
      key: 'rating',
      label: 'Rating',
      icon: Star,
      accessor: (v) => v.rating,
      format: (v) => (v.rating > 0 ? v.rating.toFixed(1) : '—'),
      numeric: (v) => v.rating,
      best: 'max',
    },
  ];

  const bestIndexForRow = (row: SpecRow): number | null => {
    if (row.best === 'max') {
      let bestVal = -Infinity;
      let bestIdx: number | null = null;
      selectedVehicles.forEach((v, i) => {
        const n = row.numeric(v);
        if (n != null && n > bestVal) {
          bestVal = n;
          bestIdx = i;
        }
      });
      return bestIdx;
    } else {
      let bestVal = Infinity;
      let bestIdx: number | null = null;
      selectedVehicles.forEach((v, i) => {
        const n = row.numeric(v);
        if (n != null && n < bestVal) {
          bestVal = n;
          bestIdx = i;
        }
      });
      return bestIdx;
    }
  };

  const verdicts = useMemo(() => {
    if (selectedVehicles.length < 2) return [];
    const result: { label: string; vehicle: VehicleWithBrand }[] = [];
    const rangeRow = specRows[0];
    const priceRow = specRows[2];
    const ratingRow = specRows[7];

    const rangeBest = bestIndexForRow(rangeRow);
    if (rangeBest != null) {
      result.push({ label: 'Best Range', vehicle: selectedVehicles[rangeBest] });
    }
    const priceBest = bestIndexForRow(priceRow);
    if (priceBest != null) {
      result.push({ label: 'Best Value', vehicle: selectedVehicles[priceBest] });
    }
    const ratingBest = bestIndexForRow(ratingRow);
    if (ratingBest != null) {
      result.push({ label: 'Highest Rated', vehicle: selectedVehicles[ratingBest] });
    }
    return result;
  }, [selectedVehicles]);

  const availableForSlot = (slotIdx: number) =>
    vehicles.filter((v) => !slots.includes(v.id) || slots[slotIdx] === v.id);

  const clearAll = () => setSlots(['', '', '']);

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[260px] bg-canvas-soft" />
          <div className="grid grid-cols-3 gap-xl">
            <div className="h-[80px] bg-canvas-soft" />
            <div className="h-[80px] bg-canvas-soft" />
            <div className="h-[80px] bg-canvas-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <p className="font-serif-body text-body-serif-lg text-body">
          Could not load vehicle data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* Page hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <Eyebrow className="text-canvas-soft mb-md block">For Consumers · Tools</Eyebrow>
          <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
            Compare Vehicles
          </h1>
          <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[680px]">
            Pick up to three electric vehicles and see their specs side-by-side.
            We automatically highlight the best value in each category so you can
            decide with confidence.
          </p>
          <div className="flex items-center gap-xl mt-2xl">
            <div>
              <p className="font-display text-display-sm text-on-primary">{vehicles.length}</p>
              <Eyebrow className="text-canvas-soft block">Vehicles</Eyebrow>
            </div>
            <div className="w-px h-[40px] bg-ink-soft" />
            <div>
              <p className="font-display text-display-sm text-on-primary">3</p>
              <Eyebrow className="text-canvas-soft block">Max Slots</Eyebrow>
            </div>
            <div className="w-px h-[40px] bg-ink-soft" />
            <div>
              <p className="font-display text-display-sm text-on-primary">8</p>
              <Eyebrow className="text-canvas-soft block">Specs Compared</Eyebrow>
            </div>
          </div>
        </div>
      </section>

      {/* Selector slots */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-editorial px-xl py-xl">
          <div className="flex items-center justify-between mb-lg">
            <div className="flex items-center gap-sm">
              <GitCompare className="w-[20px] h-[20px] text-ink" />
              <h2 className="font-sans-label text-body-md-strong uppercase tracking-[0.3px] text-ink">
                Select Vehicles to Compare
              </h2>
            </div>
            {(slots.some((s) => s !== '')) && (
              <button
                onClick={clearAll}
                className="font-sans-label text-body-sm uppercase tracking-[0.3px] text-link hover:text-ink transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border border-hairline bg-canvas-soft p-lg">
                <label className="font-sans-label text-caption uppercase tracking-[0.4px] text-body block mb-sm">
                  Slot {i + 1}
                </label>
                <select
                  value={slots[i]}
                  onChange={(e) => {
                    const next = [...slots] as [SlotValue, SlotValue, SlotValue];
                    next[i] = e.target.value;
                    setSlots(next);
                  }}
                  className="w-full bg-canvas border border-hairline px-lg py-md font-sans-label text-body-sm text-ink focus:border-ink transition-colors"
                >
                  <option value="">— Select a vehicle —</option>
                  {availableForSlot(i).map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand?.name} {v.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        {selectedVehicles.length >= 2 ? (
          <>
            <SectionHeading
              eyebrow="Side-by-Side"
              title="Specification Comparison"
            />

            {/* Vehicle header cards */}
            <div
              className="grid gap-lg mb-xl"
              style={{
                gridTemplateColumns: `200px repeat(${selectedVehicles.length}, 1fr)`,
              }}
            >
              <div />
              {selectedVehicles.map((v) => (
                <div key={v.id} className="border border-ink p-lg bg-canvas">
                  <Eyebrow className="block mb-xs">{v.brand?.name}</Eyebrow>
                  <h3 className="font-display text-[20px] leading-[1.15] tracking-[-0.2px] mb-sm">
                    {v.name}
                  </h3>
                  {v.image_url ? (
                    <div className="aspect-[16/10] overflow-hidden bg-canvas-soft mb-sm">
                      <img
                        src={v.image_url}
                        alt={v.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-canvas-soft flex items-center justify-center mb-sm">
                      <Car className="w-[32px] h-[32px] text-hairline" />
                    </div>
                  )}
                  {v.rating > 0 && <StarRating rating={v.rating} size="sm" />}
                </div>
              ))}
            </div>

            {/* Spec rows */}
            <div className="border border-hairline">
              {specRows.map((row, rowIdx) => {
                const bestIdx = bestIndexForRow(row);
                const Icon = row.icon;
                return (
                  <div
                    key={row.key}
                    className={`grid gap-0 ${
                      rowIdx % 2 === 0 ? 'bg-canvas' : 'bg-canvas-soft'
                    } border-b border-hairline last:border-b-0`}
                    style={{
                      gridTemplateColumns: `200px repeat(${selectedVehicles.length}, 1fr)`,
                    }}
                  >
                    <div className="flex items-center gap-sm p-lg border-r border-hairline">
                      <Icon className="w-[16px] h-[16px] text-body flex-shrink-0" />
                      <span className="font-sans-label text-body-sm-strong text-ink uppercase tracking-[0.3px]">
                        {row.label}
                      </span>
                    </div>
                    {selectedVehicles.map((v, vIdx) => {
                      const isBest = bestIdx === vIdx;
                      return (
                        <div
                          key={v.id}
                          className={`p-lg flex items-center gap-sm ${
                            isBest ? 'bg-ink/[0.04]' : ''
                          }`}
                        >
                          <span
                            className={`font-sans-label text-body-md ${
                              isBest ? 'text-ink font-semibold' : 'text-ink'
                            }`}
                          >
                            {row.format(v)}
                          </span>
                          {isBest && (
                            <span className="inline-flex items-center gap-xxs font-sans-label text-caption uppercase tracking-[0.3px] text-accent">
                              <Crown className="w-[12px] h-[12px]" /> Best
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Verdict callout */}
            {verdicts.length > 0 && (
              <div className="mt-3xl border border-ink bg-canvas-soft p-3xl">
                <div className="flex items-center gap-sm mb-xl border-b border-ink pb-md">
                  <Trophy className="w-[24px] h-[24px] text-ink" />
                  <h3 className="font-display text-display-sm leading-[1.1] tracking-[-0.28px]">
                    The Verdict
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
                  {verdicts.map((vd, i) => (
                    <div key={i} className="bg-canvas border border-hairline p-xl">
                      <Eyebrow className="text-accent block mb-sm">{vd.label}</Eyebrow>
                      <p className="font-display text-[20px] leading-[1.15] tracking-[-0.2px] mb-sm">
                        {vd.vehicle.name}
                      </p>
                      <div className="flex items-center gap-sm">
                        <Check className="w-[14px] h-[14px] text-ink" />
                        <span className="font-serif-body text-body-serif-md text-body">
                          {vd.label === 'Best Range' && vd.vehicle.range_km != null
                            ? `${formatNumber(vd.vehicle.range_km)} km on a single charge`
                            : vd.label === 'Best Value'
                              ? `${formatPrice(vd.vehicle.price_inr)} — lowest in this set`
                              : `${vd.vehicle.rating.toFixed(1)} / 5 expert rating`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="border border-hairline py-6xl text-center">
            <GitCompare className="w-[48px] h-[48px] text-hairline mx-auto mb-xl" />
            <h3 className="font-display text-display-sm mb-sm">Select vehicles to compare</h3>
            <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[440px] mx-auto">
              Choose at least two vehicles from the dropdowns above to see a detailed
              side-by-side specification comparison with our best-value highlights.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-md">
              {vehicles.slice(0, 4).map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    const emptyIdx = slots.findIndex((s) => s === '');
                    if (emptyIdx !== -1) {
                      const next = [...slots] as [SlotValue, SlotValue, SlotValue];
                      next[emptyIdx] = v.id;
                      setSlots(next);
                    }
                  }}
                  className="font-sans-label text-body-sm uppercase tracking-[0.3px] border border-hairline px-lg py-sm hover:border-ink hover:bg-canvas-soft transition-colors"
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CTA strip */}
      <section className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-xl">
            <div>
              <Eyebrow className="mb-xs block">Need more detail?</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-sm">
                Read the full expert reviews.
              </h2>
              <p className="font-serif-body text-body-serif-md text-body leading-snug max-w-[520px]">
                Each vehicle has an in-depth review covering real-world range, charging
                behaviour, and long-term ownership costs.
              </p>
            </div>
            <Button to="/consumers/reviews" className="whitespace-nowrap">
              Browse Reviews <ArrowRight className="w-[16px] h-[16px] ml-sm" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
