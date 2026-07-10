import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, MapPin, Ticket, ArrowRight, Video, Mic, Building, RotateCcw,
} from 'lucide-react';
import { getEvents, getFeaturedEvent } from '../lib/queries';
import type { EVEvent } from '../lib/types';
import {
  Eyebrow, SectionHeading, Button, Tag, formatDate,
} from '../components/ui/Primitives';

type FilterType = 'all' | 'expo' | 'conference' | 'webinar' | 'recap';

const FILTERS: {
  key: FilterType;
  label: string;
  icon: typeof Calendar;
}[] = [
  { key: 'all', label: 'All', icon: Calendar },
  { key: 'expo', label: 'Expos', icon: Building },
  { key: 'conference', label: 'Conferences', icon: Mic },
  { key: 'webinar', label: 'Webinars', icon: Video },
  { key: 'recap', label: 'Recaps', icon: RotateCcw },
];

const TYPE_ICON: Record<EVEvent['type'], typeof Calendar> = {
  expo: Building,
  conference: Mic,
  webinar: Video,
  recap: RotateCcw,
};

export function EventsPage() {
  const [events, setEvents] = useState<EVEvent[]>([]);
  const [featured, setFeatured] = useState<EVEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    Promise.all([getEvents(), getFeaturedEvent()])
      .then(([e, f]) => {
        setEvents(e);
        setFeatured(f);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
    window.scrollTo(0, 0);
  }, []);

  const upcoming = useMemo(() => events.filter((e) => !e.is_past), [events]);
  const past = useMemo(
    () => events.filter((e) => e.is_past).sort((a, b) => b.start_date.localeCompare(a.start_date)),
    [events]
  );

  // If there's a featured event, exclude it from the upcoming list to avoid duplication.
  const upcomingList = useMemo(
    () => (featured ? upcoming.filter((e) => e.id !== featured.id) : upcoming),
    [upcoming, featured]
  );

  const filteredUpcoming = useMemo(() => {
    if (activeFilter === 'all' || activeFilter === 'recap') return upcomingList;
    return upcomingList.filter((e) => e.type === activeFilter);
  }, [upcomingList, activeFilter]);

  const typeCounts = useMemo(() => {
    const counts: Record<FilterType, number> = {
      all: upcomingList.length,
      expo: 0,
      conference: 0,
      webinar: 0,
      recap: past.length,
    };
    upcomingList.forEach((e) => {
      counts[e.type] = (counts[e.type] || 0) + 1;
    });
    return counts;
  }, [upcomingList, past]);

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[320px] bg-canvas-soft" />
          <div className="h-[360px] bg-canvas-soft" />
          <div className="h-[56px] bg-canvas-soft w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            <div className="h-[220px] bg-canvas-soft" />
            <div className="h-[220px] bg-canvas-soft" />
            <div className="h-[220px] bg-canvas-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <p className="font-serif-body text-body-serif-lg text-body">
          Could not load events. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* Page hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <Eyebrow className="text-canvas-soft mb-md block">Calendar</Eyebrow>
          <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
            EV Events in India
          </h1>
          <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[680px]">
            Expos, conferences, webinars, and post-event recaps from across
            India's electric mobility calendar. Register for what's coming, or
            catch up on what you missed.
          </p>
          <div className="flex items-center gap-xl mt-2xl">
            <div>
              <p className="font-display text-display-sm text-on-primary">{upcoming.length}</p>
              <Eyebrow className="text-canvas-soft block">Upcoming</Eyebrow>
            </div>
            <div className="w-px h-[40px] bg-ink-soft" />
            <div>
              <p className="font-display text-display-sm text-on-primary">{past.length}</p>
              <Eyebrow className="text-canvas-soft block">Recaps</Eyebrow>
            </div>
            <div className="w-px h-[40px] bg-ink-soft" />
            <div>
              <p className="font-display text-display-sm text-on-primary">{events.length}</p>
              <Eyebrow className="text-canvas-soft block">Total</Eyebrow>
            </div>
          </div>
        </div>
      </section>

      {/* Featured event */}
      {featured && (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading eyebrow="Don't Miss" title="Featured Event" />
          <FeaturedEventBanner event={featured} />
        </section>
      )}

      {/* Filter pills */}
      <section className="border-y border-hairline sticky top-0 bg-canvas z-10">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex items-center gap-xxs overflow-x-auto no-scrollbar py-lg">
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

      {/* Upcoming events */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <div className="flex items-end justify-between border-b border-ink pb-md mb-xl">
          <div>
            <Eyebrow className="mb-xs block">
              {activeFilter === 'all' ? 'All Upcoming' : FILTERS.find((f) => f.key === activeFilter)?.label}
            </Eyebrow>
            <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px]">
              {filteredUpcoming.length} {filteredUpcoming.length === 1 ? 'Event' : 'Events'}
            </h2>
          </div>
        </div>

        {filteredUpcoming.length > 0 ? (
          <div className="space-y-lg">
            {filteredUpcoming.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <div className="border border-hairline py-6xl text-center">
            <Calendar className="w-[40px] h-[40px] text-hairline mx-auto mb-lg" />
            <h3 className="font-display text-display-sm mb-sm">No upcoming events</h3>
            <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[400px] mx-auto">
              There are no{' '}
              {activeFilter !== 'all'
                ? FILTERS.find((f) => f.key === activeFilter)?.label.toLowerCase()
                : ''}{' '}
              events scheduled right now. Check back soon.
            </p>
            <Button onClick={() => setActiveFilter('all')} variant="outline" size="sm">
              Show All Events
            </Button>
          </div>
        )}
      </section>

      {/* Past recaps */}
      {past.length > 0 && (
        <section className="bg-canvas-soft border-y border-hairline py-4xl">
          <div className="mx-auto max-w-editorial px-xl">
            <SectionHeading eyebrow="Catch Up" title="Past Event Recaps" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
              {past.slice(0, 9).map((e) => (
                <RecapCard key={e.id} event={e} />
              ))}
            </div>
            {past.length > 9 && (
              <div className="mt-xl text-center">
                <Button to="/events" variant="outline" size="sm">
                  View All Recaps <ArrowRight className="w-[16px] h-[16px] ml-sm" />
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA strip */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <div className="bg-ink text-on-primary p-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-xl">
          <div>
            <Eyebrow className="text-canvas-soft mb-xs block">Hosting an event?</Eyebrow>
            <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] text-on-primary">
              Get your EV event listed
            </h2>
            <p className="font-serif-body text-body-serif-md text-canvas-soft mt-sm max-w-[520px]">
              Expos, launches, meetups, or webinars — reach India's EV community
              by adding your event to the EVDigest calendar.
            </p>
          </div>
          <Button href="/contact" variant="secondary" className="whitespace-nowrap">
            Submit an Event <ArrowRight className="w-[16px] h-[16px] ml-sm" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeaturedEventBanner({ event }: { event: EVEvent }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-0 border border-ink">
      <div className="aspect-[16/10] lg:aspect-auto overflow-hidden bg-canvas-soft relative">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ink">
            <Calendar className="w-[64px] h-[64px] text-canvas-soft" />
          </div>
        )}
        <div className="absolute top-lg left-lg">
          <Tag className="bg-on-primary text-ink">Featured</Tag>
        </div>
      </div>
      <div className="p-3xl flex flex-col">
        <div className="flex items-center gap-sm mb-md">
          <Tag>{event.type}</Tag>
          {event.is_past && <Tag className="bg-body">Past</Tag>}
        </div>
        <h3 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-md">
          {event.name}
        </h3>
        {event.description && (
          <p className="font-serif-body text-body-serif-md text-body leading-relaxed line-clamp-4 mb-xl">
            {event.description}
          </p>
        )}
        <div className="space-y-md mb-xl mt-auto">
          <div className="flex items-center gap-md">
            <Calendar className="w-[18px] h-[18px] text-ink flex-shrink-0" />
            <span className="font-sans-label text-body-sm-strong text-ink">
              {formatDate(event.start_date)}
              {event.end_date ? ` — ${formatDate(event.end_date)}` : ''}
            </span>
          </div>
          {event.city && (
            <div className="flex items-center gap-md">
              <MapPin className="w-[18px] h-[18px] text-ink flex-shrink-0" />
              <span className="font-sans-label text-body-sm-strong text-ink">
                {event.city}
                {event.venue ? ` · ${event.venue}` : ''}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-md">
          {event.registration_url && !event.is_past ? (
            <Button href={event.registration_url} className="whitespace-nowrap">
              <Ticket className="w-[16px] h-[16px] mr-sm" />
              Register Now
            </Button>
          ) : null}
          <Button to={`/events/${event.slug}`} variant="outline" className="whitespace-nowrap">
            Event Details <ArrowRight className="w-[16px] h-[16px] ml-sm" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function EventRow({ event }: { event: EVEvent }) {
  const Icon = TYPE_ICON[event.type];
  return (
    <Link
      to={`/events/${event.slug}`}
      className="group grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-xl items-center border border-hairline hover:border-ink transition-colors bg-canvas p-lg"
    >
      {/* Date block */}
      <div className="flex items-center gap-md">
        <div className="w-[56px] h-[56px] bg-ink text-on-primary flex flex-col items-center justify-center flex-shrink-0">
          <span className="font-display text-display-xs leading-none">
            {new Date(event.start_date).getDate()}
          </span>
          <span className="font-sans-label text-caption uppercase tracking-[0.4px] text-canvas-soft mt-xxs">
            {new Date(event.start_date).toLocaleDateString('en-IN', { month: 'short' })}
          </span>
        </div>
        <Tag className="hidden md:inline-flex">{event.type}</Tag>
      </div>

      {/* Details */}
      <div className="min-w-0">
        <div className="flex items-center gap-sm md:hidden mb-xs">
          <Icon className="w-[14px] h-[14px] text-body" />
          <Tag>{event.type}</Tag>
        </div>
        <h3 className="font-display text-[20px] leading-[1.2] tracking-[-0.2px] mb-xs group-hover:text-body transition-colors line-clamp-1">
          {event.name}
        </h3>
        <div className="flex flex-wrap items-center gap-md">
          {event.city && (
            <span className="inline-flex items-center gap-xs font-sans-label text-caption text-body">
              <MapPin className="w-[12px] h-[12px]" />
              {event.city}
            </span>
          )}
          <span className="inline-flex items-center gap-xs font-sans-label text-caption text-body">
            <Icon className="w-[12px] h-[12px]" />
            {event.venue || event.type}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="hidden md:flex items-center gap-sm font-sans-label text-body-sm-strong uppercase tracking-[0.3px] text-ink group-hover:text-body transition-colors">
        Details
        <ArrowRight className="w-[16px] h-[16px]" />
      </div>
    </Link>
  );
}

function RecapCard({ event }: { event: EVEvent }) {
  const Icon = TYPE_ICON[event.type];
  return (
    <Link
      to={`/events/${event.slug}`}
      className="group block border border-hairline hover:border-ink transition-colors bg-canvas"
    >
      <div className="aspect-[16/9] overflow-hidden bg-canvas-soft">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ink">
            <Icon className="w-[40px] h-[40px] text-canvas-soft" />
          </div>
        )}
      </div>
      <div className="p-lg">
        <div className="flex items-center gap-sm mb-xs">
          <Tag className="bg-body">Recap</Tag>
          <span className="font-sans-label text-caption text-body">
            {formatDate(event.start_date)}
          </span>
        </div>
        <h3 className="font-display text-[18px] leading-[1.2] tracking-[-0.2px] mb-xs group-hover:text-body transition-colors line-clamp-2">
          {event.name}
        </h3>
        {event.city && (
          <span className="inline-flex items-center gap-xs font-sans-label text-caption text-body">
            <MapPin className="w-[12px] h-[12px]" />
            {event.city}
          </span>
        )}
      </div>
    </Link>
  );
}
