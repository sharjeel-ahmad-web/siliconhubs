/**
 * Careers constants — single source of truth for departments, employment
 * types, experience levels, remote statuses and pipeline stages.
 */
export const CAREER_DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Project Management',
  'Sales',
  'Operations',
  'Internships',
] as const;

export const CAREER_EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
] as const;

export const CAREER_EXPERIENCE_LEVELS = [
  'Entry Level',
  'Junior',
  'Mid Level',
  'Senior',
  'Lead',
  'Manager',
  'Internship',
] as const;

export const CAREER_REMOTE_STATUSES = ['remote', 'hybrid', 'on-site'] as const;

export const APPLICATION_STAGES = [
  'New',
  'Screening',
  'Shortlisted',
  'Interview',
  'Technical / Role Interview',
  'Final Interview',
  'Offer',
  'Hired',
  'Rejected',
] as const;

export type ApplicationStage = (typeof APPLICATION_STAGES)[number];

export const INTERVIEW_TYPES = [
  'Phone Screen',
  'Technical',
  'Role / Behavioral',
  'Final Interview',
  'HR / Culture Fit',
] as const;

export const INTERVIEW_STATUSES = [
  'Scheduled',
  'Confirmed',
  'Completed',
  'Cancelled',
  'Rescheduled',
  'No-show',
] as const;

export const REMOTE_STATUS_LABELS: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  'on-site': 'On-site',
};

/** Icon names accepted by the careers benefit / why-join editors. */
export const CAREER_ICONS = [
  'rocket',
  'briefcase',
  'sparkles',
  'book-open',
  'laptop',
  'users',
  'heart',
  'star',
  'target',
  'award',
  'clock',
  'trending-up',
  'shield',
  'graduation-cap',
  'coffee',
  'globe',
  'zap',
  'lightbulb',
] as const;

