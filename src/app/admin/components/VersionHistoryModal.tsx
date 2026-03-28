import { useState, useEffect } from 'react';
import { BaseModal } from '../../components/admin/BaseModal';
import { AlertMessageDialog } from '../../components/admin/AlertMessageDialog';
import { ConfirmDeleteDialog } from '../../components/admin/ConfirmDeleteDialog';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { supabase } from '../../../lib/supabase/client';
import { useDesignTokens } from '../../../lib/hooks/useDesignTokens';
import { Clock, RotateCcw, Star, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

type Version = {
  id: string;
  version_number: number;
  data: any;
  created_at: string;
  created_by: string | null;
  restore_point: boolean;
};

type VersionHistoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityId: string;
  entityType: 'page' | 'section';
  currentData: any;
  onRestore: (data: any) => Promise<void>;
};

export function VersionHistoryModal({
  open,
  onOpenChange,
  entityId,
  entityType,
  currentData,
  onRestore,
}: VersionHistoryModalProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPreviewId, setExpandedPreviewId] = useState<string | null>(null);
  const { primaryColor } = useDesignTokens();

  // Alert & confirm states
  const [alertMsg, setAlertMsg] = useState<{ title?: string; message: string } | null>(null);
  const showAlert = (message: string, title?: string) => setAlertMsg({ message, title });
  const [versionToDelete, setVersionToDelete] = useState<Version | null>(null);
  const [versionToRestore, setVersionToRestore] = useState<Version | null>(null);

  useEffect(() => {
    if (open) {
      loadVersions();
    }
  }, [open, entityId]);

  async function loadVersions() {
    setLoading(true);
    try {
      const tableName = entityType === 'page' ? 'page_versions' : 'section_versions';
      const idField = entityType === 'page' ? 'page_id' : 'section_id';

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq(idField, entityId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(version: Version) {
    setVersionToRestore(version);
  }

  async function doRestore() {
    if (!versionToRestore) return;
    onRestore(versionToRestore.data);
    setVersionToRestore(null);
    onOpenChange(false);
  }

  async function handleToggleRestorePoint(version: Version) {
    try {
      const tableName = entityType === 'page' ? 'page_versions' : 'section_versions';

      const { error } = await supabase
        .from(tableName)
        .update({ restore_point: !version.restore_point })
        .eq('id', version.id);

      if (error) throw error;
      await loadVersions();
    } catch (error) {
      console.error('Error toggling restore point:', error);
    }
  }

  async function handleDelete(version: Version) {
    if (version.restore_point) {
      showAlert('Não é possível excluir um ponto de restauração. Remova a marcação primeiro.');
      return;
    }
    setVersionToDelete(version);
  }

  async function doDelete() {
    if (!versionToDelete) return;
    try {
      const tableName = entityType === 'page' ? 'page_versions' : 'section_versions';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', versionToDelete.id);
      if (error) throw error;
      await loadVersions();
    } catch (error) {
      console.error('Error deleting version:', error);
    } finally {
      setVersionToDelete(null);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  function getChangeSummary(versionData: any): string {
    const keys = Object.keys(versionData);
    return `${keys.length} campos salvos`;
  }

  function togglePreview(versionId: string) {
    setExpandedPreviewId((prev) => (prev === versionId ? null : versionId));
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Histórico de Versões"
    >
      <div className="space-y-4">
        {/* Header Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <Clock className="inline h-4 w-4 mr-2" />
            {versions.length} {versions.length === 1 ? 'versão salva' : 'versões salvas'}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Versões com <Star className="inline h-3 w-3" /> são pontos de restauração e não serão excluídas automaticamente
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 text-gray-500">
            Carregando versões...
          </div>
        )}

        {/* Empty State */}
        {!loading && versions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma versão salva ainda</p>
          </div>
        )}

        {/* Versions List */}
        {!loading && versions.length > 0 && (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`border rounded-xl overflow-hidden ${
                  version.restore_point
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200'
                }`}
              >
                {/* Version header row */}
                <div className="flex items-start justify-between gap-4 p-4">
                  {/* Version Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        Versão #{version.version_number}
                      </span>
                      {version.restore_point && (
                        <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(version.created_at)}
                    </p>
                    <p data-slot="field-hint" className="mt-1">
                      {getChangeSummary(version.data)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Toggle inline preview */}
                    <button
                      onClick={() => togglePreview(version.id)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-1"
                      style={{ transition: 'none' }}
                      title={expandedPreviewId === version.id ? 'Ocultar dados' : 'Visualizar dados'}
                    >
                      {expandedPreviewId === version.id
                        ? <ChevronUp className="h-4 w-4" />
                        : <ChevronDown className="h-4 w-4" />
                      }
                      Ver
                    </button>

                    {/* Toggle Restore Point */}
                    <button
                      onClick={() => handleToggleRestorePoint(version)}
                      className={`px-3 py-1.5 text-sm border rounded-lg ${
                        version.restore_point
                          ? 'border-yellow-300 bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                      style={{ transition: 'none' }}
                      title={version.restore_point ? 'Remover marcação' : 'Marcar como ponto de restauração'}
                    >
                      <Star className={`h-4 w-4 ${version.restore_point ? 'fill-yellow-600' : ''}`} />
                    </button>

                    {/* Restore */}
                    <button
                      onClick={() => handleRestore(version)}
                      style={{ backgroundColor: primaryColor, transition: 'none' }}
                      className="px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90 flex items-center gap-1"
                      title="Restaurar esta versão"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restaurar
                    </button>

                    {/* Delete */}
                    {!version.restore_point && (
                      <button
                        onClick={() => handleDelete(version)}
                        className="px-3 py-1.5 text-sm rounded-lg flex items-center justify-center"
                        style={{
                          transition: 'none',
                          color: 'var(--admin-delete-btn-text, #dc2626)',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget;
                          el.style.backgroundColor = 'var(--admin-delete-btn-hover-bg, #fef2f2)';
                          el.style.color = 'var(--admin-delete-btn-hover-text, #b91c1c)';
                          el.style.borderColor = 'var(--admin-delete-btn-hover-border, #fca5a5)';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget;
                          el.style.backgroundColor = 'transparent';
                          el.style.color = 'var(--admin-delete-btn-text, #dc2626)';
                          el.style.borderColor = 'var(--admin-btn-action-border, #e5e7eb)';
                        }}
                        title="Excluir versão"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline JSON preview (expandable) */}
                {expandedPreviewId === version.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Dados da versão #{version.version_number}
                    </p>
                    <div className="max-h-64 overflow-y-auto rounded-lg bg-white border border-gray-200 p-3">
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                        {JSON.stringify(version.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert dialog */}
      <AlertMessageDialog
        open={!!alertMsg}
        message={alertMsg?.message ?? ''}
        title={alertMsg?.title}
        onClose={() => setAlertMsg(null)}
      />

      {/* Confirm restore — usa ConfirmDialog (não delete) */}
      <ConfirmDialog
        open={!!versionToRestore}
        onConfirm={doRestore}
        onCancel={() => setVersionToRestore(null)}
        title={`Restaurar versão #${versionToRestore?.version_number}`}
        description="Tem certeza que deseja restaurar para esta versão? As alterações atuais serão substituídas."
        confirmLabel="Restaurar"
        confirmVariant="primary"
      />

      {/* Confirm delete version */}
      <ConfirmDeleteDialog
        open={!!versionToDelete}
        onConfirm={doDelete}
        onCancel={() => setVersionToDelete(null)}
        title={`Excluir versão #${versionToDelete?.version_number}`}
        description="Tem certeza que deseja excluir esta versão? Esta ação não pode ser desfeita."
      />
    </BaseModal>
  );
}