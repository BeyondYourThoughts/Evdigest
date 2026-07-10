import { useEffect, useState, type FormEvent } from 'react';
import {
  Megaphone, MailOpen, FileText, CalendarDays, BarChart3, Users,
  Download, Send, CheckCircle2, AlertCircle, ArrowRight,
} from 'lucide-react';
import { submitContact } from '../lib/queries';
import {
  Eyebrow, SectionHeading, Button,
} from '../components/ui/Primitives';

interface FormState {
  company: string;
  name: string;
  email: string;
  budget: string;
  format: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  company: '',
  name: '',
  email: '',
  budget: '',
  format: '',
  message: '',
};

const STATS = [
  { value: '2M+', label: 'Monthly Pageviews' },
  { value: '50K+', label: 'Newsletter Subscribers' },
  { value: '150K+', label: 'Social Followers' },
];

const AD_FORMATS = [
  {
    icon: BarChart3,
    title: 'Display Ads',
    body: 'Run-of-site and section-targeted display placements across desktop and mobile. High-visibility leaderboard and in-content units on our most-read reviews and guides.',
  },
  {
    icon: MailOpen,
    title: 'Newsletter Sponsorship',
    body: 'Dedicated sponsor slots in our Sunday newsletter — India\'s most-read EV digest. Reach 50,000+ engaged subscribers with a single, undiluted message.',
  },
  {
    icon: FileText,
    title: 'Sponsored Content',
    body: 'Long-form sponsored features clearly labelled as partner content, written to our editorial standard. We disclose, always. We don\'t disguise.',
  },
  {
    icon: CalendarDays,
    title: 'Event Partnership',
    body: 'Associate your brand with our EV expos, webinars, and road-test drives. Title and co-presenter packages for flagship industry events.',
  },
];

const BUDGET_RANGES = [
  'Under Rs 1 L',
  'Rs 1–5 L',
  'Rs 5–10 L',
  'Rs 10–25 L',
  'Rs 25 L+',
];

const FORMAT_OPTIONS = [
  'Display Ads',
  'Newsletter Sponsorship',
  'Sponsored Content',
  'Event Partnership',
  'Not sure yet',
];

