'use client';

import { useState, useEffect } from 'react';

export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  github: string;
}

const defaultLinks: SocialLinks = {
  facebook: 'https://www.facebook.com/profile.php?id=61593591315934',
  twitter: 'https://x.com/Siliconhubs',
  instagram: 'https://www.instagram.com/siliconhubs/',
  linkedin: 'https://www.linkedin.com/in/sharjeel-ahmad-2646361b7/',
  youtube: 'https://www.youtube.com/@SiliconHubsAgency',
  github: 'https://github.com/siliconhubs',
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
