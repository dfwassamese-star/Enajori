import { Timestamp } from './common';

export interface DonationEvent {
  title: string;
  description: string;
  goal: number;
  amounts: number[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type DonationEventWithId = DonationEvent & { id: string };
