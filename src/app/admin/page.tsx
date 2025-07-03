import type { Metadata } from 'next';
import AdminDashboard from '@/components/AdminDashboard';
import AdminGuard from '@/components/AdminGuard';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Andrew\'s Travel Blog',
  description: 'Admin panel for managing blog posts and travel destinations.',
};

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminDashboard />
      </div>
    </AdminGuard>
  );
}
