import {
  query, where, getDocs, getDoc, addDoc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { getBannersRef, bannerDoc } from '@/lib/firebase/collections';
import { createTimestamp, stripUndefinedDeep } from '@/lib/utils/firestore';
import type { Banner, WithId } from '@/types';

export const DEFAULT_BANNERS: Omit<Banner, 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Assam in Dallas',
    description: 'Connecting cultures, celebrating heritage, and building community. Our association proudly promotes the rich traditions and vibrant spirit of Assam and North East India, creating meaningful cultural bridges and empowering our community to thrive as an integral part of Dallas, USA\u2019s diverse multicultural landscape.',
    lang: 'en',
    image: '/images/banners/bg-1.png',
    isActive: true,
    order: 1,
  },
  {
    title: 'Assam in Dallas',
    description: '\u09B8\u0982\u09B8\u09CD\u0995\u09C3\u09A4\u09BF\u0995 \u09B8\u0982\u09AF\u09CB\u0997 \u0997\u09A2\u09BC\u09BF \u09A4\u09C1\u09B2\u09BF, \u0990\u09A4\u09BF\u09B9\u09CD\u09AF \u0989\u09A6\u09AF\u09BE\u09AA\u09A8 \u0995\u09F0\u09BF \u0986\u09F0\u09C1 \u098F\u0995 \u09B6\u0995\u09CD\u09A4\u09BF\u09B6\u09BE\u09B2\u09C0 \u09B8\u09AE\u09BE\u099C \u0997\u09A2\u09BC\u09BE\u09F0 \u09B2\u0995\u09CD\u09B7\u09CD\u09AF\u09F0\u09C7 \u0986\u09AE\u09BE\u09F0 \u09B8\u0982\u09B8\u09CD\u09A5\u09BE\u0987 \u0997\u09CC\u09F0\u09F1\u09C7\u09F0\u09C7 \u0985\u09B8\u09AE\u09F0 \u09B2\u0997\u09A4\u09C7 \u0989\u09A4\u09CD\u09A4\u09F0-\u09AA\u09C2\u09F0\u09CD\u09AC \u09AD\u09BE\u09F0\u09A4\u09F0 \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7 \u09AA\u09F0\u09AE\u09CD\u09AA\u09F0\u09BE \u0986\u09F0\u09C1 \u09B8\u099C\u09C0\u09F1 \u09B8\u0982\u09B8\u09CD\u0995\u09C3\u09A4\u09BF\u0995 \u0986\u0997\u09AC\u09A2\u09BC\u09BE\u0987 \u0986\u09B9\u09BF\u099B\u09C7\u0964 \u0986\u09AE\u09BF \u0985\u09F0\u09CD\u09A5\u09AC\u09B9 \u09B8\u09BE\u0982\u09B8\u09CD\u0995\u09C3\u09A4\u09BF\u0995 \u09B8\u09AE\u09CD\u09AA\u09F0\u09CD\u0995 \u09B8\u09CD\u09A5\u09BE\u09AA\u09A8 \u0995\u09F0\u09BF \u0986\u09AE\u09BE\u09F0 \u09B8\u09AE\u09BE\u099C\u0995 \u09B6\u0995\u09CD\u09A4\u09BF\u09B6\u09BE\u09B2\u09C0 \u0995\u09F0\u09BF \u09A4\u09C1\u09B2\u09BF\u09AC\u09B2\u09C8 \u09AA\u09CD\u09F0\u09A4\u09BF\u09B6\u09CD\u09F0\u09C1\u09A4\u09BF\u09AC\u09A6\u09CD\u09A7, \u09AF\u09BE\u09A4\u09C7 \u09A1\u09BE\u09B2\u09BE\u099B, \u0986\u09AE\u09C7\u09F0\u09BF\u0995\u09BE\u09F0 \u09AC\u09C8\u099A\u09BF\u09A4\u09CD\u09F0\u09AE\u09AF\u09BC \u09AC\u09B9\u09C1\u09B8\u09BE\u0982\u09B8\u09CD\u0995\u09C3\u09A4\u09BF\u0995 \u09B8\u09AE\u09BE\u099C\u09F0 \u098F\u0995 \u0985\u09AC\u09BF\u099A\u09CD\u099B\u09C7\u09A6\u09CD\u09AF \u0985\u0982\u09B6 \u09B9\u09BF\u099A\u09BE\u09AA\u09C7 \u0986\u09AE\u09BE\u09F0 \u09B8\u09AE\u09BE\u099C \u0989\u09A8\u09CD\u09A8\u09A4\u09BF \u09B2\u09BE\u09AD \u0995\u09F0\u09C7\u0964',
    lang: 'as',
    image: '/images/banners/bg-2.png',
    isActive: true,
    order: 2,
  },
];

export async function getActiveBanners(): Promise<WithId<Banner>[]> {
  const q = query(getBannersRef(), where('isActive', '==', true));
  const snap = await getDocs(q);
  const banners = snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<Banner>));
  return banners.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getAllBanners(): Promise<WithId<Banner>[]> {
  const snap = await getDocs(getBannersRef());
  const banners = snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<Banner>));
  return banners.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getBannerById(id: string): Promise<WithId<Banner> | null> {
  const snap = await getDoc(bannerDoc(id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as WithId<Banner>;
}

export async function createBanner(data: Omit<Banner, 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = createTimestamp();
  const cleaned = stripUndefinedDeep({ ...data, createdAt: now, updatedAt: now });
  const ref = await addDoc(getBannersRef(), cleaned);
  return ref.id;
}

export async function updateBanner(id: string, data: Partial<Banner>): Promise<void> {
  const now = createTimestamp();
  const cleaned = stripUndefinedDeep({ ...data, updatedAt: now });
  await updateDoc(bannerDoc(id), cleaned);
}

export async function deleteBanner(id: string): Promise<void> {
  await deleteDoc(bannerDoc(id));
}

/**
 * Seeds default banners into Firestore if none exist.
 */
export async function ensureDefaultBanners(): Promise<void> {
  const snap = await getDocs(getBannersRef());
  if (snap.size > 0) return;
  for (const banner of DEFAULT_BANNERS) {
    await createBanner(banner);
  }
}
