import { useEffect, useState, type FormEvent } from 'react';
import {
  PenLine, FileText, Link2, Send, CheckCircle2, AlertCircle,
  UserCircle, Lightbulb, Cpu, Megaphone, ArrowRight,
} from 'lucide-react';
import { submitContact } from '../lib/queries';
import {
  Eyebrow, SectionHeading, Button,
} from '../components/ui/Primitives';

interface FormState {
  name: string;
  email: string;
  topic: string;
  brief: string;
  sample: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  topic: '',
  brief: '',
  sample: '',
};

const BENEFITS = [
  {
    icon: PenLine,
    title: 'Your byline',
    body: 'Every published piece carries your name, photo, and a short bio with links to your work.',
  },
  {
    icon: UserCircle,
    title: 'Author page',
    body: 'A dedicated author profile on EVDigest — your archive, your beat, your readers, in one place.',
  },
  {
    icon: Link2,
    title: 'SEO backlink',
    body: 'A permanent, do-follow backlink to your personal site or portfolio from your author bio.',
  },
  {
    icon: Megaphone,
    title: 'Community reach',
    body: 'Get in front of 2M+ monthly readers and 50K+ newsletter subscribers who care about Indian EVs.',
  },
];

const GUIDELINES = [
  {
    icon: FileText,
    label: 'Word count',
    body: '800–2,500 words. Long enough to be useful, short enough to be read. We rarely publish listicles.',
  },
  {
    icon: Lightbulb,
    label: 'Topics',
    body: 'EV reviews, industry analysis, opinion, and technology deep dives. If it moves India\'s EV story forward, we want it.',
  },
  {
    icon: PenLine,
    label: 'Tone',
    body: 'Editorial and factual. No brand promotion, no press-release recycling, no undisclosed paid content. Argue a position — back it up.',
  },
  {
    icon: Cpu,
    label: 'Format',
    body: 'Submit as a Google Doc or markdown. Include original photos where possible. Cite every claim and number with a source link.',
  },
];

const TOPIC_OPTIONS = [
  'EV Review',
  'Industry Analysis',
  'Opinion',
  'Tech Deep Dive',
  'Other',
];

