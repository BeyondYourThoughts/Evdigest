import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, Zap } from 'lucide-react';
import { getBreakingNews } from '../lib/queries';
import type { Article } from '../lib/types';
import { formatDate } from './ui/Primitives';

interface NavChild {
  label: string;
  slug: string;
  note?: string;
}

interface NavItem {
  label: string;
  children: NavChild[];
}

const NAV: NavItem[] = [
  {
    label: 'For Consumers',
    children: [
      { label: 'Buyers Guide', slug: '/consumers/buyers-guide' },
      { label: 'Compare Vehicles', slug: '/consumers/compare' },
      { label: 'Reviews', slug: '/consumers/reviews' },
      { label: 'Cost Savings Calculator', slug: '/consumers/tools/cost-savings' },
      { label: 'Charger Locator', slug: '/consumers/tools/charger-map' },
      { label: 'Subsidy Finder', slug: '/consumers/tools/subsidy' },
      { label: 'Real Owner Stories', slug: '/consumers/owner-stories' },
      { label: 'Ask a Question (Q&A)', slug: '/consumers/community/ask' },
      { label: 'Latest EV News', slug: '/news' },
    ],
  },
  {
    label: 'Industry',
    children: [
      { label: 'Market Reports', slug: '/industry/reports' },
      { label: 'OEM Tracker', slug: '/industry/oem-tracker' },
      { label: 'Battery & Technology', slug: '/industry/battery-tech' },
      { label: 'Charging Infrastructure', slug: '/industry/charging-infra' },
      { label: 'CEO Interviews', slug: '/industry/interviews' },
      { label: 'Expert Opinions', slug: '/industry/expert-opinions' },
      { label: 'Investment Lens', slug: '/industry/investment' },
    ],
  },
  {
    label: 'Events',
    children: [
      { label: 'EV Expos & Auto Shows', slug: '/events/expos' },
      { label: 'Conferences & Summits', slug: '/events/conferences' },
      { label: 'Webinars', slug: '/events/webinars' },
      { label: 'Event Recaps', slug: '/events/recaps' },
      { label: 'Full Events Calendar', slug: '/events/calendar' },
    ],
  },
  {
    label: 'Brands',
    children: [
      { label: 'Ola Electric', slug: '/brands/ola-electric', note: '2W' },
      { label: 'Ather Energy', slug: '/brands/ather-energy', note: '2W' },
      { label: 'TVS iQube', slug: '/brands/tvs-iqube', note: '2W' },
      { label: 'Bajaj Chetak', slug: '/brands/bajaj-chetak', note: '2W' },
      { label: 'Hero Vida', slug: '/brands/hero-vida', note: '2W' },
      { label: 'Tata Motors EV', slug: '/brands/tata-motors', note: 'Cars' },
      { label: 'MG Motor India', slug: '/brands/mg-motor', note: 'Cars' },
      { label: 'Hyundai India EV', slug: '/brands/hyundai', note: 'Cars' },
      { label: 'BYD India', slug: '/brands/byd', note: 'Cars' },
      { label: 'Kia India', slug: '/brands/kia', note: 'Cars' },
      { label: 'All Brands Index', slug: '/brands' },
    ],
  },
  {
    label: 'EV Basics',
    children: [
      { label: 'How EVs Work', slug: '/basics/how-ev-works' },
      { label: 'Battery Types Explained', slug: '/basics/battery-types', note: 'LFP, NMC, solid-state' },
      { label: 'Charging 101', slug: '/basics/charging-guide', note: 'AC, DC, home setup' },
      { label: 'EV Glossary', slug: '/basics/glossary' },
      { label: 'EV Myths Busted', slug: '/basics/myths' },
      { label: 'Full Learning Centre', slug: '/basics' },
    ],
  },
  {
    label: 'Magazine',
    children: [
      { label: 'Current Issue', slug: '/magazine/current', note: 'Monthly edition' },
      { label: 'Past Issues (Archive)', slug: '/magazine/archive' },
      { label: 'Long Reads', slug: '/magazine/long-reads', note: 'Investigative features' },
      { label: "Editor's Picks", slug: '/magazine/editors-picks' },
      { label: 'Subscribe Free', slug: '/subscribe' },
    ],
  },
  {
    label: 'More',
    children: [
      { label: 'About EVDigest', slug: '/about' },
      { label: 'Our Team', slug: '/about/team' },
      { label: 'Advertise with Us', slug: '/advertise' },
      { label: 'Write for Us', slug: '/contribute' },
      { label: 'Contact', slug: '/contact' },
      { label: 'Privacy & Terms', slug: '/legal' },
    ],
  },
];

