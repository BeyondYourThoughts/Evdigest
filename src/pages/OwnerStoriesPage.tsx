import { useEffect, useState, type FormEvent } from 'react';
import {
  Quote, PenLine, CheckCircle2, AlertCircle, Send, Heart, Users, ArrowRight,
} from 'lucide-react';
import { getOwnerStories, submitOwnerStory } from '../lib/queries';
import type { OwnerStory } from '../lib/types';
import {
  Eyebrow, SectionHeading, Button,
} from '../components/ui/Primitives';
import { OwnerStoryCard } from '../components/Cards';

interface FormState {
  author_name: string;
  vehicle: string;
  city: string;
  headline: string;
  story_text: string;
}

const EMPTY_FORM: FormState = {
  author_name: '',
  vehicle: '',
  city: '',
  headline: '',
  story_text: '',
};

export function OwnerStoriesPage() {
  const [stories, setStories] = useState<OwnerStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    getOwnerStories()
      .then((s) => {
        setStories(s);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
    window.scrollTo(0, 0);
  }, []);

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (submitSuccess) setSubmitSuccess(false);
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitOwnerStory({
        author_name: form.author_name,
        vehicle: form.vehicle,
        city: form.city,
        headline: form.headline || null,
        story_text: form.story_text,
        use_case: 'Daily',
      });
      setSubmitSuccess(true);
      setForm(EMPTY_FORM);
      // Refresh the stories list
      const refreshed = await getOwnerStories();
      setStories(refreshed);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <div className="animate-pulse space-y-xl">
          <div className="h-[280px] bg-canvas-soft" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            <div className="h-[280px] bg-canvas-soft" />
            <div className="h-[280px] bg-canvas-soft" />
            <div className="h-[280px] bg-canvas-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-editorial px-xl py-5xl">
        <p className="font-serif-body text-body-serif-lg text-body">
          Could not load owner stories. Please try again later.
        </p>
      </div>
    );
  }

  const inputCls =
    'w-full bg-canvas border border-hairline px-lg py-md font-serif-body text-body-serif-md text-ink focus:border-ink transition-colors placeholder:text-hairline';
  const labelCls =
    'font-sans-label text-caption uppercase tracking-[0.4px] text-body block mb-sm';

  return (
    <div className="fade-in-up">
      {/* Page hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3xl items-center">
            <div>
              <Eyebrow className="text-canvas-soft mb-md block">Community</Eyebrow>
              <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
                Real Owner Stories
              </h1>
              <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[560px]">
                No press releases. No marketing spin. Just honest accounts from Indians
                who drive electric every day — the good, the range anxiety, and the
                moments that made it worth it.
              </p>
              <div className="flex items-center gap-xl mt-2xl">
                <div>
                  <p className="font-display text-display-sm text-on-primary">
                    {stories.length}
                  </p>
                  <Eyebrow className="text-canvas-soft block">Stories Shared</Eyebrow>
                </div>
                <div className="w-px h-[40px] bg-ink-soft" />
                <Button href="#submit-story" variant="secondary" size="md">
                  <PenLine className="w-[16px] h-[16px] mr-sm" />
                  Submit Your Story
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <Quote className="w-[120px] h-[120px] text-ink-soft" />
            </div>
          </div>
        </div>
      </section>

      {/* Stories grid */}
      {stories.length > 0 ? (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <SectionHeading
            eyebrow="From the Community"
            title="Latest Stories"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
            {stories.map((s) => (
              <OwnerStoryCard key={s.id} story={s} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-editorial px-xl py-4xl">
          <div className="border border-hairline py-6xl text-center">
            <Users className="w-[40px] h-[40px] text-hairline mx-auto mb-lg" />
            <h3 className="font-display text-display-sm mb-sm">No stories yet</h3>
            <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[400px] mx-auto">
              Be the first to share your EV ownership experience with the community.
            </p>
            <Button href="#submit-story" variant="outline" size="sm">
              Submit Your Story
            </Button>
          </div>
        </section>
      )}

      {/* Submit story form */}
      <section id="submit-story" className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3xl">
            {/* Left intro */}
            <div>
              <Eyebrow className="text-accent mb-md block">Share Your Experience</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-lg">
                Tell us what it's really like to drive electric.
              </h2>
              <p className="font-serif-body text-body-serif-md text-body leading-relaxed mb-xl">
                Your story helps thousands of Indians decide whether an EV is right for
                them. We publish every submission — the highway trips, the charging
                mishaps, and the daily commute wins.
              </p>
              <div className="space-y-md">
                <div className="flex items-start gap-md">
                  <Heart className="w-[18px] h-[18px] text-accent flex-shrink-0 mt-xxs" />
                  <p className="font-serif-body text-body-serif-md text-body">
                    Help others make the switch with real-world insights
                  </p>
                </div>
                <div className="flex items-start gap-md">
                  <Users className="w-[18px] h-[18px] text-ink flex-shrink-0 mt-xxs" />
                  <p className="font-serif-body text-body-serif-md text-body">
                    Join a community of 50,000+ EV owners across India
                  </p>
                </div>
                <div className="flex items-start gap-md">
                  <CheckCircle2 className="w-[18px] h-[18px] text-ink flex-shrink-0 mt-xxs" />
                  <p className="font-serif-body text-body-serif-md text-body">
                    Every story is reviewed and published within 48 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-canvas border border-hairline p-3xl">
              {submitSuccess ? (
                <div className="text-center py-3xl">
                  <CheckCircle2 className="w-[48px] h-[48px] text-ink mx-auto mb-xl" />
                  <h3 className="font-display text-display-sm mb-sm">Story submitted!</h3>
                  <p className="font-serif-body text-body-serif-md text-body mb-xl max-w-[360px] mx-auto">
                    Thank you for sharing your experience. Our team will review your story
                    and publish it within 48 hours.
                  </p>
                  <Button
                    onClick={() => setSubmitSuccess(false)}
                    variant="outline"
                    size="sm"
                  >
                    Submit Another Story
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-lg">
                  <div className="flex items-center gap-sm border-b border-ink pb-md mb-lg">
                    <PenLine className="w-[18px] h-[18px] text-ink" />
                    <h3 className="font-sans-label text-body-md-strong uppercase tracking-[0.3px] text-ink">
                      Your Story
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
                      <label className={labelCls}>Your Name</label>
                      <input
                        type="text"
                        required
                        value={form.author_name}
                        onChange={(e) => update('author_name', e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Vehicle</label>
                      <input
                        type="text"
                        required
                        value={form.vehicle}
                        onChange={(e) => update('vehicle', e.target.value)}
                        placeholder="e.g. Tata Nexon EV"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>City</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => update('city', e.target.value)}
                        placeholder="e.g. Mumbai"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Headline (optional)</label>
                      <input
                        type="text"
                        value={form.headline}
                        onChange={(e) => update('headline', e.target.value)}
                        placeholder="e.g. 6 months and 8,000 km later"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Your Story</label>
                    <textarea
                      required
                      rows={6}
                      value={form.story_text}
                      onChange={(e) => update('story_text', e.target.value)}
                      placeholder="Tell us about your EV experience — why you bought it, what you love, what surprised you, and what you'd tell someone considering the switch..."
                      className={`${inputCls} resize-y min-h-[140px]`}
                    />
                    <p className="font-sans-label text-caption text-body mt-xs">
                      {form.story_text.length} characters · aim for 150–500 words
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-md border-t border-hairline">
                    <p className="font-sans-label text-caption text-body">
                      By submitting, you agree to our community guidelines.
                    </p>
                    <Button type="submit" size="md" className={submitting ? 'opacity-50 pointer-events-none' : ''}>
                      <Send className="w-[14px] h-[14px] mr-sm" />
                      {submitting ? 'Submitting...' : 'Submit Story'}
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
              <Eyebrow className="text-canvas-soft mb-xs block">Explore More</Eyebrow>
              <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px] mb-sm text-on-primary">
                Read expert reviews of every EV.
              </h2>
              <p className="font-serif-body text-body-serif-md text-canvas-soft leading-snug max-w-[520px]">
                Combine owner experiences with our independent expert road tests for the
                full picture.
              </p>
            </div>
            <Button to="/consumers/reviews" variant="secondary" className="whitespace-nowrap">
              Browse Reviews <ArrowRight className="w-[16px] h-[16px] ml-sm" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
