import {
  query, where, orderBy, getDocs, getDoc, addDoc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { getMembersRef, memberDoc } from '@/lib/firebase/collections';
import { createTimestamp, stripUndefined } from '@/lib/utils/firestore';
import type { Member, WithId } from '@/types';

export async function getPublishedMembers(): Promise<WithId<Member>[]> {
  const q = query(getMembersRef(), where('isPublished', '==', true), where('isActive', '==', true), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<Member>));
}

export async function getMemberById(id: string): Promise<WithId<Member> | null> {
  const snap = await getDoc(memberDoc(id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as WithId<Member>;
}

export async function getPerformers(): Promise<WithId<Member>[]> {
  const q = query(getMembersRef(), where('isPublished', '==', true), where('isActive', '==', true));
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as WithId<Member>))
    .filter(m => m.performerProfile);
}

export async function createMember(data: Omit<Member, 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = createTimestamp();
  const cleaned = stripUndefined({ ...data, createdAt: now, updatedAt: now });
  const ref = await addDoc(getMembersRef(), cleaned);
  return ref.id;
}

export async function updateMember(id: string, data: Partial<Member>): Promise<void> {
  const now = createTimestamp();
  const cleaned = stripUndefined({ ...data, updatedAt: now });
  await updateDoc(memberDoc(id), cleaned);
}

export async function deleteMember(id: string): Promise<void> {
  await deleteDoc(memberDoc(id));
}

export async function getAllMembers(): Promise<WithId<Member>[]> {
  const q = query(getMembersRef(), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<Member>));
}
