import {
  getDocs, getDoc, addDoc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { getDonationEventsRef, donationEventDoc } from '@/lib/firebase/collections';
import { createTimestamp, stripUndefined } from '@/lib/utils/firestore';
import type { DonationEvent, DonationEventWithId } from '@/types';

export type { DonationEvent, DonationEventWithId };

export const DEFAULT_DONATION_EVENT: Omit<DonationEvent, 'createdAt' | 'updatedAt'> = {
  title: 'Support Our Community',
  description: 'Your generous donation helps us preserve Assamese culture and organize community events across the USA.',
  goal: 10000,
  amounts: [25, 50, 100, 250],
  isActive: true,
};

export async function getAllDonationEvents(): Promise<DonationEventWithId[]> {
  const snap = await getDocs(getDonationEventsRef());
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as DonationEventWithId));
  return items.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

export async function getActiveDonationEvent(): Promise<DonationEventWithId | null> {
  const snap = await getDocs(getDonationEventsRef());
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as DonationEventWithId));
  return items.find(e => e.isActive) || null;
}

export async function getDonationEventById(id: string): Promise<DonationEventWithId | null> {
  const snap = await getDoc(donationEventDoc(id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as DonationEventWithId;
}

export async function createDonationEvent(data: Omit<DonationEvent, 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = createTimestamp();
  const cleaned = stripUndefined({ ...data, createdAt: now, updatedAt: now });
  const ref = await addDoc(getDonationEventsRef(), cleaned);
  return ref.id;
}

export async function updateDonationEvent(id: string, data: Partial<DonationEvent>): Promise<void> {
  const now = createTimestamp();
  const cleaned = stripUndefined({ ...data, updatedAt: now });
  await updateDoc(donationEventDoc(id), cleaned);
}

export async function deleteDonationEvent(id: string): Promise<void> {
  await deleteDoc(donationEventDoc(id));
}

export async function ensureDefaultDonationEvent(): Promise<void> {
  const snap = await getDocs(getDonationEventsRef());
  if (snap.size > 0) return;
  await createDonationEvent(DEFAULT_DONATION_EVENT);
}
