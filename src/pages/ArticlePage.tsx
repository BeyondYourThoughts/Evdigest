import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Clock, ArrowLeft } from 'lucide-react';
import { getArticleBySlug, getLatestArticles } from '../lib/queries';
import type { Article } from '../lib/types';
import { Eyebrow, SectionHeading, Button, Tag, formatDate } from '../components/ui/Primitives';

/**
 * Parses a markdown-ish body string (paragraphs separated by \n\n) into
 * React elements. Supports:
 *   ## Heading 2
 *   ### Heading 3
 *   > Blockquote
 *   **bold** inline
 *   - bullet / 1. ordered list blocks
 */
function renderBody(body: string) {
  const blocks = body.split('\n\n');

  // Gather consecutive list-item lines into <ul>/<ol>
  const elements: React.ReactNode[] = [];
  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (key: number) => {
    if (!listBuffer) return;
    const TagEl = listBuffer.type === 'ul' ? 'ul' : 'ol';
    elements.push(
      <TagEl key={`list-${key}`}>
        {listBuffer.items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
        ))}
      </TagEl>,
    );
    listBuffer = null;
  };

  blocks.forEach((raw, i) => {
    const block = raw.trim();
    if (!block) return;

    // Bullet list block
    if (block.split('\n').every((l) => l.trim().startsWith('- '))) {
      const items = block.split('\n').map((l) => l.trim().replace(/^- /, ''));
      if (listBuffer && listBuffer.type === 'ul') {
        listBuffer.items.push(...items);
      } else {
        flushList(i);
        listBuffer = { type: 'ul', items };
      }
      return;
    }

    // Ordered list block
    if (block.split('\n').every((l) => /^\d+\.\s/.test(l.trim()))) {
      const items = block.split('\n').map((l) => l.trim().replace(/^\d+\.\s/, ''));
      if (listBuffer && listBuffer.type === 'ol') {
        listBuffer.items.push(...items);
      } else {
        flushList(i);
        listBuffer = { type: 'ol', items };
      }
      return;
    }

    // Non-list block: flush any pending list first
    flushList(i);

    if (block.startsWith('### ')) {
      elements.push(<h3 key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(block.slice(4)) }} />);
    } else if (block.startsWith('## ')) {
      elements.push(<h2 key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(block.slice(3)) }} />);
    } else if (block.startsWith('> ')) {
      elements.push(<blockquote key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(block.slice(2)) }} />);
    } else {
      elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(block) }} />);
    }
  });

  flushList(blocks.length);
  return elements;
}

/** Convert **bold** and [text](url) to HTML, escape the rest. */
function inlineFormat(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [more, setMore] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    Promise.all([getArticleBySlug(slug), getLatestArticles(4)])
      .then(([a, m]) => {
        if (!a) {
          setNotFound(true);
        } else {
          setArticle(a);
          // Exclude the current article from "More Stories"
          setMore(m.filter((x) => x.slug !== slug).slice(0, 3));
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
          <div className="h-[480px] bg-canvas-soft" />
          <div className="mx-auto max-w-[800px] space-y-lg">
            <div className="h-[40px] bg-canvas-soft w-1/3" />
            <div className="h-[56px] bg-canvas-soft w-full" />
            <div className="h-[56px] bg-canvas-soft w-3/4" />
            <div className="h-[20px] bg-canvas-soft w-1/2" />
            <div className="h-[300px] bg-canvas-soft w-full" />
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
          Article not found
        </h1>
        <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[500px] mx-auto">
          The story you're looking for may have been moved or doesn't exist.
        </p>
        <Button to="/">Back to Home</Button>
      </div>
    );
  }

  if (!article) return null;

  return (
    <article className="fade-in-up">
      {/* Full-width hero image */}
      {article.image_url && (
        <div className="w-full bg-canvas-soft">
          <div className="aspect-[16/9] max-h-[560px] overflow-hidden">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article body — constrained width */}
      <div className="mx-auto max-w-[800px] px-xl py-4xl">
        {/* Category + breadcrumb */}
        <div className="flex items-center gap-md mb-xl">
          <Tag>{article.category}</Tag>
          <Link
            to={`/${article.section}`}
            className="font-sans-label text-body-sm uppercase tracking-[0.4px] text-link hover:text-ink transition-colors"
          >
            {article.section}
          </Link>
        </div>

        {/* Title */}
        <h1 className="font-display text-display-lg leading-[1.05] tracking-[-0.4px] mb-xl">
          {article.title}
        </h1>

        {/* Excerpt as deck */}
        {article.excerpt && (
          <p className="font-serif-body text-body-serif-lg text-body leading-relaxed mb-2xl">
            {article.excerpt}
          </p>
        )}

        {/* Byline */}
        <div className="flex flex-wrap items-center gap-lg border-y border-hairline py-lg mb-3xl">
          {article.author && (
            <div className="flex items-center gap-sm">
              <div className="w-[36px] h-[36px] rounded-full bg-ink text-on-primary flex items-center justify-center">
                <span className="font-display text-[16px]">
                  {article.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-sans-label text-body-sm-strong text-ink">
                  {article.author}
                </p>
                {article.author_role && (
                  <p className="font-sans-label text-caption text-body">
                    {article.author_role}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-lg ml-auto">
            <Eyebrow className="text-hairline">{formatDate(article.published_at)}</Eyebrow>
            <Eyebrow className="text-hairline flex items-center gap-xxs">
              <Clock className="w-[12px] h-[12px]" />
              {article.read_time_min} min read
            </Eyebrow>
          </div>
        </div>

        {/* Body */}
        {article.body && (
          <div className="article-body">{renderBody(article.body)}</div>
        )}

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-sm mt-4xl pt-xl border-t border-hairline">
            {article.tags.map((t) => (
              <span
                key={t}
                className="font-sans-label text-caption uppercase tracking-[0.4px] text-body border border-hairline px-sm py-xxs"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="mt-3xl">
          <Link
            to={`/${article.section}`}
            className="inline-flex items-center gap-sm font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-link hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-[14px] h-[14px]" />
            Back to {article.section}
          </Link>
        </div>
      </div>

      {/* More Stories */}
      {more.length > 0 && (
        <section className="bg-canvas-soft border-t border-hairline py-4xl">
          <div className="mx-auto max-w-editorial px-xl">
            <SectionHeading
              eyebrow="Keep Reading"
              title="More Stories"
              link="/news"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3xl">
              {more.map((a) => (
                <Link key={a.id} to={`/article/${a.slug}`} className="group block">
                  <div className="aspect-[16/10] overflow-hidden bg-canvas-soft mb-lg">
                    {a.image_url ? (
                      <img
                        src={a.image_url}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-display-sm text-hairline">EVDigest</span>
                      </div>
                    )}
                  </div>
                  <Tag className="mb-sm">{a.category}</Tag>
                  <h3 className="font-display text-[22px] leading-[1.2] tracking-[-0.2px] mb-sm group-hover:text-body transition-colors">
                    {a.title}
                  </h3>
                  <p className="font-serif-body text-body-serif-md text-body line-clamp-2 mb-md">
                    {a.excerpt}
                  </p>
                  <div className="flex items-center gap-md">
                    <Eyebrow className="text-hairline">{formatDate(a.published_at)}</Eyebrow>
                    <Eyebrow className="text-hairline flex items-center gap-xxs">
                      <ArrowRight className="w-[12px] h-[12px]" />
                      {a.read_time_min} min
                    </Eyebrow>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
