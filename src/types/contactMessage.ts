import { Timestamp } from './common';

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Timestamp;
}

export type ContactMessageWithId = ContactMessage & { id: string };
