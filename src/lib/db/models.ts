import { ObjectId } from 'mongodb';

// User model
export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

// Project model
export interface Project {
  _id?: ObjectId;
  title: string;
  slug: string;
  client?: string;
  description: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  metrics: { name: string; value: string }[];
  featured: boolean;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Contact submission model
export interface Contact {
  _id?: ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Service model
export interface Service {
  _id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string[];
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Settings model
export interface Settings {
  _id?: ObjectId;
  key: string;
  value: any;
  updatedAt: Date;
}

// Site Content model - for CMS editable content
export interface SiteContent {
  _id?: ObjectId;
  page: string; // 'home', 'about', 'services', 'contact'
  section: string; // 'hero', 'services', 'team', etc.
  content: Record<string, any>; // Flexible content structure
  visible?: boolean; // Whether section is visible on frontend (default: true)
  updatedAt: Date;
  createdAt: Date;
}

// Team Member model
export interface TeamMember {
  _id?: ObjectId;
  name: string;
  role: string;
  image: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Testimonial model (enhanced)
export interface Testimonial {
  _id?: ObjectId;
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  rating: number;
  results: string[];
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Blog post model
export interface BlogPost {
  _id?: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: Date;
  readTime?: number;
  createdAt: Date;
  updatedAt: Date;
}
