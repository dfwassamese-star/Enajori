'use client';

import { useState, useEffect } from 'react';
import { getSiteConfig, DEFAULT_SITE_CONFIG } from '@/lib/services/siteConfig';

interface SiteIdentity {
  siteName: string;
  siteSubtitle: string;
  siteLogo: string | null;
}

let cached: SiteIdentity | undefined;

export function useSiteIdentity(): SiteIdentity {
  const [identity, setIdentity] = useState<SiteIdentity>(
    cached ?? {
      siteName: DEFAULT_SITE_CONFIG.siteName,
      siteSubtitle: DEFAULT_SITE_CONFIG.siteSubtitle ?? 'USA',
      siteLogo: null,
    }
  );

  useEffect(() => {
    if (cached) return;
    getSiteConfig()
      .then((config) => {
        cached = {
          siteName: config.siteName || DEFAULT_SITE_CONFIG.siteName,
          siteSubtitle: config.siteSubtitle ?? 'USA',
          siteLogo: config.siteLogo || null,
        };
        setIdentity(cached);
      })
      .catch(() => {});
  }, []);

  return identity;
}