export function Header() {
  const [breakingNews, setBreakingNews] = useState<Article[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getBreakingNews().then(setBreakingNews).catch(() => {});
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-canvas">
      {/* Utility bar */}
      <div className="bg-ink text-on-primary">
        <div className="mx-auto max-w-editorial px-xl flex items-center justify-between h-[36px]">
          <div className="flex items-center gap-xl font-sans-label text-caption uppercase tracking-[0.4px]">
            <Link to="/newsletter" className="hover:text-canvas-soft transition-colors">Newsletter</Link>
            <Link to="/advertise" className="hover:text-canvas-soft transition-colors hidden sm:inline">Advertise</Link>
            <Link to="/contact" className="hover:text-canvas-soft transition-colors hidden sm:inline">Contact</Link>
          </div>
          <div className="flex items-center gap-xl font-sans-label text-caption uppercase tracking-[0.4px]">
            <Link to="/subscribe" className="hover:text-canvas-soft transition-colors hidden md:inline">Subscribe Free</Link>
            <Link to="/rss" className="hover:text-canvas-soft transition-colors hidden md:inline">RSS</Link>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="border-b border-hairline">
        <div className="mx-auto max-w-editorial px-xl flex items-center justify-between py-lg">
          <Link to="/" className="flex items-center gap-sm">
            <Zap className="w-[28px] h-[28px] text-ink" fill="currentColor" />
            <span className="font-display text-[28px] font-bold tracking-[-0.5px] leading-none">
              EV<span className="italic">Digest</span>
            </span>
          </Link>
          <div className="flex items-center gap-lg">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-ink hover:text-body transition-colors"
              aria-label="Search"
            >
              <Search className="w-[20px] h-[20px]" />
            </button>
            <Link
              to="/subscribe"
              className="font-sans-label text-body-sm-strong uppercase tracking-[0.3px] bg-ink text-on-primary px-lg py-sm hover:bg-ink-soft transition-colors hidden sm:inline-block"
            >
              Subscribe
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-ink lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-[24px] h-[24px]" /> : <Menu className="w-[24px] h-[24px]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-b border-hairline bg-canvas-soft">
          <form onSubmit={handleSearch} className="mx-auto max-w-editorial px-xl py-lg">
            <div className="flex items-center gap-md">
              <Search className="w-[20px] h-[20px] text-body" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, vehicles, brands..."
                autoFocus
                className="flex-1 bg-transparent border-none outline-none font-serif-body text-body-serif-md text-ink placeholder:text-body"
              />
              <button type="submit" className="font-sans-label text-body-sm-strong uppercase tracking-[0.3px] text-ink hover:text-body transition-colors">
                Search
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Breaking news ticker */}
      {breakingNews.length > 0 && (
        <div className="bg-canvas-soft border-b border-hairline overflow-hidden">
          <div className="mx-auto max-w-editorial px-xl flex items-center h-[36px]">
            <span className="font-sans-label text-caption uppercase tracking-[0.4px] font-bold text-accent whitespace-nowrap mr-lg flex items-center gap-xs">
              <span className="inline-block w-[6px] h-[6px] bg-accent rounded-full animate-pulse" />
              Breaking
            </span>
            <div className="overflow-hidden flex-1">
              <div className="ticker-track">
                {[...breakingNews, ...breakingNews].map((a, i) => (
                  <Link
                    key={i}
                    to={`/article/${a.slug}`}
                    className="font-sans-label text-body-sm text-ink hover:text-link transition-colors mr-3xl whitespace-nowrap"
                  >
                    {a.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop nav */}
      <nav className="border-b border-hairline hidden lg:block">
        <div className="mx-auto max-w-editorial px-xl">
          <ul className="flex items-stretch">
            {NAV.map((item) => (
              <li key={item.label} className="dropdown-trigger relative group">
                <button className="flex items-center gap-xxs font-sans-label text-body-sm-strong uppercase tracking-[0.3px] text-ink py-md px-lg hover:text-body transition-colors whitespace-nowrap">
                  {item.label}
                  <ChevronDown className="w-[14px] h-[14px]" />
                </button>
                <div className="dropdown-menu absolute left-0 top-full bg-canvas border border-ink shadow-lg min-w-[260px] z-50">
                  <ul className="py-sm">
                    {item.children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          to={child.slug}
                          className="flex items-center justify-between px-xl py-md font-sans-label text-body-sm text-ink hover:bg-canvas-soft hover:text-link transition-colors"
                        >
                          <span>{child.label}</span>
                          {child.note && (
                            <span className="font-sans-label text-caption uppercase tracking-[0.4px] text-body ml-lg">
                              {child.note}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-b border-hairline max-h-[70vh] overflow-y-auto">
          <div className="px-xl py-lg">
            {NAV.map((item) => (
              <div key={item.label} className="mb-xl">
                <p className="font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-body mb-sm">
                  {item.label}
                </p>
                <ul className="space-y-xs">
                  {item.children.map((child) => (
                    <li key={child.slug}>
                      <Link
                        to={child.slug}
                        className="block font-serif-body text-body-serif-md text-ink hover:text-link transition-colors py-xxs"
                      >
                        {child.label}
                        {child.note && (
                          <span className="font-sans-label text-caption text-body ml-sm">({child.note})</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export function NewsTicker({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <div className="bg-canvas-soft border-b border-hairline overflow-hidden">
      <div className="mx-auto max-w-editorial px-xl flex items-center h-[36px]">
        <span className="font-sans-label text-caption uppercase tracking-[0.4px] font-bold text-accent whitespace-nowrap mr-lg flex items-center gap-xs">
          <span className="inline-block w-[6px] h-[6px] bg-accent rounded-full animate-pulse" />
          Latest
        </span>
        <div className="overflow-hidden flex-1">
          <div className="ticker-track">
            {[...articles, ...articles].map((a, i) => (
              <Link
                key={i}
                to={`/article/${a.slug}`}
                className="font-sans-label text-body-sm text-ink hover:text-link transition-colors mr-3xl whitespace-nowrap"
              >
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { formatDate };
