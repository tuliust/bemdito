/**
 * 🎨 Lista centralizada de ícones Lucide disponíveis
 * - Usada no IconPicker (admin)
 * - Usada no SectionRenderer (público)
 * - ADICIONAR NOVOS ÍCONES APENAS AQUI!
 *
 * ⚠️  Todos os nomes foram validados contra lucide-react v0.487.0.
 *     Não usar nomes antigos renomeados nessa versão — veja LEGACY_ICON_ALIASES
 *     em SectionRenderer.tsx para retrocompatibilidade com dados salvos no banco.
 */
export const AVAILABLE_LUCIDE_ICONS = [
  // Pessoas & Comunicação
  'Home', 'User', 'Users', 'UserPlus', 'Settings', 'Mail', 'Phone', 'MapPin',
  'Calendar', 'Clock', 'Heart', 'Star', 'ThumbsUp', 'MessageCircle', 'Send',
  // Navegação & UI
  'Search', 'Filter', 'Bell', 'BellOff',
  'Check', 'CircleCheck', 'CircleX', 'CircleAlert', 'Info', 'CircleHelp',
  'Plus', 'Minus', 'SquarePen', 'Trash2', 'Download', 'Upload',
  'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
  'Ellipsis', 'EllipsisVertical',
  // Comércio & Negócios
  'ShoppingCart', 'CreditCard', 'Briefcase', 'Building',
  'Key', 'Shield', 'Award', 'Target', 'Package', 'Truck',
  // Dados & Análise
  'TrendingUp', 'TrendingDown', 'ChartBar', 'PieChart', 'Activity',
  // Links & Arquivos
  'Share', 'Copy', 'Link', 'ExternalLink', 'Eye', 'EyeOff', 'Lock', 'Unlock',
  'FileText', 'Folder', 'Save', 'Archive', 'Printer',
  // Tecnologia
  'Zap', 'Cpu', 'Smartphone', 'Laptop', 'Monitor',
  'Globe', 'Wifi', 'Bluetooth', 'Battery',
  // Mídia
  'Volume2', 'Music', 'Play', 'Pause', 'SkipForward', 'SkipBack',
  'Camera', 'Image',
  // Viagem & Vida
  'Plane', 'Coffee', 'Sun', 'Moon',
  // Natureza & Design
  'Sparkles', 'Flame', 'Droplet', 'Wind', 'Cloud', 'Umbrella',
  'Palette', 'Brush', 'Pencil', 'Eraser', 'Scissors',
  // Layout & Grid
  'Layers', 'LayoutGrid', 'LayoutDashboard', 'Menu',
] as const;

export type LucideIconName = typeof AVAILABLE_LUCIDE_ICONS[number];

/**
 * Mapa de aliases para nomes antigos salvos no banco de dados.
 * Quando um ícone é buscado e não encontrado, tenta-se o alias antes do fallback Circle.
 * Esses nomes foram renomeados no lucide-react v0.480+.
 */
export const LEGACY_ICON_ALIASES: Record<string, string> = {
  BarChart:       'ChartBar',
  Edit:           'SquarePen',
  Grid:           'LayoutGrid',
  Layout:         'LayoutDashboard',
  MoreVertical:   'EllipsisVertical',
  MoreHorizontal: 'Ellipsis',
  HelpCircle:     'CircleHelp',
  XCircle:        'CircleX',
  CheckCircle:    'CircleCheck',
  AlertCircle:    'CircleAlert',
};
