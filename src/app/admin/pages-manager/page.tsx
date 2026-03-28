import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../../lib/supabase/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { BaseModal } from '../../components/admin/BaseModal';
import { ConfirmDeleteDialog } from '../../components/admin/ConfirmDeleteDialog';
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  ExternalLink,
  Copy,
  Eye,
} from 'lucide-react';
import { IconPicker } from '../../components/admin/IconPicker';
import { toast } from 'sonner';
import { ResponsivePreview } from '../../components/ResponsivePreview';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminListItem } from '../../components/admin/AdminListItem';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminActionButtons } from '../../components/admin/AdminActionButtons';
import { adminVar } from '../../components/admin/AdminThemeProvider';
import { AdminPrimaryButton } from '@/app/components/admin/AdminPrimaryButton';

type Page = {
  id: string;
  name: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
};

type Section = {
  id: string;
  name: string;
  type: string;
  config: any;
  global: boolean;
  published: boolean;
};

type PageSection = {
  id: string;
  page_id: string;
  section_id: string;
  order_index: number;
  section?: Section;
};

export function PagesManagerPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    filterPages();
  }, [pages, searchTerm]);

  async function loadPages() {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPages(data || []);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast.error('Erro ao carregar páginas', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  }

  function filterPages() {
    let filtered = pages;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPages(filtered);
  }

  const handleCreate = () => {
    setEditingPage(null);
    setCreateModalOpen(true);
  };

  const handleEdit = (page: Page) => {
    // Navigate to editor
    navigate(`/admin/pages-manager/editor/${page.id}`);
  };

  const handleDelete = async (page: Page) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pageToDelete) return;

    try {
      // Delete page_sections first
      await supabase.from('page_sections').delete().eq('page_id', pageToDelete.id);

      // Delete page
      const { error } = await supabase.from('pages').delete().eq('id', pageToDelete.id);

      if (error) throw error;

      toast.success('Página deletada com sucesso!', {
        icon: <CheckCircle className="h-4 w-4" />,
      });

      loadPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Erro ao deletar página', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setDeleteDialogOpen(false);
      setPageToDelete(null);
    }
  };

  const handleTogglePublish = async (page: Page) => {
    try {
      const { error } = await supabase
        .from('pages')
        .update({ published: !page.published })
        .eq('id', page.id);

      if (error) throw error;

      toast.success(
        `Página ${!page.published ? 'publicada' : 'despublicada'} com sucesso!`,
        { icon: <CheckCircle className="h-4 w-4" /> }
      );

      loadPages();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('Erro ao atualizar página', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  const handleDuplicate = async (page: Page) => {
    try {
      // Create new page
      const { data: newPage, error: pageError } = await supabase
        .from('pages')
        .insert({
          name: `${page.name} (Cópia)`,
          slug: `${page.slug}-copia-${Date.now()}`,
          title: page.meta_title || page.name, // Use meta_title or fallback to name for 'title' column
          meta_title: page.meta_title,
          meta_description: page.meta_description,
          meta_keywords: page.meta_keywords,
          published: false, // Always create as draft
        })
        .select()
        .single();

      if (pageError) throw pageError;

      // Get page_sections from original page
      const { data: pageSections, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', page.id)
        .order('order_index');

      if (sectionsError) throw sectionsError;

      // Copy page_sections to new page
      if (pageSections && pageSections.length > 0) {
        const newPageSections = pageSections.map((ps) => ({
          page_id: newPage.id,
          section_id: ps.section_id,
          order_index: ps.order_index,
        }));

        const { error: insertError } = await supabase
          .from('page_sections')
          .insert(newPageSections);

        if (insertError) throw insertError;
      }

      toast.success('Página duplicada com sucesso!', {
        icon: <CheckCircle className="h-4 w-4" />,
      });

      loadPages();

      // Navigate to edit new page
      navigate(`/admin/pages-manager/editor/${newPage.id}`);
    } catch (error) {
      console.error('Error duplicating page:', error);
      toast.error('Erro ao duplicar página', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Páginas"
      description="Editor visual de páginas com drag & drop de seções"
      headerActions={
        <AdminPrimaryButton onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Página
        </AdminPrimaryButton>
      }
    >
      {/* Search */}
      <div
        className="rounded-[1.5rem] p-6"
        style={{
          backgroundColor: 'var(--admin-card-bg,     #ffffff)',
          border:          '2px solid var(--admin-card-border, #e5e7eb)',
        }}
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: 'var(--admin-field-placeholder, var(--muted-foreground))' }}
          />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar páginas por nome ou slug..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="space-y-4">
        {filteredPages.length === 0 ? (
          <AdminEmptyState
            message={searchTerm ? 'Nenhuma página encontrada' : 'Nenhuma página criada ainda'}
            cta={!searchTerm ? { label: 'Criar Primeira Página', onClick: handleCreate } : undefined}
          />
        ) : (
          filteredPages.map((page) => (
            <AdminListItem key={page.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      style={{
                        fontSize:   adminVar('item-title-list', 'size'),
                        fontWeight: adminVar('item-title-list', 'weight'),
                        color:      adminVar('item-title-list', 'color'),
                      }}
                    >
                      {page.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-sm mb-3" style={{
                    color: adminVar('item-description', 'color'),
                  }}>
                    <span className="flex items-center gap-1" style={{
                      fontSize:   adminVar('item-description', 'size'),
                      fontWeight: adminVar('item-description', 'weight'),
                      color:      adminVar('item-description', 'color'),
                    }}>
                      {page.slug}
                    </span>
                    {page.meta_title && (
                      <span style={{
                        fontSize: adminVar('item-tertiary', 'size'),
                        color:    adminVar('item-tertiary', 'color'),
                      }}>• {page.meta_title}</span>
                    )}
                  </div>

                  {page.meta_description && (
                    <p style={{
                      fontSize:   adminVar('item-description', 'size'),
                      fontWeight: adminVar('item-description', 'weight'),
                      color:      adminVar('item-description', 'color'),
                    }} className="mb-3">
                      {page.meta_description}
                    </p>
                  )}
                </div>

                <AdminActionButtons
                  onEdit={() => handleEdit(page)}
                  onDelete={() => handleDelete(page)}
                  onDuplicate={() => handleDuplicate(page)}
                />
              </div>
            </AdminListItem>
          ))
        )}
      </div>

      {/* Create Page Modal */}
      {createModalOpen && (
        <CreatePageModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={(pageId) => {
            setCreateModalOpen(false);
            loadPages();
            navigate(`/admin/pages-manager/editor/${pageId}`);
          }}
        />
      )}

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        itemName={`a página "${pageToDelete?.name}"`}
      />
    </AdminPageLayout>
  );
}

// Create Page Modal
function CreatePageModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (pageId: string) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    published: false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      toast.error('Preencha o nome e slug da página', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    // Validate slug format
    if (!formData.slug.startsWith('/')) {
      toast.error('Slug deve começar com /', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert([
          {
            name: formData.name,
            slug: formData.slug,
            title: formData.meta_title || formData.name, // Use meta_title or fallback to name for 'title' column
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
            meta_keywords: formData.meta_keywords || null,
            published: formData.published,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Página criada com sucesso!', {
        icon: <CheckCircle className="h-4 w-4" />,
      });

      onSuccess(data.id);
    } catch (error: any) {
      console.error('Error creating page:', error);
      if (error.code === '23505') {
        toast.error('Slug já existe. Escolha outro.', {
          icon: <AlertCircle className="h-4 w-4" />,
        });
      } else {
        toast.error('Erro ao criar página', {
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return '/' + slug;
  };

  return (
    <BaseModal
      open={true}
      onOpenChange={(v) => !v && onClose()}
      title="Criar Nova Página"
      size="large"
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Nome da Página *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (!formData.slug) {
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                });
              }
            }}
            placeholder="Ex: Sobre Nós, Contato, Serviços"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="/sobre-nos"
            className="mt-1"
          />
          <p data-slot="field-hint" className="mt-1">
            URL da página (deve começar com /). Ex: /sobre, /contato
          </p>
        </div>

        <div className="border-t pt-4" style={{ borderColor: 'var(--admin-card-border, #e5e7eb)' }}>
          <div className="flex items-center gap-3">
            <Switch
              id="publish-immediately"
              checked={formData.published}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, published: checked })
              }
            />
            <Label htmlFor="publish-immediately" className="cursor-pointer">
              Publicar imediatamente
            </Label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--admin-card-border, #e5e7eb)' }}>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <AdminPrimaryButton
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar e Editar'
            )}
          </AdminPrimaryButton>
        </div>
      </div>
    </BaseModal>
  );
}