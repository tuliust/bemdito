import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  FileText,
} from 'lucide-react';
import { listPages, deletePage, publishPage, unpublishPage } from '@/lib/services/pages-service';

export function PagesList() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    setLoading(true);
    const data = await listPages();
    setPages(data);
    setLoading(false);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Excluir a página "${title}"?`)) return;

    try {
      await deletePage(id);
      await loadPages();
    } catch (error) {
      console.error('Erro ao excluir página:', error);
      alert('Não foi possível excluir a página');
    }
  }

  async function handleTogglePublish(id: string, currentStatus: string) {
    try {
      if (currentStatus === 'published') {
        await unpublishPage(id);
      } else {
        await publishPage(id);
      }

      await loadPages();
    } catch (error) {
      console.error('Erro ao alterar publicação da página:', error);
      alert('Não foi possível atualizar o status da página');
    }
  }

  function getStatusLabel(status: string) {
    if (status === 'published') return 'Publicada';
    if (status === 'draft') return 'Rascunho';
    return status;
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Carregando páginas...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Páginas</h1>
          <p className="mt-1 text-gray-600">Gerencie as páginas do seu site</p>
        </div>

        <Link
          to="/admin/pages/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nova página
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">Ainda não há páginas</h3>
          <p className="mb-6 text-gray-600">Comece criando sua primeira página</p>

          <Link
            to="/admin/pages/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Criar página
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Atualizada em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{page.title}</div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-600">{page.slug}</div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        page.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : page.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getStatusLabel(page.status)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {new Date(page.updated_at).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/pages/${page.id}/edit`}
                        className="rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-primary"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => handleTogglePublish(page.id, page.status)}
                        className="rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-primary"
                        title={page.status === 'published' ? 'Despublicar' : 'Publicar'}
                      >
                        {page.status === 'published' ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(page.id, page.title)}
                        className="rounded p-2 text-gray-600 hover:bg-red-50 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <button
                        className="rounded p-2 text-gray-400"
                        title="Arquivar"
                        disabled
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}