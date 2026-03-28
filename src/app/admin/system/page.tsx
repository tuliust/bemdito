import React, { useState, useEffect, useMemo } from 'react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { AlertMessageDialog } from '../../components/admin/AlertMessageDialog';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Input } from '../../components/ui/input';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';
import {
  Github,
  FolderOpen,
  FileText,
  Clock,
  RefreshCw,
  Download,
  Upload,
  GitBranch,
  GitCommit,
  BookOpen,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowUpDown,
  ExternalLink,
  Database,
  Server,
  HardDrive,
  Archive,
  Shield,
  Trash2,
  Search,
  Filter,
  TrendingUp,
  User,
  Calendar,
  Tag,
} from 'lucide-react';

// ── Tipos ────────────────────────────────────────────────────────────────────
interface GitStats {
  totalFolders: number;
  totalFiles: number;
  lastUpdate: string;
  branch: string;
  remoteUrl: string;
}

interface GitCommit {
  hash: string;
  author: string;
  date: string;
  message: string;
}

interface GitStatus {
  ahead: number;
  behind: number;
  modified: number;
  untracked: number;
  staged: number;
}

interface Documentation {
  name: string;
  path: string;
  size: string;
  lastModified: string;
}

interface SupabaseHealth {
  checks: {
    name: string;
    status: 'healthy' | 'warning' | 'critical';
    latency: string;
    message: string;
  }[];
}

interface SupabaseStats {
  database: {
    tables: number;
    totalRecords: number;
    sizeFormatted: string;
    recordsByTable: Record<string, number>;
  };
  storage: {
    totalSizeFormatted: string;
    sizeByBucket: {
      name: string;
      sizeFormatted: string;
    }[];
  };
}