/** Default careers page content when nothing has been configured in the CMS. */
export const DEFAULT_CAREER_SETTINGS = {
  hero: {
    eyebrow: 'Careers at SiliconHubs',
    title: 'Build a Career That',
    titleHighlight: 'Makes an Impact',
    description:
      'Join a team of designers, engineers and strategists crafting premium digital products for ambitious brands. Grow fast, own your work and do the best work of your career.',
    primaryCta: { text: 'View Open Positions', href: '#open-positions' },
    secondaryCta: { text: 'Life at SiliconHubs', href: '#life-at-siliconhubs' },
    image: '/media/about/team/sarah.png',
  },
  whyJoin: {
    eyebrow: 'Why Join SiliconHubs',
    title: 'Build Careers with',
    titleHighlight: 'Real Momentum',
    subtitle:
      'We invest in people as much as we invest in products. Here is what you can expect when you join.',
    items: [
      {
        icon: 'trending-up',
        title: 'Career Growth',
        description:
          'Defined progression paths, mentorship and promotion opportunities built around your ambitions.',
      },
      {
        icon: 'briefcase',
        title: 'Meaningful Projects',
        description:
          'Work on real digital products — websites, automations and AI solutions — for brands that matter.',
      },
      {
        icon: 'book-open',
        title: 'Learning & Development',
        description:
          'Dedicated learning budgets, knowledge-sharing sessions and exposure to modern tools and frameworks.',
      },
      {
        icon: 'laptop',
        title: 'Flexible Work',
        description:
          'Remote-first culture with flexible hours so you can do your best work from wherever you are.',
      },
      {
        icon: 'users',
        title: 'Collaborative Culture',
        description:
          'Small, cross-functional squads where everyone contributes and every idea is heard.',
      },
      {
        icon: 'lightbulb',
        title: 'Innovation',
        description:
          'We experiment with AI, automation and new technologies — and we expect you to challenge the status quo.',
      },
      {
        icon: 'target',
        title: 'Ownership',
        description:
          'Take end-to-end responsibility for meaningful outcomes. Your work has a visible impact on real clients.',
      },
      {
        icon: 'award',
        title: 'Professional Growth',
        description:
          'Regular feedback, personal goals and quarterly reviews keep your career moving in the right direction.',
      },
    ],
  },
  life: {
    eyebrow: 'Life at SiliconHubs',
    title: 'Work Hard.',
    titleHighlight: 'Celebrate Often.',
    subtitle:
      'Design sprints, team meetups, remote hangouts and behind-the-scenes moments.',
    images: [
      {
        src: '/media/about/team/sarah.png',
        alt: 'SiliconHubs team member',
        caption: 'Design collaboration',
      },
      {
        src: '/media/about/team/alex.png',
        alt: 'SiliconHubs developer pair programming',
        caption: 'Engineering huddles',
      },
      {
        src: '/media/about/team/david.png',
        alt: 'SiliconHubs strategist in a workshop',
        caption: 'Strategy workshops',
      },
      {
        src: '/media/about/team/emily.png',
        alt: 'SiliconHubs marketer at a whiteboard session',
        caption: 'Whiteboard sessions',
      },
      {
        src: '/media/about/team/lisa.png',
        alt: 'SiliconHubs product manager reviewing a demo',
        caption: 'Demo days',
      },
      {
        src: '/media/about/team/marcus.png',
        alt: 'SiliconHubs engineer during a code review',
        caption: 'Team reviews',
      },
    ],
  },
  process: {
    eyebrow: 'Hiring Process',
    title: 'A Transparent Hiring',
    titleHighlight: 'Journey',
    subtitle:
      'We keep our process clear, respectful and fast — you will never be left wondering where you stand.',
    steps: [
      {
        title: 'Application',
        description:
          'Submit your application and CV through the job page. It takes a few minutes.',
      },
      {
        title: 'Application Review',
        description:
          'Our recruitment team reviews your profile and matches it against the role.',
      },
      {
        title: 'Introductory Call',
        description:
          'A relaxed 20–30 minute chat about your experience, the role and the team.',
      },
      {
        title: 'Role / Technical Interview',
        description:
          'A practical conversation with the team — real problems, real solutions.',
      },
      {
        title: 'Final Interview',
        description:
          'Meet the leadership team and talk about impact, growth and your goals.',
      },
      {
        title: 'Offer',
        description:
          'If it is a match, you will receive an offer with clear, competitive terms.',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Team Stories',
    title: 'What Our Team',
    titleHighlight: 'Says',
    subtitle: 'Real words from the people who make SiliconHubs what it is.',
    items: [
      {
        name: 'Sarah Khan',
        position: 'Senior Product Designer',
        department: 'Design',
        photo: '/media/about/testimonials/sarah-chen.jpg',
        text: 'SiliconHubs gave me the space to own projects end-to-end and grow into a leadership role. The team genuinely cares about quality and about people.',
      },
      {
        name: 'Alex Morgan',
        position: 'Full-Stack Engineer',
        department: 'Engineering',
        photo: '/media/about/testimonials/marcus-johnson.jpg',
        text: 'I work on challenging, modern stacks every week and there is always someone to learn from. Remote-friendly, supportive and fast-moving.',
      },
      {
        name: 'Marcus Reed',
        position: 'Automation Specialist',
        department: 'Engineering',
        photo: '/media/about/testimonials/david-kim.jpg',
        text: 'The innovation here is real — AI, automation, new tools. You are encouraged to experiment and bring fresh ideas to the table.',
      },
    ],
  },
  benefits: {
    eyebrow: 'Careers & Benefits',
    title: 'Benefits That',
    titleHighlight: 'Matter',
    subtitle:
      'We look after our team with benefits designed around real needs.',
    items: [
      {
        icon: 'laptop',
        title: 'Flexible Work',
        description:
          'Remote-first work with flexible scheduling and the equipment you need to succeed.',
      },
      {
        icon: 'book-open',
        title: 'Learning & Development',
        description:
          'Learning budgets, courses and conference access to keep you sharp.',
      },
      {
        icon: 'trending-up',
        title: 'Career Growth',
        description:
          'Clear promotion tracks and quarterly growth conversations with your manager.',
      },
      {
        icon: 'clock',
        title: 'Paid Time Off',
        description:
          'Generous annual leave plus public holidays so you can recharge.',
      },
      {
        icon: 'users',
        title: 'Team Culture',
        description:
          'Regular team events, retreats and a culture built on trust and respect.',
      },
      {
        icon: 'award',
        title: 'Recognition',
        description:
          'We celebrate wins — shout-outs, bonuses and growth opportunities for great work.',
      },
      {
        icon: 'briefcase',
        title: 'Meaningful Projects',
        description:
          'Real client work that you can point to with pride in your portfolio.',
      },
    ],
  },
  faqs: {
    eyebrow: 'Careers FAQ',
    title: 'Frequently Asked',
    titleHighlight: 'Questions',
    subtitle:
      'Straight answers about working at SiliconHubs and applying for a role.',
    items: [
      {
        question: 'Does SiliconHubs offer remote opportunities?',
        answer:
          'Yes. Most of our roles are remote-first. Each job posting clearly states its remote, hybrid or on-site status in the listing.',
      },
      {
        question: 'Are there internship opportunities at SiliconHubs?',
        answer:
          'Yes. We open internship positions periodically under the Internships department. Check the open positions section for the latest listings.',
      },
      {
        question: 'How does the application process work?',
        answer:
          'Apply directly through the job page with your CV and a short cover letter. Our team reviews every application and you will hear back from us at each stage of the hiring process.',
      },
      {
        question: 'Can I apply for more than one position at the same time?',
        answer:
          'Yes, you can apply for multiple positions. We recommend focusing on the roles that best match your experience and skills.',
      },
      {
        question: 'How long does the hiring process take?',
        answer:
          'Most processes complete within2–3 weeks from application to offer, depending on the role and scheduling availability.',
      },
      {
        question: 'Can I submit a general application?',
        answer:
          'Absolutely. If you do not see a role that fits, submit a general application below and we will keep your profile in our talent pool for future openings.',
      },
    ],
  },
  general: {
    eyebrow: 'General Applications',
    title: "Don't see the right role?",
    titleHighlight: 'Join Our Talent Pool',
    subtitle:
      'Send us a general application and we will reach out when a matching opportunity opens.',
    ctaTitle: 'Submit a General Application',
    ctaDescription:
      'Tell us about your expertise, share your portfolio and we will be in touch.',
  },
} as const;
