'use client';

import { useState, useEffect } from 'react';
import { getSiteConfig, DEFAULT_SITE_CONFIG } from '@/lib/services/siteConfig';

type BrandSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxxl' | 'xxxxl';

const nameClassMap: Record<BrandSize, string> = { sm: 'text-base', md: 'text-lg', lg: 'text-xl', xl: 'text-2xl', xxxl: 'text-3xl', xxxxl: 'text-4xl' };
const subtitleClassMap: Record<BrandSize, string> = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm', xl: 'text-base', xxxl: 'text-lg', xxxxl: 'text-xl' };

interface SiteIdentity {
  siteName: string;
  siteSubtitle: string;
  siteLogo: string | null;
  brandLogoSize: BrandSize;
  brandNameClass: string;
  brandSubtitleClass: string;
}

let cached: SiteIdentity | undefined;

export function useSiteIdentity(): SiteIdentity {
  const [identity, setIdentity] = useState<SiteIdentity>(
    cached ?? {
      siteName: DEFAULT_SITE_CONFIG.siteName,
      siteSubtitle: DEFAULT_SITE_CONFIG.siteSubtitle ?? 'USA',
      siteLogo: null,
      brandLogoSize: DEFAULT_SITE_CONFIG.brandLogoSize ?? 'md',
      brandNameClass: nameClassMap[DEFAULT_SITE_CONFIG.brandNameSize ?? 'md'],
      brandSubtitleClass: subtitleClassMap[DEFAULT_SITE_CONFIG.brandSubtitleSize ?? 'md'],
    }
  );

  useEffect(() => {
    if (cached) return;
    getSiteConfig()
      .then((config) => {
        const logoSize = config.brandLogoSize ?? 'md';
        const nameSize = config.brandNameSize ?? 'md';
        const subtitleSize = config.brandSubtitleSize ?? 'md';
        cached = {
          siteName: config.siteName || DEFAULT_SITE_CONFIG.siteName,
          siteSubtitle: config.siteSubtitle ?? 'USA',
          siteLogo: config.siteLogo || null,
          brandLogoSize: logoSize,
          brandNameClass: nameClassMap[nameSize],
          brandSubtitleClass: subtitleClassMap[subtitleSize],
        };
        setIdentity(cached);
      })
      .catch(() => {});
  }, []);

  return identity;
}
