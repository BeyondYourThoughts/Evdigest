import { useEffect, useState } from 'react';
import { getArticlesByCategory, getLatestArticles, getArticlesBySection } from '../lib/queries';
import type { Article } from '../lib/types';
import { Eyebrow, SectionHeading } from '../components/ui/Primitives';
import { ArticleCardMedium } from '../components/Cards';

interface SectionConfig {
  title: string;
  description: string;
  fetchFn: () => Promise<Article[]>;
}

const SECTION_MAP: Record<string, SectionConfig> = {
  '/news': {
    title: 'Latest EV News',
    description: 'Breaking news, launch updates, and everything happening in India\'s EV ecosystem.',
    fetchFn: () => getLatestArticles(20),
  },
  '/industry/reports': {
    title: 'Market Reports',
    description: 'Data-driven analysis of India\'s electric vehicle market — sales data, trends, and forecasts.',
    fetchFn: () => getArticlesByCategory('industry'),
  },
  '/industry/battery-tech': {
    title: 'Battery & Technology',
    description: 'Deep dives into battery chemistry, manufacturing, and the technology shaping the EV future.',
    fetchFn: () => getArticlesByCategory('battery'),
  },
  '/industry/charging-infra': {
    title: 'Charging Infrastructure',
    description: 'Policy, rollout, and investment in India\'s EV charging network.',
    fetchFn: () => getArticlesByCategory('charging'),
  },
  '/industry/interviews': {
    title: 'CEO Interviews',
    description: 'In conversation with the leaders shaping India\'s electric vehicle industry.',
    fetchFn: () => getArticlesByCategory('interview'),
  },
  '/industry/expert-opinions': {
    title: 'Expert Opinions',
    description: 'Analysis and commentary from industry experts and thought leaders.',
    fetchFn: () => getArticlesByCategory('opinion'),
  },
  '/industry/investment': {
    title: 'Investment Lens',
    description: 'Funding, startups, and capital flows in the Indian EV ecosystem.',
    fetchFn: () => getArticlesByCategory('investment'),
  },
  '/industry/oem-tracker': {
    title: 'OEM Tracker',
    description: 'Brand-wise sales data, market share, and performance tracking for every EV manufacturer in India.',
    fetchFn: () => getArticlesBySection('industry'),
  },
  '/events/expos': {
    title: 'EV Expos & Auto Shows',
    description: 'Discover and attend EV exhibitions and auto shows across India.',
    fetchFn: () => getArticlesByCategory('events'),
  },
  '/events/conferences': {
    title: 'Conferences & Summits',
    description: 'Policy and industry conferences driving India\'s EV transition.',
    fetchFn: () => getArticlesByCategory('events'),
  },
  '/events/webinars': {
    title: 'Webinars',
    description: 'On-demand and live webinars on EV technology, policy, and markets.',
    fetchFn: () => getArticlesByCategory('events'),
  },
  '/events/recaps': {
    title: 'Event Recaps',
    description: 'Coverage and key takeaways from past EV events.',
    fetchFn: () => getArticlesByCategory('events'),
  },
  '/magazine/long-reads': {
    title: 'Long Reads',
    description: 'Investigative features and in-depth editorial from EVDigest magazine.',
    fetchFn: () => getLatestArticles(20),
  },
  '/magazine/editors-picks': {
    title: "Editor's Picks",
    description: 'Curated best-of from the EVDigest editorial team.',
    fetchFn: () => getLatestArticles(10),
  },
  '/magazine/archive': {
    title: 'Past Issues (Archive)',
    description: 'Browse every past edition of EVDigest magazine.',
    fetchFn: () => getLatestArticles(20),
  },
};

export function SectionPage({ pathKey }: { pathKey: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const config = SECTION_MAP[pathKey] || SECTION_MAP['/news'];

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    config.fetchFn()
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pathKey, config]);

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[60px] bg-canvas-soft w-[400px]" />
          <div className="h-[24px] bg-canvas-soft w-[600px]" />
          <div className="grid grid-cols-3 gap-xl mt-3xl">
            <div className="h-[300px] bg-canvas-soft" />
            <div className="h-[300px] bg-canvas-soft" />
            <div className="h-[300px] bg-canvas-soft" />
          </div>
        </div>
      </div>
    );
  }

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <Eyebrow className="text-canvas-soft mb-md block">EVDigest</Eyebrow>
          <h1 className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] mb-lg">
            {config.title}
          </h1>
          <p className="font-serif-body text-body-serif-lg text-canvas-soft max-w-[700px] leading-relaxed">
            {config.description}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        {articles.length === 0 ? (
          <div className="text-center py-5xl">
            <h2 className="font-display text-display-md mb-md">No articles yet</h2>
            <p className="font-serif-body text-body-serif-md text-body">
              We're working on content for this section. Check back soon.
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <div className="mb-4xl">
                <ArticleCardMedium article={featured} />
              </div>
            )}
            {rest.length > 0 && (
              <>
                <SectionHeading title="More Stories" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3xl">
                  {rest.map((a) => (
                    <ArticleCardMedium key={a.id} article={a} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
