import { useEffect } from 'react';
import {
  ShieldCheck, BadgeCheck, Mail, MapPin, ArrowRight, Quote,
} from 'lucide-react';
import {
  Eyebrow, SectionHeading, Button,
} from '../components/ui/Primitives';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

const TEAM: TeamMember[] = [
  {
    name: 'Rahul Kapoor',
    role: 'Editor-in-Chief',
    bio: '20 years in automotive journalism, formerly at Autocar India',
  },
  {
    name: 'Priya Sharma',
    role: 'Senior Editor',
    bio: 'Leads the consumer reviews team, EV owner since 2021',
  },
  {
    name: 'Arjun Mehta',
    role: 'Road Test Editor',
    bio: 'Logs 50,000+ km a year testing every EV sold in India',
  },
  {
    name: 'Sneha Reddy',
    role: 'Staff Writer',
    bio: 'Covers new launches and the two-wheeler EV beat',
  },
  {
    name: 'Vikram Nair',
    role: 'Technology Correspondent',
    bio: 'Decodes battery tech and manufacturing',
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Independence Pledge',
    body: 'We accept no advertising that influences coverage. Editorial decisions are made by journalists, not sales teams. When a car is bad, we say so — plainly and in print.',
  },
  {
    icon: BadgeCheck,
    title: 'No-Paid-Review Policy',
    body: 'No manufacturer pays for a review, a score, or a headline. Every vehicle is tested on the same roads, under the same conditions, with the same checklist. Our ratings cannot be bought.',
  },
  {
    icon: Quote,
    title: 'Plain Language',
    body: 'We write for the reader who is making the biggest purchase decision of their year — not for press release recycling. No jargon without explanation, no hype without evidence.',
  },
];

