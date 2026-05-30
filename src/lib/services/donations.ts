import {
  query, orderBy, getDocs, getDoc, deleteDoc
} from 'firebase/firestore';
import { getDonationsRef, donationDoc } from '@/lib/firebase/collections';
import type { Donation, WithId } from '@/types';

export async function getAllDonations(): Promise<WithId<Donation>[]> {
  const q = query(getDonationsRef(), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as WithId<Donation>));
}

export async function getDonationById(id: string): Promise<WithId<Donation> | null> {
  const snap = await getDoc(donationDoc(id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as WithId<Donation>;
}

export async function deleteDonation(id: string): Promise<void> {
  await deleteDoc(donationDoc(id));
}
