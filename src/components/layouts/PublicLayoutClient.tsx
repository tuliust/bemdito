/**
 * PublicLayoutClient
 *
 * Client component que renderiza blocos globais e gerencia estado.
 */

'use client';

import { useState } from 'react';
import { GlobalBlock } from '@/types/cms';
import { GlobalBlockRenderer } from '@/lib/cms/renderers/GlobalBlockRenderer';

export interface PublicLayoutClientProps {
  children: React.ReactNode;
  globalBlocks: GlobalBlock[];
}

export function PublicLayoutClient({ children, globalBlocks }: PublicLayoutClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Find specific blocks
  const headerBlock = globalBlocks.find((b) => b.type === 'header');
  const footerBlock = globalBlocks.find((b) => b.type === 'footer');
  const menuOverlayBlock = globalBlocks.find((b) => b.type === 'menu_overlay');
  const supportModalBlock = globalBlocks.find((b) => b.type === 'support_modal');
  const floatingButtonBlock = globalBlocks.find((b) => b.type === 'floating_button');

  // Handle global actions
  const handleGlobalAction = (action: string, data?: any) => {
    switch (action) {
      case 'openMenu':
        setIsMenuOpen(true);
        break;
      case 'closeMenu':
        setIsMenuOpen(false);
        break;
      case 'openSupportModal':
        setIsSupportModalOpen(true);
        break;
      case 'closeSupportModal':
        setIsSupportModalOpen(false);
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {headerBlock && (
        <GlobalBlockRenderer
          block={{
            ...headerBlock,
            content: {
              ...headerBlock.content,
              onMenuToggle: () => handleGlobalAction('openMenu'),
            },
          }}
          onAction={handleGlobalAction}
        />
      )}

      {/* Menu Overlay */}
      {menuOverlayBlock && (
        <GlobalBlockRenderer
          block={{
            ...menuOverlayBlock,
            content: {
              ...menuOverlayBlock.content,
              isOpen: isMenuOpen,
              onClose: () => handleGlobalAction('closeMenu'),
            },
          }}
          onAction={handleGlobalAction}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {footerBlock && <GlobalBlockRenderer block={footerBlock} onAction={handleGlobalAction} />}

      {/* Floating Support Button */}
      {floatingButtonBlock && (
        <GlobalBlockRenderer
          block={{
            ...floatingButtonBlock,
            content: {
              ...floatingButtonBlock.content,
              onClick: () => handleGlobalAction('openSupportModal'),
            },
          }}
          onAction={handleGlobalAction}
        />
      )}

      {/* Support Modal */}
      {supportModalBlock && (
        <GlobalBlockRenderer
          block={{
            ...supportModalBlock,
            content: {
              ...supportModalBlock.content,
              isOpen: isSupportModalOpen,
              onClose: () => handleGlobalAction('closeSupportModal'),
            },
          }}
          onAction={handleGlobalAction}
        />
      )}
    </div>
  );
}
