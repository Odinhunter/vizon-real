import type { Metadata } from 'next';
import ProfilePage from '@/components/profile/ProfilePage';

export const metadata: Metadata = {
  title: "Your Profile",
  description: "View your Vizon diagnostic history and track your consulting readiness over time.",
  robots: { index: false, follow: false },
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
