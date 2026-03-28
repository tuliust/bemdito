import { Outlet } from 'react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileConfigProvider } from '../../lib/contexts/MobileConfigContext';

export function PublicLayout() {
  return (
    <MobileConfigProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </MobileConfigProvider>
  );
}