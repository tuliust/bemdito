import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { DesignSystemProvider } from '@/lib/contexts/DesignSystemContext';

/**
 * Custom render function que envolve componente com providers necessários
 * 
 * @example
 * renderWithProviders(<MyComponent />);
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <DesignSystemProvider>
        {children}
      </DesignSystemProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { renderWithProviders as render };
