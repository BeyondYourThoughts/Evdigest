import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, MapPin, Calendar, Car, Zap,
} from 'lucide-react';
import { getBrandBySlug, getVehiclesByBrand } from '../lib/queries';
import type { Brand, Vehicle, VehicleWithBrand } from '../lib/types';
import {
  Eyebrow, Button,
} from '../components/ui/Primitives';
import { VehicleCard } from '../components/Cards';

export function BrandDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    getBrandBySlug(slug)
      .then(async (b) => {
        if (!b) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setBrand(b);
        try {
          const v = await getVehiclesByBrand(b.id);
          setVehicles(v);
        } catch {
          setVehicles([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
    window.scrollTo(0, 0);
  }, [slug]);

  // Attach brand info so VehicleCard (which expects VehicleWithBrand) works.
  const vehiclesWithBrand: VehicleWithBrand[] = brand
    ? vehicles.map((v) => ({ ...v, brand: { name: brand.name, slug: brand.slug } }))
    : [];

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[360px] bg-canvas-soft" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            <div className="h-[340px] bg-canvas-soft" />
            <div className="h-[340px] bg-canvas-soft" />
            <div className="h-[340px] bg-canvas-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !brand) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-6xl text-center">
        <Eyebrow className="text-accent mb-md block">404</Eyebrow>
        <h1 className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] mb-lg">
          Brand not found
        </h1>
        <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[500px] mx-auto">
          The brand you're looking for isn't in our database yet, or the link may
          be out of date.
        </p>
        <Button to="/brands">Browse All Brands</Button>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* Brand hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <Link
            to="/brands"
            className="inline-flex items-center gap-sm font-sans-label text-body-sm uppercase tracking-[0.4px] text-canvas-soft hover:text-on-primary transition-colors mb-xl"
          >
            <ArrowLeft className="w-[14px] h-[14px]" />
            All Brands
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3xl items-end">
            <div>
              <Eyebrow className="text-canvas-soft mb-md block">{brand.segment}</Eyebrow>
              <div className="flex items-center gap-3xl mb-lg">
                <span className="font-display text-display-hero leading-[0.9] tracking-[-0.5px] text-on-primary">
                  {brand.name.charAt(0).toUpperCase()}
                </span>
                <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] text-on-primary">
                  {brand.name}
                </h1>
              </div>
              {brand.tagline && (
                <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[680px]">
                  {brand.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Stat row */}
          <div className="flex flex-wrap items-center gap-xl mt-3xl pt-3xl border-t border-ink-soft">
            {brand.founded_year && (
              <div className="flex items-center gap-sm">
                <Calendar className="w-[18px] h-[18px] text-canvas-soft" />
                <div>
                  <p className="font-display text-display-sm text-on-primary leading-none">
                    {brand.founded_year}
                  </p>
                  <Eyebrow className="text-canvas-soft block mt-xs">Founded</Eyebrow>
                </div>
              </div>
            )}
            {brand.hq_city && (
              <>
                <div className="w-px h-[40px] bg-ink-soft" />
                <div className="flex items-center gap-sm">
                  <MapPin className="w-[18px] h-[18px] text-canvas-soft" />
                  <div>
                    <p className="font-display text-display-sm text-on-primary leading-none">
                      {brand.hq_city}
                    </p>
                    <Eyebrow className="text-canvas-soft block mt-xs">Headquarters</Eyebrow>
                  </div>
                </div>
              </>
            )}
            <div className="w-px h-[40px] bg-ink-soft" />
            <div className="flex items-center gap-sm">
              <Car className="w-[18px] h-[18px] text-canvas-soft" />
              <div>
                <p className="font-display text-display-sm text-on-primary leading-none">
                  {brand.vehicle_count}
                </p>
                <Eyebrow className="text-canvas-soft block mt-xs">
                  {brand.vehicle_count === 1 ? 'Model' : 'Models'}
                </Eyebrow>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the brand */}
      {brand.description && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3xl">
            <div>
              <Eyebrow className="mb-sm block">About</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] border-b border-ink pb-md">
                The Story
              </h2>
            </div>
            <div>
              <p className="font-serif-body text-body-serif-lg text-ink leading-relaxed">
                {brand.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Vehicle lineup */}
      <section className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex items-end justify-between border-b border-ink pb-md mb-xl">
            <div>
              <Eyebrow className="mb-xs block">Lineup</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px]">
                {brand.name} Vehicles
              </h2>
            </div>
            <span className="font-sans-label text-body-sm text-body whitespace-nowrap">
              {vehicles.length} {vehicles.length === 1 ? 'model' : 'models'}
            </span>
          </div>

          {vehiclesWithBrand.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
              {vehiclesWithBrand.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          ) : (
            <div className="border border-hairline bg-canvas py-6xl text-center">
              <Car className="w-[40px] h-[40px] text-hairline mx-auto mb-lg" />
              <h3 className="font-display text-display-sm mb-sm">No models listed yet</h3>
              <p className="font-serif-body text-body-serif-md text-body max-w-[400px] mx-auto">
                We're still cataloguing {brand.name}'s vehicle lineup. Check back
                soon for full specs and reviews.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Charging network */}
      {brand.charging_network_info && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3xl">
            <div>
              <Eyebrow className="mb-sm block">Infrastructure</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] border-b border-ink pb-md">
                Charging Network
              </h2>
              <div className="flex items-center gap-sm mt-lg">
                <div className="w-[40px] h-[40px] bg-ink text-on-primary flex items-center justify-center">
                  <Zap className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <p className="font-sans-label text-body-sm-strong text-ink">
                    {brand.name} Network
                  </p>
                  <p className="font-sans-label text-caption text-body">
                    Brand-supported charging
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-serif-body text-body-serif-lg text-ink leading-relaxed">
                {brand.charging_network_info}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA strip */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-xl">
            <div>
              <Eyebrow className="text-canvas-soft mb-xs block">Keep Exploring</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] text-on-primary">
                Compare {brand.name} models with the rest
              </h2>
            </div>
            <div className="flex flex-wrap gap-md">
              <Button to="/consumers/compare" variant="secondary" className="whitespace-nowrap">
                Compare Tool
              </Button>
              <Button to="/brands" variant="secondary" className="whitespace-nowrap">
                All Brands <ArrowRight className="w-[16px] h-[16px] ml-sm" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
