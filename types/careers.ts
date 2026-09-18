/**
 * Careers / Recruitment shared type definitions.
 * Used by public career pages, the CMS/API layer and admin pages.
 */
import { ObjectId } from 'mongodb';

export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Freelance'
  | 'Internship';

export type ExperienceLevel =
  | 'Entry Level'
  | 'Junior'
  | 'Mid Level'
  | 'Senior'
  | 'Lead'
  | 'Manager'
  | 'Internship';

export type RemoteStatus = 'remote' | 'hybrid' | 'on-site';

export interface CareerJob {
  _id?: ObjectId | string;
  title: string;
  slug: string;
  department: string;
  employmentType: EmploymentType | string;
  experienceLevel: ExperienceLevel | string;
  /** Human readable location, e.g. "Remote — Worldwide" or "Lahore, Pakistan (Hybrid)" */
  location: string;
  /** Geo fields used for GEO / JobPosting structured data */
  city?: string;
  country?: string;
  remoteStatus: RemoteStatus | string;
  shortDescription: string;
  /** Rich HTML (CMS RichTextEditor) */
  description: string;
  responsibilities: string;
  requirements: string;
  niceToHave?: string;
  benefits?: string;
  skills: string[];
  /** Optional human-readable salary string ("$60k – $80k / year"). Only shown if provided. */
  salary?: string;
  featuredImage?: string;
  featured: boolean;
  status: 'open' | 'closed';
  published: boolean;
  archived: boolean;
  publishedAt?: Date | string;
  closingDate?: Date | string;
  /** Random token enabling secure draft previews via ?preview= */
  previewKey?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ResumeFile {
  imagekitFileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  format?: string;
}

export interface ApplicationNote {
  text: string;
  author: string;
  createdAt: Date | string;
}

export interface StageHistoryEntry {
  from: string;
  to: string;
  changedBy: string;
  note?: string;
  at: Date | string;
}

/** Pipeline stages (order matters). */
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

export interface JobApplication {
  _id?: ObjectId | string;
  /** Public reference like SH-APP-1A2B3C4D */
  referenceId: string;
  jobId?: ObjectId | string;
  jobSlug?: string;
  jobTitle?: string;
  /** True for general / talent-pool applications without a specific job */
  general: boolean;
  candidateId?: ObjectId | string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  currentRole?: string;
  yearsOfExperience?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  expectedSalary?: string;
  availability?: string;
  coverLetter: string;
  additionalInfo?: string;
  resume?: ResumeFile | null;
  consent: boolean;
  stage: ApplicationStage;
  assignedTo?: string;
  internalNotes: ApplicationNote[];
  stageHistory: StageHistoryEntry[];
  source?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Candidate {
  _id?: ObjectId | string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  currentRole?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resume?: ResumeFile | null;
  summary: string;
  firstAppliedAt: Date | string;
  lastAppliedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type InterviewStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Rescheduled'
  | 'No-show';

export interface Interview {
  _id?: ObjectId | string;
  jobId?: ObjectId | string;
  jobTitle?: string;
  candidateId?: ObjectId | string;
  candidateName: string;
  candidateEmail: string;
  type: string;
  date: string;
  time: string;
  timezone?: string;
  interviewer?: string;
  interviewerEmail?: string;
  meetingLink?: string;
  status: InterviewStatus;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CareerFaq {
  question: string;
  answer: string;
}

export interface CareerBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface CareerTestimonial {
  name: string;
  position: string;
  department?: string;
  photo?: string;
  text: string;
}

export interface WhyJoinItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface LifeImage {
  src: string;
  alt: string;
  caption?: string;
}

/** Career page content edited from /admin/careers/settings. */
export interface CareerSettings {
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight?: string;
    description: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
    image: string;
  };
  whyJoin: {
    eyebrow: string;
    title: string;
    titleHighlight?: string;
    subtitle: string;
    items: WhyJoinItem[];
  };
  life: {
    eyebrow: string;
    title: string;
    titleHighlight?: string;
    subtitle: string;
    images: LifeImage[];
  };
  process: {
    eyebrow: string;
    title: string;
    titleHighlight?: string;
    subtitle: string;
    steps: ProcessStep[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    titleHighlight?: string;
    subtitle: string;
    items: CareerTestimonial[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    titleHighlight?: string;
    subtitle: string;
    items: CareerBenefit[];
  };
  faqs: {
    eyebrow: string;
    title: string;
    titleHighlight?: string;
    subtitle: string;
    items: CareerFaq[];
  };
  general: {
    eyebrow: string;
    title: string;
    titleHighlight?: string;
    subtitle: string;
    ctaTitle: string;
    ctaDescription: string;
  };
}
