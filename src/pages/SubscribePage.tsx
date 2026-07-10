import { useState } from 'react';
import { Check, Mail } from 'lucide-react';
import { Eyebrow } from '../components/ui/Primitives';

export function SubscribePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div>
      <section className="bg-ink text-on-primary py-6xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="max-w-[600px] mx-auto text-center">
            <Eyebrow className="text-canvas-soft mb-lg block">Newsletter</Eyebrow>
            <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-xl">
              The week in EVs, delivered every Sunday.
            </h1>
            <p className="font-serif-body text-body-serif-lg text-canvas-soft mb-3xl leading-relaxed">
              Join 50,000+ readers getting India's most-read EV newsletter. Market data,
              new launches, reviews, and analysis — free, forever.
            </p>

            {submitted ? (
              <div className="bg-ink-soft border border-on-primary p-xl flex items-center gap-md justify-center">
                <Check className="w-[24px] h-[24px] text-on-primary" />
                <p className="font-sans-label text-body-md-strong text-on-primary">
                  You're subscribed. See you Sunday.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-md">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent border border-on-primary text-on-primary font-serif-body text-body-serif-md px-xl py-lg placeholder:text-canvas-soft focus:outline-none focus:border-canvas-soft"
                />
                <button
                  type="submit"
                  className="font-sans-label text-button uppercase tracking-[0.3px] bg-on-primary text-ink px-2xl py-lg hover:bg-canvas-soft transition-colors whitespace-nowrap inline-flex items-center justify-center gap-sm"
                >
                  <Mail className="w-[18px] h-[18px]" /> Subscribe
                </button>
              </form>
            )}
            <p className="font-sans-label text-caption text-canvas-soft mt-md">
              No spam. Unsubscribe anytime. Privacy protected.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3xl">
          {[
            { title: 'Market Data', desc: 'Monthly EV sales figures, brand-wise breakdowns, and trend analysis — sourced from Vahan data.' },
            { title: 'New Launches', desc: 'Every new EV launch in India, with first-look reviews and spec breakdowns.' },
            { title: 'Editorial Analysis', desc: 'Industry commentary, policy deep dives, and investigative long reads from our editorial team.' },
          ].map((item) => (
            <div key={item.title} className="border-l-4 border-ink pl-xl">
              <h3 className="font-display text-display-sm leading-[1.2] mb-sm">{item.title}</h3>
              <p className="font-serif-body text-body-serif-md text-body leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
