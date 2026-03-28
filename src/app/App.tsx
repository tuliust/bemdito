import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { DesignSystemProvider } from '@/lib/contexts/DesignSystemContext';

export default function App() {
  return (
    <DesignSystemProvider>
      <RouterProvider 
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
      <Toaster position="bottom-right" closeButton />
    </DesignSystemProvider>
  );
}