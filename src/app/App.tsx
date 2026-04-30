import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AdminLayout } from '@/admin/layouts/AdminLayout';
import { Dashboard } from '@/admin/pages/Dashboard';
import { PagesList } from '@/admin/pages/PagesList';
import { PageEditor } from '@/admin/pages/PageEditor';
import { PublicHome } from './PublicHome';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicHome />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pages" element={<PagesList />} />
          <Route path="global-blocks" element={<div className="p-8">Global Blocks (Coming Soon)</div>} />
          <Route path="media" element={<div className="p-8">Media Library (Coming Soon)</div>} />
          <Route path="design-system" element={<div className="p-8">Design System (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
        </Route>

        {/* Page Editor - Full screen (outside AdminLayout) */}
        <Route path="/admin/pages/:pageId/edit" element={<PageEditor />} />

      </Routes>
    </BrowserRouter>
  );
}