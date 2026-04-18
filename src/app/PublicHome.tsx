import { useState, useEffect } from 'react';
import { PageRenderer } from '@/lib/cms/renderers/PageRenderer';
import { getPageBySlug } from '@/lib/services/pages-service';
import { getGlobalBlocks } from '@/lib/services/global-blocks-service';
import { GlobalBlockRenderer } from '@/lib/cms/renderers/GlobalBlockRenderer';

export function PublicHome() {
  const [page, setPage] = useState<any>(null);
  const [globalBlocks, setGlobalBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const pageData = await getPageBySlug('/');
        if (!pageData) {
          setError('Home page not found in database');
          return;
        }

        const blocksData = await getGlobalBlocks();

        setPage(pageData);
        setGlobalBlocks(blocksData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load page');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleGlobalAction = (action: string) => {
    switch (action) {
      case 'open-menu':
        setIsMenuOpen(true);
        break;
      case 'close-menu':
        setIsMenuOpen(false);
        break;
      case 'open-support':
        setIsSupportModalOpen(true);
        break;
      case 'close-support':
        setIsSupportModalOpen(false);
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-2xl">
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="mb-2 text-lg font-bold text-red-700">Database Not Configured</h2>
            <p className="mb-4 text-red-600">{error || 'Home page not found in database'}</p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-3 font-semibold text-blue-900">Setup Instructions</h3>
            <ol className="list-inside list-decimal space-y-2 text-sm text-blue-800">
              <li>
                Open Supabase SQL Editor:{' '}
                <a
                  href="https://supabase.com/dashboard/project/ttxaaagqtihwapvtgxtc/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700"
                >
                  Click here
                </a>
              </li>
              <li>
                Copy and execute the contents of{' '}
                <code className="rounded bg-blue-100 px-1">database-seed-fixed.sql</code>
              </li>
              <li>Wait for the SQL to complete.</li>
              <li>Refresh this page.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {globalBlocks.map((block) => {
        const blockProps: Record<string, any> = {};
        if (block.type === 'menu_overlay') {
          blockProps.isOpen = isMenuOpen;
          blockProps.onClose = () => handleGlobalAction('close-menu');
        } else if (block.type === 'support_modal') {
          blockProps.isOpen = isSupportModalOpen;
          blockProps.onClose = () => handleGlobalAction('close-support');
        } else if (block.type === 'header') {
          blockProps.onMenuToggle = () => handleGlobalAction('open-menu');
        } else if (block.type === 'floating_button') {
          blockProps.onClick = () => handleGlobalAction('open-support');
        }

        return (
          <GlobalBlockRenderer
            key={block.id}
            block={{ ...block, content: { ...block.content, ...blockProps } }}
            onAction={handleGlobalAction}
          />
        );
      })}

      <main>
        <PageRenderer page={page} />
      </main>
    </div>
  );
}