// ── Componente Principal ─────────────────────────────────────────────────────
export default function SystemPage() {
  const [loading, setLoading] = useState(true);
  const [gitStats, setGitStats] = useState<GitStats | null>(null);
  const [localStats, setLocalStats] = useState<GitStats | null>(null);
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [docs, setDocs] = useState<Documentation[]>([]);
  const [alert, setAlert] = useState<{ title?: string; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealth | null>(null);
  const [supabaseStats, setSupabaseStats] = useState<SupabaseStats | null>(null);

  // ── Estados de Filtros ────────────────────────────────────────────────
  const [commitFilter, setCommitFilter] = useState('all');
  const [docSearch, setDocSearch] = useState('');

  // ── Estatísticas Computadas ───────────────────────────────────────────
  const commitStats = useMemo(() => {
    const authors: Record<string, number> = {};
    commits.forEach((commit) => {
      authors[commit.author] = (authors[commit.author] || 0) + 1;
    });
    return {
      totalCommits: commits.length,
      uniqueAuthors: Object.keys(authors).length,
      commitsByAuthor: Object.entries(authors)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
    };
  }, [commits]);

  const filteredCommits = useMemo(() => {
    if (commitFilter === 'all') return commits;
    return commits.filter((c) => c.author === commitFilter);
  }, [commits, commitFilter]);

  const uniqueAuthors = useMemo(() => {
    return Array.from(new Set(commits.map((c) => c.author)));
  }, [commits]);

  const categorizedDocs = useMemo(() => {
    const categories: Record<string, Documentation[]> = {
      'Guidelines': [],
      'Schema & Database': [],
      'Sistema & API': [],
      'Outros': [],
    };

    docs.forEach((doc) => {
      const name = doc.name.toLowerCase();
      if (name.includes('guideline') || name.includes('components') || name.includes('catalog')) {
        categories['Guidelines'].push(doc);
      } else if (name.includes('schema') || name.includes('database') || name.includes('execute')) {
        categories['Schema & Database'].push(doc);
      } else if (name.includes('system') || name.includes('api') || name.includes('config') || name.includes('sucesso')) {
        categories['Sistema & API'].push(doc);
      } else {
        categories['Outros'].push(doc);
      }
    });

    return categories;
  }, [docs]);

  const filteredDocs = useMemo(() => {
    if (!docSearch) return categorizedDocs;

    const search = docSearch.toLowerCase();
    const filtered: Record<string, Documentation[]> = {};

    Object.entries(categorizedDocs).forEach(([category, categoryDocs]) => {
      const matchedDocs = categoryDocs.filter(
        (doc) =>
          doc.name.toLowerCase().includes(search) ||
          doc.path.toLowerCase().includes(search)
      );
      if (matchedDocs.length > 0) {
        filtered[category] = matchedDocs;
      }
    });

    return filtered;
  }, [categorizedDocs, docSearch]);

  const docsStats = useMemo(() => {
    return {
      total: docs.length,
      totalSize: docs.reduce((acc, doc) => {
        const size = parseFloat(doc.size.replace(/[^0-9.]/g, ''));
        const unit = doc.size.match(/[a-zA-Z]+/)?.[0] || 'KB';
        const bytes = unit === 'MB' ? size * 1024 * 1024 : size * 1024;
        return acc + bytes;
      }, 0),
    };
  }, [docs]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // ── Carregar dados iniciais ──────────────────────────────────────────────
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadGitStats(),
        loadLocalStats(),
        loadGitStatus(),
        loadCommits(),
        loadDocs(),
        loadSupabaseHealth(),
        loadSupabaseStats(),
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setAlert({
        title: '❌ Erro',
        message: 'Erro ao carregar dados do sistema. Verifique o console.',
      });
    } finally {
      setLoading(false);
    }
  };

  // ── API Calls ────────────────────────────────────────────────────────────
  const apiCall = async (endpoint: string, method = 'GET', body?: any) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-72da2481/git/${endpoint}`,
        {
          method,
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(`❌ API error (${response.status}):`, data);
        throw new Error(data.message || data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ Exception in apiCall(${endpoint}):`, error);
      throw error;
    }
  };

  const loadGitStats = async () => {
    const data = await apiCall('stats/github');
    setGitStats(data);
  };

  const loadLocalStats = async () => {
    const data = await apiCall('stats/local');
    setLocalStats(data);
  };

  const loadGitStatus = async () => {
    const data = await apiCall('status');
    setGitStatus(data);
  };

  const loadCommits = async () => {
    const data = await apiCall('commits');
    setCommits(data.commits || []);
  };

  const loadDocs = async () => {
    const data = await apiCall('docs');
    setDocs(data.docs || []);
  };

  const loadSupabaseHealth = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-72da2481/supabase-manager/health`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    setSupabaseHealth(data);
  };

  const loadSupabaseStats = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-72da2481/supabase-manager/stats`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    setSupabaseStats(data.stats);
  };

  // ── Ações Git ────────────────────────────────────────────────────────────
  const handlePull = async () => {
    setConfirmDialog({
      title: 'Baixar Mudanças',
      message: '⚠️ Operações Git devem ser feitas localmente. Esta ação abrirá instruções.',
      onConfirm: () => {
        setConfirmDialog(null);
        setAlert({
          title: 'ℹ️ Instruções',
          message: 'Execute no terminal local:\n\ngit pull origin main\n\nO Supabase Edge Runtime não suporta comandos Git por limitações de segurança.',
        });
      },
    });
  };

  const handlePush = async () => {
    setConfirmDialog({
      title: 'Enviar Mudanças',
      message: '⚠️ Operações Git devem ser feitas localmente. Esta ação abrirá instruções.',
      onConfirm: () => {
        setConfirmDialog(null);
        setAlert({
          title: 'ℹ️ Instruções',
          message: 'Execute no terminal local:\n\ngit add .\ngit commit -m "sua mensagem"\ngit push origin main\n\nO Supabase Edge Runtime não suporta comandos Git por limitações de segurança.',
        });
      },
    });
  };

  const handleSync = async () => {
    setConfirmDialog({
      title: 'Sincronizar Tudo',
      message: '⚠️ Operações Git devem ser feitas localmente. Esta ação abrirá instruções.',
      onConfirm: () => {
        setConfirmDialog(null);
        setAlert({
          title: 'ℹ️ Instruções para Sincronização',
          message: 'Execute no terminal local:\n\n1. git add .\n2. git commit -m "chore: sync"\n3. git pull origin main\n4. git push origin main\n\nO Supabase Edge Runtime não suporta comandos Git por limitações de segurança.',
        });
      },
    });
  };

  // ── Ações Supabase ──────────────────────────────────────────────────────
  const handleSupabaseBackup = async () => {
    setConfirmDialog({
      title: 'Criar Backup',
      message: '⚠️ Esta ação criará um backup do banco de dados. Deseja continuar?',
      onConfirm: async () => {
        setConfirmDialog(null);
        setSyncing(true);
        try {
          await apiCall('supabase/backup');
          setAlert({
            title: '✅ Sucesso',
            message: 'Backup criado com sucesso.',
          });
        } catch (error) {
          setAlert({
            title: '❌ Erro',
            message: 'Erro ao criar backup. Verifique o console.',
          });
        } finally {
          setSyncing(false);
        }
      },
    });
  };

  const handleSupabaseCleanup = async () => {
    setConfirmDialog({
      title: 'Limpar Storage',
      message: '⚠️ Esta ação removerá arquivos não referenciados no banco de dados. Deseja continuar?',
      onConfirm: async () => {
        setConfirmDialog(null);
        setSyncing(true);
        try {
          await apiCall('supabase/cleanup');
          setAlert({
            title: '✅ Sucesso',
            message: 'Storage limpo com sucesso.',
          });
        } catch (error) {
          setAlert({
            title: '❌ Erro',
            message: 'Erro ao limpar storage. Verifique o console.',
          });
        } finally {
          setSyncing(false);
        }
      },
    });
  };

  const handleSupabaseVerify = async () => {
    setConfirmDialog({
      title: 'Verificar Integridade',
      message: '⚠️ Esta ação verificará a integridade do banco de dados. Deseja continuar?',
      onConfirm: async () => {
        setConfirmDialog(null);
        setSyncing(true);
        try {
          await apiCall('supabase/verify');
          setAlert({
            title: '✅ Sucesso',
            message: 'Integridade verificada com sucesso.',
          });
        } catch (error) {
          setAlert({
            title: '❌ Erro',
            message: 'Erro ao verificar integridade. Verifique o console.',
          });
        } finally {
          setSyncing(false);
        }
      },
    });
  };

  const handleSupabaseVacuum = async () => {
    setConfirmDialog({
      title: 'Otimizar Banco',
      message: '⚠️ Esta ação otimizará o banco de dados. Deseja continuar?',
      onConfirm: async () => {
        setConfirmDialog(null);
        setSyncing(true);
        try {
          await apiCall('supabase/vacuum');
          setAlert({
            title: '✅ Sucesso',
            message: 'Banco otimizado com sucesso.',
          });
        } catch (error) {
          setAlert({
            title: '❌ Erro',
            message: 'Erro ao otimizar banco. Verifique o console.',
          });
        } finally {
          setSyncing(false);
        }
      },
    });
  };

  // ── Loading State ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Sistema"
      description="Gerenciar repositório Git e documentação do projeto"
      headerActions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadAllData}
            disabled={syncing}
            style={{
              backgroundColor: 'var(--admin-btn-action-bg, #ffffff)',
              color: 'var(--admin-btn-action-text, #374151)',
              borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <AdminPrimaryButton onClick={handleSync} disabled={syncing}>
            {syncing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ArrowUpDown className="h-4 w-4 mr-2" />
            )}
            Sincronizar Tudo
          </AdminPrimaryButton>
        </div>
      }
    >
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList
          style={{
            backgroundColor: 'var(--admin-tab-list-bg, #f3f4f6)',
            padding: '4px',
          }}
        >
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="supabase">
            <Database className="h-4 w-4 mr-2" />
            Supabase
          </TabsTrigger>
          <TabsTrigger value="history">
            <GitCommit className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="docs">
            <BookOpen className="h-4 w-4 mr-2" />
            Documentação
          </TabsTrigger>
        </TabsList>

        {/* ═══ Aba: Visão Geral ═══════════════════════════════════════════ */}
        <TabsContent value="overview" className="space-y-6">
          {/* Status do Git */}
          {gitStatus && (
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: 'var(--admin-card-bg, #ffffff)',
                border: '2px solid var(--admin-card-border, #e5e7eb)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Status do Repositório
                </h3>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor:
                      gitStatus.modified + gitStatus.untracked > 0
                        ? 'var(--accent, #ed9331)'
                        : 'var(--primary, #ea526e)',
                    color: '#ffffff',
                  }}
                >
                  {gitStatus.modified + gitStatus.untracked > 0
                    ? 'Mudanças Pendentes'
                    : 'Sincronizado'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatusCard
                  icon={<GitBranch className="h-5 w-5" />}
                  label="À Frente"
                  value={gitStatus.ahead}
                  color="blue"
                />
                <StatusCard
                  icon={<Download className="h-5 w-5" />}
                  label="Atrás"
                  value={gitStatus.behind}
                  color="orange"
                />
                <StatusCard
                  icon={<FileText className="h-5 w-5" />}
                  label="Modificados"
                  value={gitStatus.modified}
                  color="yellow"
                />
                <StatusCard
                  icon={<AlertCircle className="h-5 w-5" />}
                  label="Não Rastreados"
                  value={gitStatus.untracked}
                  color="red"
                />
                <StatusCard
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  label="Staged"
                  value={gitStatus.staged}
                  color="green"
                />
              </div>
            </div>
          )}

          {/* Estatísticas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Github */}
            <StatsCard
              title="Github (Repositório Remoto)"
              icon={<Github className="h-6 w-6" />}
              stats={gitStats}
              color="purple"
            />

            {/* Figma Make */}
            <StatsCard
              title="Figma Make (Workspace Local)"
              icon={<FolderOpen className="h-6 w-6" />}
              stats={localStats}
              color="blue"
            />
          </div>

          {/* Ações */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--admin-card-bg, #ffffff)',
              border: '2px solid var(--admin-card-border, #e5e7eb)',
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionButton
                icon={<Download className="h-5 w-5" />}
                label="Baixar Mudanças"
                description="Fazer pull do Github"
                onClick={handlePull}
                disabled={syncing}
              />
              <ActionButton
                icon={<Upload className="h-5 w-5" />}
                label="Enviar Mudanças"
                description="Fazer push para Github"
                onClick={handlePush}
                disabled={syncing}
              />
            </div>
          </div>
        </TabsContent>

        {/* ═══ Aba Supabase ─────────────────────────────────────────────── */}
        <TabsContent value="supabase">
          <div className="space-y-6">
            {/* Tab content header */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Gerenciamento do Supabase
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Estatísticas, backup e manutenção do banco de dados
              </p>
            </div>

            {/* Health Status */}
            {supabaseHealth && (
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: 'var(--admin-card-bg, #ffffff)',
                  border: '2px solid var(--admin-card-border, #e5e7eb)',
                }}
              >
                <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Status de Saúde
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {supabaseHealth.checks.map((check, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border"
                      style={{
                        borderColor: 
                          check.status === 'healthy' ? '#10b981' :
                          check.status === 'warning' ? '#f59e0b' : '#ef4444',
                        backgroundColor:
                          check.status === 'healthy' ? '#f0fdf4' :
                          check.status === 'warning' ? '#fffbeb' : '#fef2f2',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {check.status === 'healthy' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : check.status === 'warning' ? (
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-semibold text-sm text-gray-900">
                          {check.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Latência: {check.latency}
                      </p>
                      {check.message !== 'OK' && (
                        <p className="text-xs text-gray-600 mt-1">
                          {check.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estatísticas */}
            {supabaseStats && (
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: 'var(--admin-card-bg, #ffffff)',
                  border: '2px solid var(--admin-card-border, #e5e7eb)',
                }}
              >
                <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-primary" />
                  Estatísticas do Banco
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {supabaseStats.database.tables}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Tabelas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {supabaseStats.database.totalRecords}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Registros</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {supabaseStats.database.sizeFormatted}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Tamanho DB</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {supabaseStats.storage.totalSizeFormatted}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Storage</p>
                  </div>
                </div>

                {/* Registros por Tabela */}
                <div className="border-t pt-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">
                    Registros por Tabela
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(supabaseStats.database.recordsByTable).map(([table, count]) => (
                      <div
                        key={table}
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: 'var(--admin-page-bg, #f9fafb)',
                        }}
                      >
                        <p className="text-xs text-gray-600 truncate">{table}</p>
                        <p className="text-lg font-semibold text-gray-900">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Storage por Bucket */}
                {supabaseStats.storage.sizeByBucket.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">
                      Storage por Bucket
                    </h5>
                    <div className="space-y-2">
                      {supabaseStats.storage.sizeByBucket.map((bucket) => (
                        <div
                          key={bucket.name}
                          className="flex justify-between items-center p-3 rounded-lg"
                          style={{
                            backgroundColor: 'var(--admin-page-bg, #f9fafb)',
                          }}
                        >
                          <span className="text-sm text-gray-900">{bucket.name}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {bucket.sizeFormatted}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ações de Manutenção */}
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: 'var(--admin-card-bg, #ffffff)',
                border: '2px solid var(--admin-card-border, #e5e7eb)',
              }}
            >
              <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                Ações de Manutenção
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Criar Backup */}
                <Button
                  onClick={handleSupabaseBackup}
                  disabled={syncing}
                  className="h-auto flex-col items-start p-4"
                  style={{
                    backgroundColor: 'var(--admin-btn-action-bg, #ffffff)',
                    color: 'var(--admin-btn-action-text, #374151)',
                    borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
                  }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Archive className="h-5 w-5" />
                    <span className="font-semibold">Criar Backup</span>
                  </div>
                  <p className="text-xs text-left mt-2 opacity-70">
                    Exporta todas as tabelas em formato JSON
                  </p>
                </Button>

                {/* Limpar Storage */}
                <Button
                  onClick={handleSupabaseCleanup}
                  disabled={syncing}
                  className="h-auto flex-col items-start p-4"
                  style={{
                    backgroundColor: 'var(--admin-btn-action-bg, #ffffff)',
                    color: 'var(--admin-btn-action-text, #374151)',
                    borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
                  }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Trash2 className="h-5 w-5" />
                    <span className="font-semibold">Limpar Storage</span>
                  </div>
                  <p className="text-xs text-left mt-2 opacity-70">
                    Remove arquivos não referenciados no banco
                  </p>
                </Button>

                {/* Verificar Integridade */}
                <Button
                  onClick={handleSupabaseVerify}
                  disabled={syncing}
                  className="h-auto flex-col items-start p-4"
                  style={{
                    backgroundColor: 'var(--admin-btn-action-bg, #ffffff)',
                    color: 'var(--admin-btn-action-text, #374151)',
                    borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
                  }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">Verificar Integridade</span>
                  </div>
                  <p className="text-xs text-left mt-2 opacity-70">
                    Detecta registros órfãos e referências inválidas
                  </p>
                </Button>

                {/* Otimizar Banco */}
                <Button
                  onClick={handleSupabaseVacuum}
                  disabled={syncing}
                  className="h-auto flex-col items-start p-4"
                  style={{
                    backgroundColor: 'var(--admin-btn-action-bg, #ffffff)',
                    color: 'var(--admin-btn-action-text, #374151)',
                    borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
                  }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <RefreshCw className="h-5 w-5" />
                    <span className="font-semibold">Otimizar Banco</span>
                  </div>
                  <p className="text-xs text-left mt-2 opacity-70">
                    Executa ANALYZE para melhorar performance
                  </p>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══ Aba: Histórico ══════════════════════════════════════════════ */}
        <TabsContent value="history" className="space-y-6">
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--admin-card-bg, #ffffff)',
              border: '2px solid var(--admin-card-border, #e5e7eb)',
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GitCommit className="h-5 w-5 text-primary" />
              Últimos Commits
            </h3>

            {commits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum commit encontrado
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCommits.map((commit, index) => (
                  <div
                    key={commit.hash}
                    className="flex gap-4 p-4 rounded-lg"
                    style={{
                      backgroundColor: 'var(--admin-page-bg, #f9fafb)',
                      border: '1px solid var(--admin-card-border, #e5e7eb)',
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: index === 0 ? 'var(--primary, #ea526e)' : '#e5e7eb',
                          color: index === 0 ? '#ffffff' : '#6b7280',
                        }}
                      >
                        <GitCommit className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{commit.message}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{commit.author}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {commit.date}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 font-mono">{commit.hash}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ═══ Aba: Documentação ═══════════════════════════════════════════ */}
        <TabsContent value="docs" className="space-y-6">
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--admin-card-bg, #ffffff)',
              border: '2px solid var(--admin-card-border, #e5e7eb)',
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Documentações Disponíveis
            </h3>

            {docs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma documentação encontrada
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(filteredDocs).map(([category, categoryDocs]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      {category}
                    </h4>
                    {categoryDocs.map((doc) => (
                      <div
                        key={doc.path}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50"
                        style={{
                          border: '1px solid var(--admin-card-border, #e5e7eb)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-500">
                              {doc.size} • Modificado em {doc.lastModified}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.path, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AlertMessageDialog
        open={!!alert}
        title={alert?.title}
        message={alert?.message ?? ''}
        onClose={() => setAlert(null)}
      />
      <ConfirmDialog
        open={!!confirmDialog}
        title={confirmDialog?.title ?? ''}
        message={confirmDialog?.message ?? ''}
        onConfirm={confirmDialog?.onConfirm ?? (() => {})}
        onCancel={() => setConfirmDialog(null)}
      />
    </AdminPageLayout>
  );
}

// ── Componentes Auxiliares ───────────────────────────────────────────────────
function StatsCard({
  title,
  icon,
  stats,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  stats: GitStats | null;
  color: string;
}) {
  const colors: Record<string, string> = {
    purple: '#8b5cf6',
    blue: '#3b82f6',
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: 'var(--admin-card-bg, #ffffff)',
        border: '2px solid var(--admin-card-border, #e5e7eb)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="h-12 w-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${colors[color]}20`, color: colors[color] }}
        >
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>

      {!stats ? (
        <div className="text-center py-4 text-gray-400">Carregando...</div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Pastas</span>
            <span className="font-semibold text-gray-900">{stats.totalFolders}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Arquivos</span>
            <span className="font-semibold text-gray-900">{stats.totalFiles}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Branch</span>
            <span className="font-mono text-sm text-gray-900">{stats.branch}</span>
          </div>
          <Separator />
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm text-gray-600 flex-shrink-0">Última Atualização</span>
            <span className="text-sm text-gray-900 text-right">{stats.lastUpdate}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: '#3b82f6',
    orange: '#f59e0b',
    yellow: '#eab308',
    red: '#ef4444',
    green: '#10b981',
  };

  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: 'var(--admin-page-bg, #f9fafb)',
        border: '1px solid var(--admin-card-border, #e5e7eb)',
      }}
    >
      <div className="flex items-center gap-2 mb-2" style={{ color: colors[color] }}>
        {icon}
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  description,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-4 rounded-lg text-left transition-all"
      style={{
        backgroundColor: hovered
          ? 'var(--admin-btn-action-hover-bg, #f9fafb)'
          : 'var(--admin-page-bg, #f9fafb)',
        border: '1px solid var(--admin-card-border, #e5e7eb)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: 'var(--primary, #ea526e)',
            color: '#ffffff',
          }}
        >
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
}