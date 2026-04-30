/**
 * Global Block Renderer
 *
 * Renderiza blocos globais (header, footer, modals, etc.)
 */

'use client';

import type { GlobalBlock } from '@/types/cms';
import { Header } from '@/components/global-blocks/Header';
import { MenuOverlay } from '@/components/global-blocks/MenuOverlay';
import { Footer } from '@/components/global-blocks/Footer';
import { SupportModal } from '@/components/global-blocks/SupportModal';
import { FloatingButton } from '@/components/global-blocks/FloatingButton';

/**
 * Global block component registry
 */
const GLOBAL_BLOCK_REGISTRY = {
  header: Header,
  footer: Footer,
  menu_overlay: MenuOverlay,
  support_modal: SupportModal,
  floating_button: FloatingButton,
} as const;

export interface GlobalBlockRendererProps {
  block: GlobalBlock;
  onAction?: (action: string, data?: any) => void;
}

export function GlobalBlockRenderer({ block, onAction }: GlobalBlockRendererProps) {
  if (!block.visible) {
    return null;
  }

  const Component = GLOBAL_BLOCK_REGISTRY[block.type as keyof typeof GLOBAL_BLOCK_REGISTRY];

  if (!Component) {
    console.error(`Global block type not found: ${block.type}`);
    return null;
  }

  const props = {
    ...block.content,
    config: block.config,
    onAction,
  };

  return <Component {...props} />;
}