export function ContributePage() {
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
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email address.';
    }
    if (!form.topic.trim()) next.topic = 'Please select a topic.';
    if (!form.brief.trim()) {
      next.brief = 'Please give us a brief.';
    } else if (form.brief.trim().length < 30) {
      next.brief = 'Tell us a bit more — at least 30 characters.';
    }
    if (form.sample.trim() && !/^https?:\/\/.+/.test(form.sample.trim())) {
      next.sample = 'Please enter a valid URL (including https://).';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const subject = `Pitch: ${form.topic}`;
      const message = [
        `Topic: ${form.topic}`,
        form.sample.trim() ? `Sample link: ${form.sample.trim()}` : 'Sample link: (none provided)',
        '',
        form.brief.trim(),
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
              <Eyebrow className="text-canvas-soft mb-md block">Write for Us</Eyebrow>
              <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
                Pitch EVDigest.
              </h1>
              <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[560px]">
                We're always looking for sharp writers who understand India's EV
                story — the cars, the policy, the battery chemistries, and the
                people driving the shift. If you have something to say, say it here.
              </p>
              <div className="flex items-center gap-lg mt-2xl">
                <Button href="#pitch" variant="secondary" size="md">
                  <Send className="w-[16px] h-[16px] mr-sm" />
                  Submit a Pitch
                </Button>
                <Button href="#guidelines" variant="outline" size="md" className="!border-on-primary !text-on-primary hover:!bg-on-primary hover:!text-ink">
                  Read the Guidelines
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <PenLine className="w-[120px] h-[120px] text-ink-soft" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <SectionHeading eyebrow="Why Write Here" title="What You Get" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-xl">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="border-t-2 border-ink pt-xl flex flex-col"
            >
              <benefit.icon className="w-[28px] h-[28px] text-ink mb-md" />
              <h3 className="font-display text-[20px] leading-[1.15] tracking-[-0.2px] mb-sm">
                {benefit.title}
              </h3>
              <p className="font-serif-body text-body-serif-md text-body leading-relaxed">
                {benefit.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Guidelines */}
      <section id="guidelines" className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3xl">
            <div className="lg:sticky lg:top-3xl self-start">
              <Eyebrow className="text-accent mb-md block">Submission Guidelines</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-lg">
                How we work
              </h2>
              <p className="font-serif-body text-body-serif-md text-body leading-relaxed">
                We edit everything. We don't publish press releases. We don't take
                paid posts disguised as editorial. If that sounds like the bar
                you want to clear, read on.
              </p>
            </div>
            <div className="space-y-lg">
              {GUIDELINES.map((g) => (
                <div
                  key={g.label}
                  className="bg-canvas border border-hairline p-xl flex items-start gap-lg"
                >
                  <div className="w-[44px] h-[44px] bg-ink text-on-primary flex items-center justify-center flex-shrink-0">
                    <g.icon className="w-[22px] h-[22px]" />
                  </div>
                  <div>
                    <Eyebrow className="text-accent mb-xxs block">{g.label}</Eyebrow>
                    <p className="font-serif-body text-body-serif-md text-ink leading-relaxed">
                      {g.body}
                    </p>
                  </div>
                </div>
              ))}
              <div className="bg-ink text-on-primary p-xl">
                <Eyebrow className="text-canvas-soft mb-sm block">Editorial Process</Eyebrow>
                <p className="font-serif-body text-body-serif-md text-canvas-soft leading-relaxed">
                  Pitches are reviewed within 5 business days. If accepted, we'll
                  agree on a deadline, an angle, and a fee. Drafts go through a
                  full edit — structure, fact-check, and copy — before publish.
                  You'll see and approve the final version.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pitch form */}
      <section id="pitch" className="mx-auto max-w-editorial px-xl py-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3xl">
          {/* Left intro */}
          <div>
            <Eyebrow className="text-accent mb-md block">Submit a Pitch</Eyebrow>
            <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-lg">
              Tell us what you want to write.
            </h2>
            <p className="font-serif-body text-body-serif-md text-body leading-relaxed mb-xl">
              A good pitch is short. Give us the topic, the angle, and a link to
              something you've written before. We'll reply within five business
              days — yes or no, with a reason.
            </p>
            <div className="space-y-md">
              <div className="flex items-start gap-md">
                <CheckCircle2 className="w-[18px] h-[18px] text-ink flex-shrink-0 mt-xxs" />
                <p className="font-serif-body text-body-serif-md text-body">
                  One pitch at a time — make it your best idea
                </p>
              </div>
              <div className="flex items-start gap-md">
                <CheckCircle2 className="w-[18px] h-[18px] text-ink flex-shrink-0 mt-xxs" />
                <p className="font-serif-body text-body-serif-md text-body">
                  We pay competitive rates for accepted pieces
                </p>
              </div>
              <div className="flex items-start gap-md">
                <CheckCircle2 className="w-[18px] h-[18px] text-ink flex-shrink-0 mt-xxs" />
                <p className="font-serif-body text-body-serif-md text-body">
                  Original work only — no reposts, no syndication
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-canvas border border-hairline p-3xl">
            {submitSuccess ? (
              <div className="text-center py-3xl">
                <CheckCircle2 className="w-[48px] h-[48px] text-ink mx-auto mb-xl" />
                <h3 className="font-display text-display-sm mb-sm">Pitch received</h3>
                <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[400px] mx-auto">
                  Thank you for pitching EVDigest. Our editors will review your idea
                  and get back to you within five business days.
                </p>
                <Button onClick={() => setSubmitSuccess(false)} variant="outline" size="sm">
                  Submit Another Pitch
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-lg" noValidate>
                <div className="flex items-center gap-sm border-b border-ink pb-md mb-lg">
                  <PenLine className="w-[18px] h-[18px] text-ink" />
                  <h3 className="font-sans-label text-body-md-strong uppercase tracking-[0.3px] text-ink">
                    Your Pitch
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
                    <label className={labelCls}>Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Your full name"
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
                      placeholder="your@email.com"
                      className={`${inputCls} ${errors.email ? 'border-accent' : ''}`}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="font-sans-label text-caption text-accent mt-xs">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Topic</label>
                  <select
                    value={form.topic}
                    onChange={(e) => update('topic', e.target.value)}
                    className={`${selectCls} ${errors.topic ? 'border-accent' : ''}`}
                    aria-invalid={!!errors.topic}
                  >
                    <option value="">Select a topic</option>
                    {TOPIC_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.topic && (
                    <p className="font-sans-label text-caption text-accent mt-xs">{errors.topic}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Article Brief</label>
                  <textarea
                    rows={6}
                    value={form.brief}
                    onChange={(e) => update('brief', e.target.value)}
                    placeholder="What's the story? What's the angle? Why now, and why are you the one to write it?"
                    className={`${inputCls} resize-y min-h-[140px] ${errors.brief ? 'border-accent' : ''}`}
                    aria-invalid={!!errors.brief}
                  />
                  {errors.brief ? (
                    <p className="font-sans-label text-caption text-accent mt-xs">{errors.brief}</p>
                  ) : (
                    <p className="font-sans-label text-caption text-body mt-xs">
                      {form.brief.length} characters · aim for 150–400 words
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Sample Link</label>
                  <input
                    type="url"
                    value={form.sample}
                    onChange={(e) => update('sample', e.target.value)}
                    placeholder="https://your-best-published-piece.com"
                    className={`${inputCls} ${errors.sample ? 'border-accent' : ''}`}
                    aria-invalid={!!errors.sample}
                  />
                  {errors.sample ? (
                    <p className="font-sans-label text-caption text-accent mt-xs">{errors.sample}</p>
                  ) : (
                    <p className="font-sans-label text-caption text-body mt-xs">
                      Optional — but a writing sample gets a faster yes.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-md border-t border-hairline">
                  <p className="font-sans-label text-caption text-body">
                    We reply within 5 business days.
                  </p>
                  <Button
                    type="submit"
                    size="md"
                    className={submitting ? 'opacity-50 pointer-events-none' : ''}
                  >
                    <Send className="w-[14px] h-[14px] mr-sm" />
                    {submitting ? 'Sending...' : 'Submit Pitch'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-xl">
            <div>
              <Eyebrow className="text-canvas-soft mb-xs block">Explore First</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-sm text-on-primary">
                Read before you pitch.
              </h2>
              <p className="font-serif-body text-body-serif-md text-canvas-soft leading-snug max-w-[520px]">
                The best pitches fit the magazine. Browse our latest stories to see
                the voice, depth, and angles we publish.
              </p>
            </div>
            <Button to="/magazine/current" variant="secondary" className="whitespace-nowrap">
              Read the Magazine <ArrowRight className="w-[16px] h-[16px] ml-sm" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
