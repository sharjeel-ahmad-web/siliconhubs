'use client';

/**
 * Maps CMS icon names to lucide-react icons for career content blocks
 * (why-join cards, benefits, process). Falls back to a sparkle icon.
 */
import {
  Rocket,
  Briefcase,
  Sparkles,
  BookOpen,
  Laptop,
  Users,
  Heart,
  Star,
  Target,
  Award,
  Clock,
  TrendingUp,
  Shield,
  GraduationCap,
  Coffee,
  Globe,
  Zap,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  rocket: Rocket,
  briefcase: Briefcase,
  sparkles: Sparkles,
  'book-open': BookOpen,
  laptop: Laptop,
  users: Users,
  heart: Heart,
  star: Star,
  target: Target,
  award: Award,
  clock: Clock,
  'trending-up': TrendingUp,
  shield: Shield,
  'graduation-cap': GraduationCap,
  coffee: Coffee,
  globe: Globe,
  zap: Zap,
  lightbulb: Lightbulb,
};

export function CareerIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const Icon = (name && iconMap[name]) || Sparkles;
  return <Icon className={className} />;
}

export default CareerIcon;
