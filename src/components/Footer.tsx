import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, ArrowUp, Zap } from 'lucide-react';

const FOOTER_COLS = [
  {
    title: 'About EVDigest',
    links: [
      { label: 'About EVDigest', slug: '/about' },
      { label: 'Our Team', slug: '/about/team' },
      { label: 'Write for Us', slug: '/contribute' },
      { label: 'Careers', slug: '/careers' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Advertise', slug: '/advertise' },
      { label: 'Contact Us', slug: '/contact' },
      { label: 'Newsletter', slug: '/newsletter' },
      { label: 'RSS Feed', slug: '/rss' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', slug: '/legal/privacy' },
      { label: 'Terms of Use', slug: '/legal/terms' },
      { label: 'Cookie Policy', slug: '/legal/cookies' },
      { label: 'Disclaimer', slug: '/legal/disclaimer' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-on-primary mt-6xl">
      {/* Top section */}
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3xl">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-sm mb-xl">
              <Zap className="w-[24px] h-[24px] text-on-primary" fill="currentColor" />
              <span className="font-display text-[24px] font-bold tracking-[-0.5px] leading-none">
                EV<span className="italic">Digest</span>
              </span>
            </Link>
            <p className="font-serif-body text-body-serif-md text-canvas-soft leading-relaxed max-w-[280px]">
              India's editorial magazine for electric vehicles. News, reviews, market
              analysis, and in-depth long reads.
            </p>
            {/* Social */}
            <div className="flex items-center gap-lg mt-xl">
              <a href="#" aria-label="Facebook" className="text-canvas-soft hover:text-on-primary transition-colors">
                <Facebook className="w-[18px] h-[18px]" />
              </a>
              <a href="#" aria-label="Instagram" className="text-canvas-soft hover:text-on-primary transition-colors">
                <Instagram className="w-[18px] h-[18px]" />
              </a>
              <a href="#" aria-label="X (Twitter)" className="text-canvas-soft hover:text-on-primary transition-colors">
                <Twitter className="w-[18px] h-[18px]" />
              </a>
              <a href="#" aria-label="YouTube" className="text-canvas-soft hover:text-on-primary transition-colors">
                <Youtube className="w-[18px] h-[18px]" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-canvas-soft hover:text-on-primary transition-colors">
                <Linkedin className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-on-primary mb-xl">
                {col.title}
              </p>
              <ul className="space-y-md">
                {col.links.map((link) => (
                  <li key={link.slug}>
                    <Link
                      to={link.slug}
                      className="font-serif-body text-body-serif-md text-canvas-soft hover:text-on-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter mini */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <p className="font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-on-primary mb-xl">
              Newsletter
            </p>
            <p className="font-serif-body text-body-serif-md text-canvas-soft mb-lg leading-relaxed">
              The week in EVs, delivered every Sunday.
            </p>
            <Link
              to="/subscribe"
              className="font-sans-label text-body-sm-strong uppercase tracking-[0.3px] bg-on-primary text-ink px-xl py-sm hover:bg-canvas-soft transition-colors inline-block"
            >
              Subscribe Free
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-soft">
        <div className="mx-auto max-w-editorial px-xl py-xl flex items-center justify-between">
          <p className="font-sans-label text-caption text-canvas-soft">
            &copy; 2026 EVDigest. All rights reserved.
          </p>
          <a
            href="#top"
            className="flex items-center gap-xs font-sans-label text-caption uppercase tracking-[0.4px] text-canvas-soft hover:text-on-primary transition-colors"
          >
            Back to top
            <ArrowUp className="w-[14px] h-[14px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
