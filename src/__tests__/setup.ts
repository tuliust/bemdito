import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock console para testes (evitar logs desnecessários)
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  // Manter console.log para debug se necessário
  log: console.log,
};
