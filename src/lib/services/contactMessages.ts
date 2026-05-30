import {
  getDocs, addDoc, deleteDoc
} from 'firebase/firestore';
import { getContactMessagesRef, contactMessageDoc } from '@/lib/firebase/collections';
import { createTimestamp } from '@/lib/utils/firestore';
import type { ContactMessage, ContactMessageWithId } from '@/types';

export type { ContactMessage, ContactMessageWithId };

export async function submitContactMessage(data: Omit<ContactMessage, 'createdAt'>): Promise<string> {
  const now = createTimestamp();
  const ref = await addDoc(getContactMessagesRef(), { ...data, createdAt: now });
  return ref.id;
}

export async function getAllContactMessages(): Promise<ContactMessageWithId[]> {
  const snap = await getDocs(getContactMessagesRef());
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessageWithId));
  return items.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

export async function deleteContactMessage(id: string): Promise<void> {
  await deleteDoc(contactMessageDoc(id));
}
