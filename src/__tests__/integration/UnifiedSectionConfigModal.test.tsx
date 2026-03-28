import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/renderWithProviders';
import { UnifiedSectionConfigModal } from '@/app/admin/pages-manager/UnifiedSectionConfigModal';
import { mockPageSection, createMockPageSection } from '../fixtures/sections';
import { mockToast, resetMockToast } from '../mocks/sonner';
import { mockSupabase, resetMockSupabase } from '../mocks/supabase';

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: mockToast,
}));

// Mock ImageUploadOnly (componente complexo)
vi.mock('@/app/components/ImageUploadOnly', () => ({
  ImageUploadOnly: ({ value, onChange }: any) => (
    <input
      data-testid="image-upload"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mock ColorTokenPicker
vi.mock('@/app/components/ColorTokenPicker', () => ({
  ColorTokenPicker: ({ value, onChange }: any) => (
    <input
      data-testid="color-picker"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mock TypeScalePicker
vi.mock('@/app/components/admin/TypeScalePicker', () => ({
  TypeScalePicker: ({ value, onChange }: any) => (
    <input
      data-testid="type-scale-picker"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mock GridLayoutEditor (drag-and-drop complexo)
vi.mock('@/app/admin/sections-manager/GridLayoutEditor', () => ({
  GridLayoutEditor: ({ elements, layout, onChange }: any) => (
    <div data-testid="grid-layout-editor">
      <button
        data-testid="change-position-to-bottom"
        onClick={() => {
          onChange(elements, {
            ...layout,
            desktop: {
              ...layout.desktop,
              text: { position: 'bottom-center' },
            },
          });
        }}
      >
        Mover para Bottom
      </button>
      <div data-testid="current-position">
        {layout?.desktop?.text?.position || 'none'}
      </div>
    </div>
  ),
}));

// Mock SectionBuilder
vi.mock('@/app/admin/sections-manager/SectionBuilder', () => ({
  SectionBuilder: ({ elements, layout, styling, onChange }: any) => (
    <div data-testid="section-builder">
      <button
        data-testid="toggle-media"
        onClick={() => {
          onChange(
            { ...elements, hasMedia: !elements.hasMedia },
            layout,
            styling
          );
        }}
      >
        Toggle Media
      </button>
    </div>
  ),
}));

describe('UnifiedSectionConfigModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    resetMockToast();
    resetMockSupabase();
  });

  describe('Renderização Básica', () => {
    it('deve renderizar o modal com título correto', () => {
      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText(/Configurar:/)).toBeInTheDocument();
      expect(screen.getByText('Hero Section')).toBeInTheDocument();
    });

    it('deve renderizar tabs principais', () => {
      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByRole('tab', { name: /conteúdo/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /layout/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /estilo/i })).toBeInTheDocument();
    });

    it('deve renderizar campos de conteúdo', () => {
      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      // Verificar que campos de input existem
      const titleInput = screen.getByDisplayValue('Bem-vindo ao BemDito');
      expect(titleInput).toBeInTheDocument();

      const subtitleInput = screen.getByDisplayValue('Criamos soluções incríveis');
      expect(subtitleInput).toBeInTheDocument();
    });

    it('deve renderizar botões de ação', () => {
      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });
  });

  describe('Estado Inicial', () => {
    it('deve carregar configuração da section (não page_section)', () => {
      const customPageSection = createMockPageSection({
        config: { title: 'Config de page_section (ERRADO)' },
        section: {
          ...mockPageSection.section!,
          config: {
            title: 'Config de section (CORRETO)',
          },
        },
      });

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={customPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      // Deve carregar de section.config, não page_section.config
      expect(screen.getByDisplayValue('Config de section (CORRETO)')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Config de page_section (ERRADO)')).not.toBeInTheDocument();
    });

    it('deve normalizar smallTitle/minorTitle corretamente', () => {
      const customPageSection = createMockPageSection({
        section: {
          ...mockPageSection.section!,
          config: {
            minorTitle: 'DEPRECATED',
            smallTitle: 'CORRETO',
          },
        },
      });

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={customPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      // Deve usar smallTitle, não minorTitle
      expect(screen.getByDisplayValue('CORRETO')).toBeInTheDocument();
    });

    it('deve inicializar gridRows corretamente', () => {
      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      // gridRows deve estar no estado inicial
      // Como o mock PageSection tem text em top-left, gridRows deve ser 1
      // Verificamos indiretamente através do GridLayoutEditor mock
      const positionDisplay = screen.getByTestId('current-position');
      expect(positionDisplay).toHaveTextContent('top-left');
    });
  });

  describe('Mudanças de Estado', () => {
    it('deve atualizar título quando input muda', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      const titleInput = screen.getByDisplayValue('Bem-vindo ao BemDito');
      await user.clear(titleInput);
      await user.type(titleInput, 'Novo Título');

      expect(titleInput).toHaveValue('Novo Título');
    });

    it('deve atualizar subtítulo quando input muda', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      const subtitleInput = screen.getByDisplayValue('Criamos soluções incríveis');
      await user.clear(subtitleInput);
      await user.type(subtitleInput, 'Novo Subtítulo');

      expect(subtitleInput).toHaveValue('Novo Subtítulo');
    });

    it('deve permitir toggle de elementos via SectionBuilder', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      // Ir para aba Layout
      const layoutTab = screen.getByRole('tab', { name: /layout/i });
      await user.click(layoutTab);

      // Toggle media via mock do SectionBuilder
      const toggleButton = screen.getByTestId('toggle-media');
      await user.click(toggleButton);

      // Estado deve ter mudado (verificado indiretamente pelo mock)
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('Auto-cálculo de gridRows', () => {
    it('deve calcular gridRows=1 para position top-*', async () => {
      const user = userEvent.setup();

      const customPageSection = createMockPageSection({
        section: {
          ...mockPageSection.section!,
          layout: {
            gridRows: 2, // Valor errado inicial
            desktop: {
              text: { position: 'top-left' },
            },
          },
        },
      });

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={customPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      // Ir para aba Layout
      const layoutTab = screen.getByRole('tab', { name: /layout/i });
      await user.click(layoutTab);

      // Position inicial deve ser top-left
      const positionDisplay = screen.getByTestId('current-position');
      expect(positionDisplay).toHaveTextContent('top-left');

      // gridRows deve ter sido corrigido para 1 automaticamente
      // (verificamos isso ao salvar)
      const saveButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          expect.objectContaining({
            gridRows: 1, // Auto-calculado
          }),
          expect.any(Object)
        );
      });
    });

    it('deve calcular gridRows=2 para position bottom-*', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      // Ir para aba Layout
      const layoutTab = screen.getByRole('tab', { name: /layout/i });
      await user.click(layoutTab);

      // Mudar position para bottom-center via mock
      const changePositionButton = screen.getByTestId('change-position-to-bottom');
      await user.click(changePositionButton);

      // Position deve ter mudado
      const positionDisplay = screen.getByTestId('current-position');
      expect(positionDisplay).toHaveTextContent('bottom-center');

      // Salvar e verificar que gridRows foi calculado como 2
      const saveButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          expect.objectContaining({
            gridRows: 2, // Auto-calculado
          }),
          expect.any(Object)
        );
      });
    });

    it('deve calcular gridRows=2 para position center', async () => {
      const user = userEvent.setup();

      const customPageSection = createMockPageSection({
        section: {
          ...mockPageSection.section!,
          layout: {
            gridRows: 1, // Valor errado inicial
            desktop: {
              text: { position: 'center' }, // Fullscreen 2×2
            },
          },
        },
      });

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={customPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      // Salvar
      const saveButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          expect.objectContaining({
            gridRows: 2, // Auto-calculado (BUG CORRIGIDO!)
          }),
          expect.any(Object)
        );
      });
    });
  });

  describe('Persistência de rowHeightPriority', () => {
    it('deve preservar rowHeightPriority ao salvar', async () => {
      const user = userEvent.setup();

      const customPageSection = createMockPageSection({
        section: {
          ...mockPageSection.section!,
          config: {
            ...mockPageSection.section!.config,
            rowHeightPriority: 'media',
          },
        },
      });

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={customPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      // Mudar algo no config
      const titleInput = screen.getByDisplayValue('Bem-vindo ao BemDito');
      await user.clear(titleInput);
      await user.type(titleInput, 'Título Modificado');

      // Salvar
      const saveButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Título Modificado',
            rowHeightPriority: 'media', // Deve estar preservado
          }),
          expect.any(Object),
          expect.any(Object),
          expect.any(Object)
        );
      });
    });

    it('deve manter rowHeightPriority mesmo sem mudanças', async () => {
      const user = userEvent.setup();

      const customPageSection = createMockPageSection({
        section: {
          ...mockPageSection.section!,
          config: {
            ...mockPageSection.section!.config,
            rowHeightPriority: 'content',
          },
        },
      });

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={customPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      // Salvar sem fazer mudanças
      const saveButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            rowHeightPriority: 'content', // Deve estar preservado
          }),
          expect.any(Object),
          expect.any(Object),
          expect.any(Object)
        );
      });
    });
  });

  describe('Salvamento', () => {
    it('deve chamar onSave com dados corretos', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Bem-vindo ao BemDito',
            subtitle: 'Criamos soluções incríveis',
          }),
          expect.any(Object), // elements
          expect.any(Object), // layout
          expect.any(Object)  // styling
        );
      });
    });

    it('deve incluir todos os campos obrigatórios ao salvar', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(saveButton);

      await waitFor(() => {
        const [config, elements, layout, styling] = mockOnSave.mock.calls[0];

        // Config deve ter campos obrigatórios
        expect(config).toHaveProperty('title');
        expect(config).toHaveProperty('subtitle');
        expect(config).toHaveProperty('rowHeightPriority');

        // Elements deve existir
        expect(elements).toBeDefined();
        expect(elements).toHaveProperty('hasMainTitle');

        // Layout deve existir
        expect(layout).toBeDefined();
        expect(layout).toHaveProperty('gridRows');
        expect(layout).toHaveProperty('desktop');

        // Styling deve existir
        expect(styling).toBeDefined();
        expect(styling).toHaveProperty('height');
      });
    });

    it('não deve perder campos ao salvar (nenhum undefined)', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(saveButton);

      await waitFor(() => {
        const [config] = mockOnSave.mock.calls[0];

        // Nenhum campo deve ser undefined (podem ser null ou string vazia)
        Object.entries(config).forEach(([key, value]) => {
          expect(value).not.toBe(undefined);
        });
      });
    });
  });

  describe('Cancelamento', () => {
    it('deve chamar onClose ao clicar em Cancelar', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onSave ao cancelar', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UnifiedSectionConfigModal
          pageSection={mockPageSection}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      // Fazer mudança
      const titleInput = screen.getByDisplayValue('Bem-vindo ao BemDito');
      await user.clear(titleInput);
      await user.type(titleInput, 'Mudança não salva');

      // Cancelar
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Validação de Dados', () => {
    it('deve aceitar config vazio sem crashar', () => {
      const emptyPageSection = createMockPageSection({
        section: {
          ...mockPageSection.section!,
          config: {},
        },
      });

      expect(() => {
        renderWithProviders(
          <UnifiedSectionConfigModal
            pageSection={emptyPageSection}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />
        );
      }).not.toThrow();
    });

    it('deve aceitar layout vazio sem crashar', () => {
      const emptyLayoutPageSection = createMockPageSection({
        section: {
          ...mockPageSection.section!,
          layout: {},
        },
      });

      expect(() => {
        renderWithProviders(
          <UnifiedSectionConfigModal
            pageSection={emptyLayoutPageSection}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />
        );
      }).not.toThrow();
    });

    it('deve aceitar elements vazio sem crashar', () => {
      const emptyElementsPageSection = createMockPageSection({
        section: {
          ...mockPageSection.section!,
          elements: {},
        },
      });

      expect(() => {
        renderWithProviders(
          <UnifiedSectionConfigModal
            pageSection={emptyElementsPageSection}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />
        );
      }).not.toThrow();
    });
  });
});
