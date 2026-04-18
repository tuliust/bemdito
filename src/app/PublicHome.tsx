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

        // Load home page
        const pageData = await getPageBySlug('/');
        if (!pageData) {
          setError('Home page not found in database');
          return;
        }

        console.log('Page loaded successfully:', {
          title: pageData.title,
          sections_count: pageData.sections?.length || 0,
        });

        // Load global blocks
        const blocksData = await getGlobalBlocks();

        console.log('Global blocks loaded:', {
          count: blocksData.length,
          types: blocksData.map(b => b.type),
        });

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

  const handleGlobalAction = (action: string, data?: any) => {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="max-w-2xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-red-700 font-bold text-lg mb-2">⚠️ Database Not Configured</h2>
            <p className="text-red-600 mb-4">
              {error || 'Home page not found in database'}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-blue-900 font-semibold mb-3">📋 Setup Instructions:</h3>
            <ol className="text-blue-800 space-y-2 text-sm list-decimal list-inside">
              <li>
                Open Supabase SQL Editor:{' '}
                <a
                  href="https://supabase.com/dashboard/project/ttxaaagqtihwapvtgxtc/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600 hover:text-blue-700"
                >
                  Click here
                </a>
              </li>
              <li>
                Copy and execute the contents of{' '}
                <code className="bg-blue-100 px-1 rounded">database-seed-fixed.sql</code>
              </li>
              <li>
                Wait for the SQL to complete (should create 1 site, 12 templates, 1 home page, 12 sections)
              </li>
              <li>
                Refresh this page
              </li>
            </ol>
          </div>

          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🔍 Troubleshooting:</h4>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Check if tables exist in Supabase Table Editor</li>
              <li>• Verify the SQL executed without errors</li>
              <li>• Look for a page with slug "/" and status "published"</li>
              <li>• Check browser console for detailed error messages</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Render global blocks */}
      {globalBlocks.map((block) => {
        // Add state props for interactive blocks
        const blockProps: any = {};
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

      {/* Render page content */}
      <main>
        <PageRenderer page={page} />
      </main>
    </div>
  );
}
