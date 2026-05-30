import {
  query, where, orderBy, getDocs, addDoc, updateDoc, deleteDoc, limit, startAfter, type DocumentSnapshot
} from 'firebase/firestore';
import { getMediaRef, mediaDoc } from '@/lib/firebase/collections';
import { createTimestamp } from '@/lib/utils/firestore';
import type { MediaItem, WithId, PaginatedResult } from '@/types';

export async function getPublishedMedia(
  type?: 'photo' | 'video',
  year?: number,
  pageSize = 24,
  lastDoc?: DocumentSnapshot
): Promise<PaginatedResult<WithId<MediaItem>>> {
  const conditions = [where('isPublished', '==', true)];
  if (type) conditions.push(where('type', '==', type));
  if (year) conditions.push(where('year', '==', year));

  let q = query(getMediaRef(), ...conditions, orderBy('year', 'desc'), limit(pageSize + 1));
  if (lastDoc) q = query(q, startAfter(lastDoc));

  const snap = await getDocs(q);
  const items = snap.docs.slice(0, pageSize).map(d => ({ id: d.id, ...d.data() } as WithId<MediaItem>));
  return {
    items,
    lastDoc: snap.docs[pageSize - 1] || null,
    hasMore: snap.docs.length > pageSize,
  };
}

export async function createMediaItem(data: Omit<MediaItem, 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = createTimestamp();
  const ref = await addDoc(getMediaRef(), { ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updateMediaItem(id: string, data: Partial<MediaItem>): Promise<void> {
  const now = createTimestamp();
  await updateDoc(mediaDoc(id), { ...data, updatedAt: now });
}

export async function getMediaByAlbumId(albumId: string): Promise<WithId<MediaItem>[]> {
  const q = query(getMediaRef(), where('albumId', '==', albumId));
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<MediaItem>));
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getPublishedMediaByAlbumId(albumId: string): Promise<WithId<MediaItem>[]> {
  const q = query(getMediaRef(), where('albumId', '==', albumId));
  const snap = await getDocs(q);
  const items = snap.docs
    .map(d => ({ id: d.id, ...d.data() } as WithId<MediaItem>))
    .filter(item => item.isPublished);
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getMediaCountByAlbumId(albumId: string): Promise<number> {
  const q = query(getMediaRef(), where('albumId', '==', albumId));
  const snap = await getDocs(q);
  return snap.docs.filter(d => (d.data() as MediaItem).isPublished).length;
}

export async function deleteMediaItem(id: string): Promise<void> {
  await deleteDoc(mediaDoc(id));
}
