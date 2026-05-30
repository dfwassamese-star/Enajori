import { generatePageMeta } from '@/lib/constants/seo';
import { ContactPageClient } from './ContactPageClient';

export const metadata = generatePageMeta(
  'Contact',
  'Get in touch with the Assamese community in Dallas. We\'d love to hear from you.'
);

export default function ContactPage() {
  return <ContactPageClient />;
}