export function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fade-in-up">
      {/* Hero */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3xl items-center">
            <div>
              <Eyebrow className="text-canvas-soft mb-md block">About EVDigest</Eyebrow>
              <h1 className="font-display text-display-hero leading-[0.95] tracking-[-0.5px] mb-lg text-on-primary">
                India's editorial EV magazine.
              </h1>
              <p className="font-serif-body text-body-serif-lg text-canvas-soft leading-relaxed max-w-[560px]">
                Built by journalists who got tired of press releases printed as news.
                We test, we question, and we publish what we actually find — for the
                reader, not the brand.
              </p>
              <div className="flex items-center gap-xl mt-2xl">
                <div>
                  <p className="font-display text-display-sm text-on-primary">2021</p>
                  <Eyebrow className="text-canvas-soft block">Founded</Eyebrow>
                </div>
                <div className="w-px h-[40px] bg-ink-soft" />
                <div>
                  <p className="font-display text-display-sm text-on-primary">2M+</p>
                  <Eyebrow className="text-canvas-soft block">Monthly Readers</Eyebrow>
                </div>
                <div className="w-px h-[40px] bg-ink-soft" />
                <div>
                  <p className="font-display text-display-sm text-on-primary">Bengaluru</p>
                  <Eyebrow className="text-canvas-soft block">Headquarters</Eyebrow>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <Quote className="w-[120px] h-[120px] text-ink-soft" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3xl">
          <div className="lg:sticky lg:top-3xl self-start">
            <Eyebrow className="text-accent mb-md block">Our Mission</Eyebrow>
            <h2 className="font-display text-display-md leading-[1.1] tracking-[-0.3px]">
              Why EVDigest exists
            </h2>
          </div>
          <div className="space-y-xl">
            <p className="font-serif-body text-body-serif-lg text-ink leading-relaxed">
              In 2021, a handful of automotive journalists looked at Indian EV
              coverage and saw the same problem everywhere: spec sheets reprinted as
              reviews, launch events covered as news, and range figures quoted
              straight from the brochure. Nobody was telling the reader what an
              electric vehicle was actually like to live with.
            </p>
            <p className="font-serif-body text-body-serif-lg text-body leading-relaxed">
              We started EVDigest to fix that. We are an editorial magazine first —
              meaning we report, we test, we verify, and we publish what we find. We
              are not a marketplace, not a lead-generation engine, and not a place
              where a manufacturer can buy a favourable headline. Every kilometer we
              drive, every number we print, and every verdict we deliver answers to
              one reader: the person deciding whether to spend their savings on an
              electric vehicle.
            </p>
            <p className="font-serif-body text-body-serif-lg text-body leading-relaxed">
              India is in the middle of the largest mobility shift in a generation.
              Millions of first-time buyers are making a decision they cannot easily
              undo. They deserve coverage written like journalism, not marketing —
              clear about what works, honest about what doesn't, and useful long
              after the launch hype fades. That is the magazine we set out to build,
              and the standard we hold every story to.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-canvas-soft border-y border-hairline py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <SectionHeading eyebrow="The Newsroom" title="Meet the Team" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-canvas border border-hairline hover:border-ink transition-colors p-xl flex flex-col"
              >
                <div className="flex items-center gap-lg mb-lg">
                  <div className="w-[64px] h-[64px] rounded-full bg-ink text-on-primary flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-[28px]">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-[20px] leading-[1.15] tracking-[-0.2px] text-ink">
                      {member.name}
                    </h3>
                    <p className="font-sans-label text-caption uppercase tracking-[0.4px] text-accent mt-xxs">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="font-serif-body text-body-serif-md text-body leading-snug">
                  {member.bio}
                </p>
              </div>
            ))}
            {/* Editorial standards card to balance grid */}
            <div className="bg-ink text-on-primary p-xl flex flex-col justify-between">
              <div>
                <ShieldCheck className="w-[32px] h-[32px] text-on-primary mb-lg" />
                <h3 className="font-display text-[20px] leading-[1.15] tracking-[-0.2px] mb-sm text-on-primary">
                  Editorial Standards
                </h3>
                <p className="font-serif-body text-body-serif-md text-canvas-soft leading-snug">
                  Every story is fact-checked, every review driven on real roads. No
                  exceptions for advertisers, partners, or friends.
                </p>
              </div>
              <Button href="/contact" variant="secondary" size="sm" className="mt-xl self-start">
                Talk to the desk <ArrowRight className="w-[14px] h-[14px] ml-sm" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values / editorial policy */}
      <section className="mx-auto max-w-editorial px-xl py-4xl">
        <SectionHeading eyebrow="Editorial Policy" title="What We Stand For" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="border-t-2 border-ink pt-xl flex flex-col"
            >
              <value.icon className="w-[28px] h-[28px] text-ink mb-lg" />
              <h3 className="font-display text-[22px] leading-[1.15] tracking-[-0.2px] mb-sm">
                {value.title}
              </h3>
              <p className="font-serif-body text-body-serif-md text-body leading-relaxed">
                {value.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3xl border border-ink p-xl bg-canvas-soft">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-lg">
            <p className="font-serif-body text-body-serif-lg text-ink leading-snug max-w-[640px]">
              These aren't aspirations. They're the rules we fire ourselves over.
              If we ever break them, we expect you to hold us to account.
            </p>
            <Button href="/contact" variant="primary" size="md" className="whitespace-nowrap">
              Hold Us Accountable <ArrowRight className="w-[16px] h-[16px] ml-sm" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-ink text-on-primary py-4xl">
        <div className="mx-auto max-w-editorial px-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-xl">
            <div className="flex flex-col gap-md">
              <div className="flex items-center gap-md">
                <Mail className="w-[20px] h-[20px] text-canvas-soft" />
                <p className="font-serif-body text-body-serif-md text-on-primary">hello@evdigest.in</p>
              </div>
              <div className="flex items-center gap-md">
                <MapPin className="w-[20px] h-[20px] text-canvas-soft" />
                <p className="font-serif-body text-body-serif-md text-on-primary">Bengaluru, India</p>
              </div>
            </div>
            <Button to="/contact" variant="secondary" className="whitespace-nowrap">
              Get in Touch <ArrowRight className="w-[16px] h-[16px] ml-sm" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
