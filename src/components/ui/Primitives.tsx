import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Eyebrow({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-body ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  link,
  linkLabel = 'View all',
  className = '',
}: {
  eyebrow?: string;
  title: string;
  link?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-end justify-between border-b border-ink pb-sm mb-xl ${className}`}
    >
      <div>
        {eyebrow && <Eyebrow className="mb-xs block">{eyebrow}</Eyebrow>}
        <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px]">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          to={link}
          className="font-sans-label text-body-sm-strong uppercase tracking-[0.4px] text-link hover:text-ink transition-colors whitespace-nowrap ml-lg"
        >
          {linkLabel} &rarr;
        </Link>
      )}
    </div>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <div className={`h-px bg-hairline ${className}`} />;
}

export function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const base =
    'font-sans-label text-button uppercase tracking-[0.3px] inline-flex items-center justify-center transition-all duration-200';
  const variants = {
    primary: 'bg-ink text-on-primary hover:bg-ink-soft',
    secondary: 'bg-canvas-soft text-ink border border-ink hover:bg-ink hover:text-on-primary',
    outline: 'bg-transparent text-ink border border-hairline hover:border-ink hover:bg-canvas-soft',
  };
  const sizes = {
    sm: 'px-lg py-sm',
    md: 'px-xl py-md',
    lg: 'px-2xl py-lg',
  };
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function Tag({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block font-sans-label text-caption uppercase tracking-[0.4px] text-on-primary bg-ink px-sm py-xxs ${className}`}
    >
      {children}
    </span>
  );
}

export function StarRating({
  rating,
  size = 'md',
  className = '',
}: {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = { sm: 'text-[14px]', md: 'text-[18px]', lg: 'text-[24px]' };
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <span className={`inline-flex items-center gap-xxs ${sizes[size]} ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        const isHalf = i === full && half;
        return (
          <span
            key={i}
            className={filled || isHalf ? 'text-ink' : 'text-hairline'}
            aria-hidden
          >
            {filled ? '\u2605' : isHalf ? '\u2605' : '\u2606'}
          </span>
        );
      })}
      <span className="font-sans-label text-body-sm text-body ml-xs">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatPrice(inr: number | null): string {
  if (!inr) return '—';
  if (inr >= 10000000) return `Rs ${(inr / 10000000).toFixed(2)} Cr`;
  if (inr >= 100000) return `Rs ${(inr / 100000).toFixed(2)} L`;
  return `Rs ${inr.toLocaleString('en-IN')}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}
