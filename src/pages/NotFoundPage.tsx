import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button, Eyebrow } from '../components/ui/Primitives';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-editorial px-xl py-6xl">
      <div className="text-center max-w-[600px] mx-auto">
        <Eyebrow className="text-accent mb-lg block">Error 404</Eyebrow>
        <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-xl">
          Page not found
        </h1>
        <p className="font-serif-body text-body-serif-lg text-body mb-3xl leading-relaxed">
          The page you are looking for may have been moved, renamed, or does not exist.
          Try searching, or head back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-md justify-center">
          <Button to="/">Back to Home</Button>
          <Button to="/search" variant="outline">
            <span className="inline-flex items-center gap-sm">
              <Search className="w-[16px] h-[16px]" /> Search EVDigest
            </span>
          </Button>
        </div>
        <div className="mt-5xl border-t border-hairline pt-3xl">
          <p className="font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-body mb-lg">
            Popular Pages
          </p>
          <div className="flex flex-wrap gap-md justify-center">
            {[
              { label: 'Buyers Guide', slug: '/consumers/buyers-guide' },
              { label: 'Reviews', slug: '/consumers/reviews' },
              { label: 'Brands', slug: '/brands' },
              { label: 'EV Basics', slug: '/basics' },
              { label: 'Events', slug: '/events' },
              { label: 'Magazine', slug: '/magazine/current' },
            ].map((link) => (
              <Link
                key={link.slug}
                to={link.slug}
                className="font-sans-label text-body-sm text-ink border border-hairline px-lg py-sm hover:border-ink hover:bg-canvas-soft transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