export function AdvertisePage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitSuccess) setSubmitSuccess(false);
    if (submitError) setSubmitError(null);
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.company.trim()) next.company = 'Please enter your company name.';
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email address.';
    }
    if (!form.message.trim()) next.message = 'Please tell us about your campaign.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const subject = `Advertise: ${form.format || 'General enquiry'}`;
      const message = [
        `Company: ${form.company.trim()}`,
        `Budget: ${form.budget || 'Not specified'}`,
        `Format interest: ${form.format || 'Not specified'}`,
        '',
        form.message.trim(),
      ].join('\n');
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject,
        message,
      });
      setSubmitSuccess(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full bg-canvas border border-hairline px-lg py-md font-serif-body text-body-serif-md text-ink focus:border-ink transition-colors placeholder:text-hairline';
  const labelCls =
    'font-sans-label text-caption uppercase tracking-[0.4px] text-body block mb-sm';
  const selectCls = `${inputCls} appearance-none bg-canvas cursor-pointer`;

  return (
    <div className="fade-in-up">
      {/* Hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3xl items-center">
            <div>
              <Eyebrow className="text-canvas-soft mb-md block">Advertise With Us</Eyebrow>
              <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
                Reach India's EV audience.
              </h1>
              <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[560px]">
                Connect with intent-driven readers — buyers comparing models,
                owners researching chargers, and professionals tracking the market.
                Our audience comes to decide, not to scroll.
              </p>
              <div className="flex items-center gap-lg mt-2xl">
                <Button href="#enquiry" variant="secondary" size="md">
                  <Send className="w-[16px] h-[16px] mr-sm" />
                  Make an Enquiry
                </Button>
                <Button
                  onClick={() => {}}
                  variant="outline"
                  size="md"
                  className="!border-on-primary !text-on-primary hover:!bg-on-primary hover:!text-ink"
                >
                  <Download className="w-[16px] h-[16px] mr-sm" />
                  Download Media Kit PDF
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <Megaphone className="w-[120px] h-[120px] text-ink-soft" />
            </div>
          </div>
        </div>
      </section>

      {/* Traffic stats */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl border-y border-ink py-3xl">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="font-display text-display-lg leading-[1] tracking-[-0.3px] text-ink mb-sm">
                {stat.value}
              </p>
              <Eyebrow>{stat.label}</Eyebrow>
            </div>
          ))}
        </div>
      </section>

      {/* Audience profile */}
      <section className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-3xl items-start">
            <div>
              <Eyebrow className="text-accent mb-md block">Audience Profile</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-lg">
                Who you'll reach
              </h2>
              <p className="font-serif-body text-body-serif-md text-body leading-relaxed">
                Our readership skews toward purchase-ready, research-driven
                consumers and India's EV industry professionals. They spend real
                time on pages — our average session runs over four minutes.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
              <div className="bg-canvas border border-hairline p-xl">
                <Users className="w-[28px] h-[28px] text-ink mb-md" />
                <p className="font-display text-display-sm leading-[1.1] mb-xxs">68%</p>
                <Eyebrow className="block">In-market buyers</Eyebrow>
                <p className="font-serif-body text-body-serif-md text-body mt-sm leading-snug">
                  Actively comparing or about to purchase an EV within 6 months.
                </p>
              </div>
              <div className="bg-canvas border border-hairline p-xl">
                <BarChart3 className="w-[28px] h-[28px] text-ink mb-md" />
                <p className="font-display text-display-sm leading-[1.1] mb-xxs">4:12</p>
                <Eyebrow className="block">Avg. session</Eyebrow>
                <p className="font-serif-body text-body-serif-md text-body mt-sm leading-snug">
                  Time-on-page well above the automotive category median.
                </p>
              </div>
              <div className="bg-canvas border border-hairline p-xl">
                <MailOpen className="w-[28px] h-[28px] text-ink mb-md" />
                <p className="font-display text-display-sm leading-[1.1] mb-xxs">52%</p>
                <Eyebrow className="block">Newsletter open rate</Eyebrow>
                <p className="font-serif-body text-body-serif-md text-body mt-sm leading-snug">
                  Among the highest engagement in Indian auto media.
                </p>
              </div>
              <div className="bg-canvas border border-hairline p-xl">
                <CalendarDays className="w-[28px] h-[28px] text-ink mb-md" />
                <p className="font-display text-display-sm leading-[1.1] mb-xxs">Tier 1 & 2</p>
                <Eyebrow className="block">Geography</Eyebrow>
                <p className="font-serif-body text-body-serif-md text-body mt-sm leading-snug">
                  Bengaluru, Delhi NCR, Mumbai, Hyderabad, Pune, and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad formats */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <SectionHeading eyebrow="Ad Formats" title="Ways to Partner" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
          {AD_FORMATS.map((fmt) => (
            <div
              key={fmt.title}
              className="border border-hairline hover:border-ink transition-colors p-xl flex flex-col"
            >
              <div className="flex items-center gap-lg mb-md">
                <div className="w-[48px] h-[48px] bg-ink text-on-primary flex items-center justify-center flex-shrink-0">
                  <fmt.icon className="w-[24px] h-[24px]" />
                </div>
                <h3 className="font-display text-[22px] leading-[1.15] tracking-[-0.2px]">
                  {fmt.title}
                </h3>
              </div>
              <p className="font-serif-body text-body-serif-md text-body leading-relaxed">
                {fmt.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-lg border-t-2 border-ink pt-xl">
          <p className="font-serif-body text-body-serif-lg text-ink leading-snug max-w-[640px]">
            All partnerships are clearly disclosed. We keep advertising and editorial
            strictly separate — readers trust us because we never blur the line.
          </p>
          <Button onClick={() => {}} variant="outline" size="md" className="whitespace-nowrap">
            <Download className="w-[16px] h-[16px] mr-sm" />
            Download Media Kit PDF
          </Button>
        </div>
      </section>

      {/* Enquiry form */}
      <section id="enquiry" className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3xl">
            {/* Left intro */}
            <div>
              <Eyebrow className="text-accent mb-md block">Make an Enquiry</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-lg">
                Let's build the right package.
              </h2>
              <p className="font-serif-body text-body-serif-md text-body leading-relaxed mb-xl">
                Tell us your goals and budget. We'll come back within two business
                days with formats, rates, and a placement plan tailored to your
                campaign — no template pitches.
              </p>
              <div className="space-y-md">
                <div className="flex items-start gap-md">
                  <CheckCircle2 className="w-[18px] h-[18px] text-ink flex-shrink-0 mt-xxs" />
                  <p className="font-serif-body text-body-serif-md text-body">
                    Custom placement plans, never off-the-shelf
                  </p>
                </div>
                <div className="flex items-start gap-md">
                  <CheckCircle2 className="w-[18px] h-[18px] text-ink flex-shrink-0 mt-xxs" />
                  <p className="font-serif-body text-body-serif-md text-body">
                    Clear disclosure on every sponsored unit
                  </p>
                </div>
                <div className="flex items-start gap-md">
                  <CheckCircle2 className="w-[18px] h-[18px] text-ink flex-shrink-0 mt-xxs" />
                  <p className="font-serif-body text-body-serif-md text-body">
                    Direct line to our partnerships team
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-canvas border border-hairline p-3xl">
              {submitSuccess ? (
                <div className="text-center py-3xl">
                  <CheckCircle2 className="w-[48px] h-[48px] text-ink mx-auto mb-xl" />
                  <h3 className="font-display text-display-sm mb-sm">Enquiry sent</h3>
                  <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[400px] mx-auto">
                    Thanks for your interest. Our partnerships team will be in touch
                    within two business days with tailored options.
                  </p>
                  <Button onClick={() => setSubmitSuccess(false)} variant="outline" size="sm">
                    Submit Another Enquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-lg" noValidate>
                  <div className="flex items-center gap-sm border-b border-ink pb-md mb-lg">
                    <Megaphone className="w-[18px] h-[18px] text-ink" />
                    <h3 className="font-sans-label text-body-md-strong uppercase tracking-[0.3px] text-ink">
                      Advertising Enquiry
                    </h3>
                  </div>

                  {submitError && (
                    <div className="flex items-start gap-sm border border-accent bg-accent/5 p-md">
                      <AlertCircle className="w-[18px] h-[18px] text-accent flex-shrink-0 mt-xxs" />
                      <p className="font-serif-body text-body-serif-md text-accent">
                        {submitError}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div>
                      <label className={labelCls}>Company</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => update('company', e.target.value)}
                        placeholder="Company / brand name"
                        className={`${inputCls} ${errors.company ? 'border-accent' : ''}`}
                        aria-invalid={!!errors.company}
                      />
                      {errors.company && (
                        <p className="font-sans-label text-caption text-accent mt-xs">{errors.company}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Your Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="Contact person"
                        className={`${inputCls} ${errors.name ? 'border-accent' : ''}`}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p className="font-sans-label text-caption text-accent mt-xs">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="work@email.com"
                        className={`${inputCls} ${errors.email ? 'border-accent' : ''}`}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="font-sans-label text-caption text-accent mt-xs">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Budget Range</label>
                      <select
                        value={form.budget}
                        onChange={(e) => update('budget', e.target.value)}
                        className={selectCls}
                      >
                        <option value="">Select a range</option>
                        {BUDGET_RANGES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Format Interest</label>
                    <select
                      value={form.format}
                      onChange={(e) => update('format', e.target.value)}
                      className={selectCls}
                    >
                      <option value="">Select a format</option>
                      {FORMAT_OPTIONS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>Message</label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="Tell us about your campaign goals, timeline, and target audience..."
                      className={`${inputCls} resize-y min-h-[120px] ${errors.message ? 'border-accent' : ''}`}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className="font-sans-label text-caption text-accent mt-xs">{errors.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-md border-t border-hairline">
                    <p className="font-sans-label text-caption text-body">
                      We respond within 2 business days.
                    </p>
                    <Button
                      type="submit"
                      size="md"
                      className={submitting ? 'opacity-50 pointer-events-none' : ''}
                    >
                      <Send className="w-[14px] h-[14px] mr-sm" />
                      {submitting ? 'Sending...' : 'Submit Enquiry'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-xl">
            <div>
              <Eyebrow className="text-canvas-soft mb-xs block">Questions?</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-sm text-on-primary">
                Want a tailored proposal first?
              </h2>
              <p className="font-serif-body text-body-serif-md text-canvas-soft leading-snug max-w-[520px]">
                Email us directly and we'll prepare a deck before you fill in a form.
              </p>
            </div>
            <Button href="mailto:hello@evdigest.in" variant="secondary" className="whitespace-nowrap">
              Email the Team <ArrowRight className="w-[16px] h-[16px] ml-sm" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
