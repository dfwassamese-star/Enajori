import {
  query, where, orderBy, getDocs, getDoc, addDoc, updateDoc, deleteDoc, limit
} from 'firebase/firestore';
import { getPerformancesRef, performanceDoc } from '@/lib/firebase/collections';
import { createTimestamp } from '@/lib/utils/firestore';
import type { Performance, WithId } from '@/types';

export async function getPublishedPerformances(eventId?: string): Promise<WithId<Performance>[]> {
  let q;
  if (eventId) {
    q = query(getPerformancesRef(), where('isPublished', '==', true), where('eventId', '==', eventId), orderBy('order', 'asc'));
  } else {
    q = query(getPerformancesRef(), where('isPublished', '==', true), orderBy('eventYear', 'desc'), limit(50));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<Performance>));
}

export async function getPerformanceById(id: string): Promise<WithId<Performance> | null> {
  const snap = await getDoc(performanceDoc(id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as WithId<Performance>;
}

export async function createPerformance(data: Omit<Performance, 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = createTimestamp();
  const ref = await addDoc(getPerformancesRef(), { ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updatePerformance(id: string, data: Partial<Performance>): Promise<void> {
  const now = createTimestamp();
  await updateDoc(performanceDoc(id), { ...data, updatedAt: now });
}

export async function deletePerformance(id: string): Promise<void> {
  await deleteDoc(performanceDoc(id));
}

export async function getAllPerformances(): Promise<WithId<Performance>[]> {
  const q = query(getPerformancesRef(), orderBy('eventYear', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<Performance>));
}
