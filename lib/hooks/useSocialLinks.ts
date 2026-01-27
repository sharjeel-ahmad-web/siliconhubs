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
  facebook: 'https://facebook.com/risingdot',
  twitter: 'https://twitter.com/risingdot',
  instagram: 'https://instagram.com/risingdot',
  linkedin: 'https://linkedin.com/company/risingdot',
  youtube: '',
  github: 'https://github.com/risingdot',
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
