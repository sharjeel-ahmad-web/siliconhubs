export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  _id?: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Blog {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  images: string[];
  client: string;
  category: string;
  tags: string[];
  technologies: string[];
  featured: boolean;
  status: 'draft' | 'published';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string[];
  price?: string;
  featured: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  rating: number;
  featured: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  featured: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'published';
  updatedAt: Date;
}

export interface Media {
  _id?: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  createdAt: Date;
}

export interface ChatMessage {
  _id?: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SEOSettings {
  _id?: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  keywords: string[];
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
  updatedAt: Date;
}

export interface SiteSettings {
  _id?: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
  };
  updatedAt: Date;
}

export interface NavigationItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  isExternal: boolean;
  children?: NavigationItem[];
}

export interface ChatLog {
  _id?: string;
  sessionId: string;
  messages: ChatMessage[];
  startedAt: Date;
  endedAt?: Date;
}
