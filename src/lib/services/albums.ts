import {
  query, where, getDocs, getDoc, addDoc, updateDoc, deleteDoc, limit
} from 'firebase/firestore';
import { getAlbumsRef, albumDoc } from '@/lib/firebase/collections';
import { createTimestamp, stripUndefined } from '@/lib/utils/firestore';
import type { Album, WithId } from '@/types';

export async function getAllAlbums(): Promise<WithId<Album>[]> {
  const snap = await getDocs(getAlbumsRef());
  const albums = snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<Album>));
  return albums.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

export async function getPublishedAlbums(parentId?: string | null): Promise<WithId<Album>[]> {
  const q = query(getAlbumsRef(), where('isPublished', '==', true));
  const snap = await getDocs(q);
  let albums = snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<Album>));

  // Filter by parentId client-side
  if (parentId === null || parentId === undefined) {
    albums = albums.filter(a => !a.parentId);
  } else {
    albums = albums.filter(a => a.parentId === parentId);
  }

  return albums.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getAlbumById(id: string): Promise<WithId<Album> | null> {
  const snap = await getDoc(albumDoc(id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as WithId<Album>;
}

export async function getAlbumBySlug(slug: string): Promise<WithId<Album> | null> {
  const q = query(getAlbumsRef(), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as WithId<Album>;
}

export async function createAlbum(data: Omit<Album, 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = createTimestamp();
  const cleaned = stripUndefined({ ...data, createdAt: now, updatedAt: now });
  const ref = await addDoc(getAlbumsRef(), cleaned);
  return ref.id;
}

export async function updateAlbum(id: string, data: Partial<Album>): Promise<void> {
  const now = createTimestamp();
  const cleaned = stripUndefined({ ...data, updatedAt: now });
  await updateDoc(albumDoc(id), cleaned);
}

export async function deleteAlbum(id: string): Promise<void> {
  await deleteDoc(albumDoc(id));
}
