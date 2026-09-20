'use client';

import { useState, useEffect } from 'react';

export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  github: string;
  tiktok: string;
  upwork: string;
  pinterest: string;
  discord: string;
}

const defaultLinks: SocialLinks = {
  facebook: 'https://www.facebook.com/profile.php?id=61593591315934',
  twitter: 'https://x.com/Siliconhubs',
  instagram: 'https://www.instagram.com/siliconhubs/',
  linkedin: 'https://www.linkedin.com/in/sharjeel-ahmad-2646361b7/',
  youtube: 'https://www.youtube.com/@SiliconHubsAgency',
  github: 'https://github.com/siliconhubs',
  tiktok: 'https://www.tiktok.com/@siliconhubs',
  upwork: 'https://www.upwork.com/freelancers/~01ace30ba193ab9962',
  pinterest: 'https://pin.it/7aO5YxU8U',
  discord:
    'https://discord.com/channels/1551286828798320655/1551286830962319372',
};

export function useSocialLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultLinks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const response = await fetch('/api/settings/social');
        if (response.ok) {
          const data = await response.json();
          setSocialLinks(data);
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSocialLinks();
  }, []);

  return { socialLinks, loading };
}
