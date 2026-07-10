import { useEffect, useState, type FormEvent } from 'react';
import {
  Mail, MapPin, Send, CheckCircle2, AlertCircle, Clock, MessageSquare,
} from 'lucide-react';
import { submitContact } from '../lib/queries';
import {
  Eyebrow, Button,
} from '../components/ui/Primitives';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function ContactPage() {
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
    if (!form.subject.trim()) next.subject = 'Please enter a subject.';
    if (!form.message.trim()) {
      next.message = 'Please enter a message.';
    } else if (form.message.trim().length < 10) {
      next.message = 'Message should be at least 10 characters.';
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
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
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

  return (
    <div className="fade-in-up">
      {/* Hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3xl items-center">
            <div>
              <Eyebrow className="text-canvas-soft mb-md block">Contact</Eyebrow>
              <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
                Get in touch with the desk.
              </h1>
              <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[560px]">
                Story tips, corrections, press inquiries, or just a strong opinion —
                we read every message. Tell us what's on your mind.
              </p>
            </div>
            <div className="hidden lg:flex justify-end">
              <MessageSquare className="w-[120px] h-[120px] text-ink-soft" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact + form */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3xl">
          {/* Contact details */}
          <div className="space-y-xl">
            <div>
              <Eyebrow className="text-accent mb-md block">Reach Us</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-lg">
                Contact details
              </h2>
            </div>

            <div className="border-t-2 border-ink pt-lg flex items-start gap-lg">
              <Mail className="w-[24px] h-[24px] text-ink flex-shrink-0 mt-xxs" />
              <div>
                <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">
                  Email
                </p>
                <a
                  href="mailto:hello@evdigest.in"
                  className="font-serif-body text-body-serif-lg text-ink hover:text-link transition-colors"
                >
                  hello@evdigest.in
                </a>
                <p className="font-serif-body text-body-serif-md text-body mt-xs leading-snug">
                  For story tips, corrections, press, and general inquiries.
                </p>
              </div>
            </div>

            <div className="border-t border-hairline pt-lg flex items-start gap-lg">
              <MapPin className="w-[24px] h-[24px] text-ink flex-shrink-0 mt-xxs" />
              <div>
                <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">
                  Office
                </p>
                <p className="font-serif-body text-body-serif-lg text-ink">
                  Bengaluru, India
                </p>
                <p className="font-serif-body text-body-serif-md text-body mt-xs leading-snug">
                  Indiranagar · We're a remote-first newsroom, but the post goes here.
                </p>
              </div>
            </div>

            <div className="border-t border-hairline pt-lg flex items-start gap-lg">
              <Clock className="w-[24px] h-[24px] text-ink flex-shrink-0 mt-xxs" />
              <div>
                <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-body mb-xxs">
                  Response Time
                </p>
                <p className="font-serif-body text-body-serif-lg text-ink">
                  Within 2 business days
                </p>
                <p className="font-serif-body text-body-serif-md text-body mt-xs leading-snug">
                  Urgent corrections get same-day attention. Mark the subject
                  "Correction".
                </p>
              </div>
            </div>

            <div className="bg-canvas-soft border-l-4 border-ink p-xl">
              <Eyebrow className="text-accent mb-sm block">Before You Write</Eyebrow>
              <p className="font-serif-body text-body-serif-md text-body leading-relaxed">
                For advertising, please use the{' '}
                <a href="/advertise" className="text-link hover:text-ink transition-colors underline underline-offset-2">
                  advertise page
                </a>
                . To pitch a story, visit{' '}
                <a href="/contribute" className="text-link hover:text-ink transition-colors underline underline-offset-2">
                  write for us
                </a>
                . It keeps the right desk on your message.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-canvas border border-hairline p-3xl">
            {submitSuccess ? (
              <div className="text-center py-3xl">
                <CheckCircle2 className="w-[48px] h-[48px] text-ink mx-auto mb-xl" />
                <h3 className="font-display text-display-sm mb-sm">Message sent</h3>
                <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[400px] mx-auto">
                  Thank you for reaching out. We've received your message and will get
                  back to you within two business days.
                </p>
                <Button onClick={() => setSubmitSuccess(false)} variant="outline" size="sm">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-lg" noValidate>
                <div className="flex items-center gap-sm border-b border-ink pb-md mb-lg">
                  <Send className="w-[18px] h-[18px] text-ink" />
                  <h3 className="font-sans-label text-body-md-strong uppercase tracking-[0.3px] text-ink">
                    Send a Message
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
                  <label className={labelCls}>Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => update('subject', e.target.value)}
                    placeholder="What's this about?"
                    className={`${inputCls} ${errors.subject ? 'border-accent' : ''}`}
                    aria-invalid={!!errors.subject}
                  />
                  {errors.subject && (
                    <p className="font-sans-label text-caption text-accent mt-xs">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Message</label>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Tell us what's on your mind..."
                    className={`${inputCls} resize-y min-h-[140px] ${errors.message ? 'border-accent' : ''}`}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message ? (
                    <p className="font-sans-label text-caption text-accent mt-xs">{errors.message}</p>
                  ) : (
                    <p className="font-sans-label text-caption text-body mt-xs">
                      {form.message.length} characters
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-md border-t border-hairline">
                  <p className="font-sans-label text-caption text-body">
                    We never share your details. Read our privacy policy.
                  </p>
                  <Button
                    type="submit"
                    size="md"
                    className={submitting ? 'opacity-50 pointer-events-none' : ''}
                  >
                    <Send className="w-[14px] h-[14px] mr-sm" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
