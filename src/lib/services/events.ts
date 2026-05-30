import {
  query, where, orderBy, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, limit, startAfter, type DocumentSnapshot
} from 'firebase/firestore';
import { getEventsRef, eventDoc } from '@/lib/firebase/collections';
import { createTimestamp } from '@/lib/utils/firestore';
import type { Event, WithId, PaginatedResult } from '@/types';

export async function getPublishedEvents(pageSize = 20, lastDoc?: DocumentSnapshot): Promise<PaginatedResult<WithId<Event>>> {
  let q = query(
    getEventsRef(),
    where('isPublished', '==', true),
    orderBy('year', 'desc'),
    orderBy('order', 'asc'),
    limit(pageSize + 1)
  );
  if (lastDoc) q = query(q, startAfter(lastDoc));

  const snap = await getDocs(q);
  const items = snap.docs.slice(0, pageSize).map(d => ({ id: d.id, ...d.data() } as WithId<Event>));
  return {
    items,
    lastDoc: snap.docs[pageSize - 1] || null,
    hasMore: snap.docs.length > pageSize,
  };
}

export async function getFeaturedEvents(): Promise<WithId<Event>[]> {
  const q = query(
    getEventsRef(),
    where('isPublished', '==', true),
    where('isFeatured', '==', true),
    orderBy('year', 'desc'),
    limit(4)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<Event>));
}

export async function getEventBySlug(year: number, slug: string): Promise<WithId<Event> | null> {
  const q = query(getEventsRef(), where('year', '==', year), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as WithId<Event>;
}

export async function getEventById(id: string): Promise<WithId<Event> | null> {
  const snap = await getDoc(eventDoc(id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as WithId<Event>;
}

export async function createEvent(data: Omit<Event, 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = createTimestamp();
  const ref = await addDoc(getEventsRef(), { ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<void> {
  const now = createTimestamp();
  await updateDoc(eventDoc(id), { ...data, updatedAt: now });
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(eventDoc(id));
}

export async function getAllEvents(): Promise<WithId<Event>[]> {
  const q = query(getEventsRef(), orderBy('year', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<Event>));
}
