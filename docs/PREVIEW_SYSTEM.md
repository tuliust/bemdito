# 📱 Sistema de Preview Responsivo

## 🎯 Objetivo

Permitir visualizar páginas do CMS com **fidelidade 1:1** ao site público, alternando entre viewports (Desktop/Tablet/Mobile) sem distorção de layout.

---

## 📐 Especificação de Viewports

### Desktop
- **Resolução**: 1440 × 900
- **Breakpoint CSS**: ≥ 1024px
- **Comportamento**: Menu horizontal, megamenu no hover, grid 4 colunas

### Tablet (Portrait)
- **Resolução**: 834 × 1112 (iPad Pro 11")
- **Breakpoint CSS**: 768–1023px
- **Comportamento**: Menu compacto, grid 2 colunas

### Tablet (Landscape) - Opcional
- **Resolução**: 1024 × 768
- **Breakpoint CSS**: 768–1023px
- **Comportamento**: Similar ao Portrait

### Mobile
- **Resolução**: 390 × 844 (iPhone 12/13)
- **Breakpoint CSS**: ≤ 767px
- **Comportamento**: Hamburger menu, drawer lateral, stack vertical

### Mobile (Android) - Opcional
- **Resolução**: 360 × 800
- **Breakpoint CSS**: ≤ 767px
- **Comportamento**: Igual ao Mobile

---

## 🏗️ Arquitetura

### Opção 1: Preview via iframe (RECOMENDADA)

**Vantagens**:
- ✅ Isolamento total de CSS (sem conflitos)
- ✅ Fidelidade 1:1 (usa exatamente os mesmos componentes)
- ✅ Breakpoints reais do site público
- ✅ JavaScript e interações funcionam normalmente

**Implementação**:
```tsx
<iframe 
  src={`/preview/${slug}?draft=1`}
  width={viewport.width}
  height={viewport.height}
  style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
/>
```

**Rota de preview**: `/preview/:slug`
- Query param `?draft=1`: renderiza versão draft (não publicada)
- Query param `?published=1`: renderiza versão publicada
- Usa os mesmos componentes do site público
- Fetch de dados do Supabase com status `draft` ou `published`

---

### Opção 2: Preview inline (NÃO recomendada)

**Desvantagens**:
- ❌ Conflitos de CSS entre Admin e site público
- ❌ Difícil garantir fidelidade 1:1
- ❌ Breakpoints podem não funcionar corretamente

---

## 🎨 UI do Preview

### Controles de Viewport

```
┌─────────────────────────────────────────────────┐
│  [ Desktop ] [ Tablet ] [ Mobile ] [ Full ]     │
│                                      [ Refresh ] │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │         Preview (iframe)                  │ │
│  │                                           │ │
│  │                                           │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  1440 × 900 · Desktop                           │
└─────────────────────────────────────────────────┘
```

**Elementos**:
- **Botões de viewport**: Desktop, Tablet, Mobile, Full width
- **Botão Refresh**: Atualizar preview (ou auto-refresh ao salvar)
- **Canvas central**: iframe com moldura e escala automática
- **Info de viewport**: Exibe resolução atual (ex: "1440 × 900 · Desktop")

---

## 🔧 Componentes Necessários

### 1. PreviewFrame
**Localização**: `/src/app/components/admin/PreviewFrame.tsx`

**Props**:
```tsx
interface PreviewFrameProps {
  slug: string;
  viewport: 'desktop' | 'tablet' | 'mobile' | 'full';
  isDraft?: boolean;
}
```

**Responsabilidades**:
- Renderiza iframe apontando para `/preview/:slug`
- Calcula escala para caber no painel mantendo proporção
- Exibe moldura/borda ao redor do iframe
- Exibe info de resolução

---

### 2. PreviewControls
**Localização**: `/src/app/components/admin/PreviewControls.tsx`

**Props**:
```tsx
interface PreviewControlsProps {
  currentViewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  onRefresh: () => void;
}
```

**Responsabilidades**:
- Botões para alternar viewport
- Botão de refresh
- Active state no viewport atual

---

### 3. PreviewPublicPage
**Localização**: `/src/app/preview/[slug].tsx` (rota pública)

**Responsabilidades**:
- Fetch de página por slug
- Renderiza com os mesmos componentes do site público
- Suporta `?draft=1` para draft mode
- Aplica tokens do Design System
- Renderiza header/footer se configurado

---

## 📋 Viewports Configuration

```tsx
// /src/lib/constants/viewports.ts
export const VIEWPORTS = {
  desktop: {
    width: 1440,
    height: 900,
    label: 'Desktop',
    breakpoint: '≥ 1024px',
  },
  tablet: {
    width: 834,
    height: 1112,
    label: 'Tablet',
    breakpoint: '768–1023px',
  },
  mobile: {
    width: 390,
    height: 844,
    label: 'Mobile',
    breakpoint: '≤ 767px',
  },
  full: {
    width: '100%',
    height: '100%',
    label: 'Full Width',
    breakpoint: 'Adaptável',
  },
} as const;

export type ViewportKey = keyof typeof VIEWPORTS;
```

---

## 🔄 Fluxo de Trabalho

### 1. Usuário edita página no Admin

```tsx
// /src/app/admin/pages/editor.tsx
function PageEditor() {
  const [viewport, setViewport] = useState<ViewportKey>('desktop');
  const { slug } = useParams();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Editor (esquerda) */}
      <div>
        <SectionEditor />
      </div>

      {/* Preview (direita) */}
      <div>
        <PreviewControls 
          currentViewport={viewport}
          onViewportChange={setViewport}
        />
        <PreviewFrame 
          slug={slug} 
          viewport={viewport} 
          isDraft={true}
        />
      </div>
    </div>
  );
}
```

---

### 2. Preview renderiza página

```tsx
// /src/app/preview/[slug].tsx
export function PreviewPublicPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isDraft = searchParams.get('draft') === '1';

  const { data: page } = usePage(slug, isDraft);
  const { data: sections } = useSections(page?.id, isDraft);

  return (
    <PublicLayout>
      <PublicHeader />
      {sections.map(section => (
        <SectionRenderer key={section.id} config={section.config} />
      ))}
      <PublicFooter />
    </PublicLayout>
  );
}
```

---

### 3. Escala automática

```tsx
// /src/app/components/admin/PreviewFrame.tsx
function PreviewFrame({ slug, viewport, isDraft }: PreviewFrameProps) {
  const viewportConfig = VIEWPORTS[viewport];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const scaleX = containerWidth / viewportConfig.width;
    const scaleY = containerHeight / viewportConfig.height;
    
    // Usar o menor scale para caber sem cortar
    setScale(Math.min(scaleX, scaleY, 1));
  }, [viewport]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div 
        className="origin-top-left"
        style={{
          width: viewportConfig.width,
          height: viewportConfig.height,
          transform: `scale(${scale})`,
        }}
      >
        <iframe
          src={`/preview/${slug}?draft=${isDraft ? '1' : '0'}`}
          width={viewportConfig.width}
          height={viewportConfig.height}
          className="border border-gray-300 rounded-[1.5rem] shadow-lg"
        />
      </div>
    </div>
  );
}
```

---

## ✅ Critérios de Aceite

### Fidelidade 1:1
- [ ] Layout no preview é **idêntico** ao site público no mesmo viewport
- [ ] Breakpoints CSS funcionam corretamente
- [ ] Fonts e tokens são aplicados corretamente
- [ ] Menu se comporta como no público (hover desktop, drawer mobile)

### Interatividade
- [ ] Botões de viewport alternam corretamente
- [ ] Escala mantém proporção sem distorcer
- [ ] Refresh atualiza o preview
- [ ] Draft mode mostra alterações não publicadas

### Performance
- [ ] Preview carrega em < 2 segundos
- [ ] Alternar viewport é instantâneo
- [ ] Não há flickering ou reflow visível

---

## 🎯 Estados do Preview

### Draft Mode (`?draft=1`)
- Renderiza página com `status = 'draft'`
- Renderiza seções com `status = 'draft'`
- Exibe banner "Preview - Não publicado"
- Permite ver mudanças antes de publicar

### Published Mode (`?draft=0` ou sem param)
- Renderiza página com `status = 'published'`
- Renderiza seções com `status = 'published'`
- Comportamento idêntico ao site público

---

## 🔐 Segurança

### Preview de Draft
- **Requer autenticação**: Apenas admins logados podem ver drafts
- **Token JWT**: Passa token na URL ou header
- **RLS Policy**: Supabase valida se usuário tem permissão

```tsx
// Preview route com auth
const { session } = useAuth();

if (isDraft && !session) {
  return <Navigate to="/admin/login" />;
}
```

---

## 📊 Debugging

### Verificar se preview está correto

1. **Inspecionar iframe**:
   - Abrir DevTools
   - Selecionar iframe
   - Verificar elementos renderizados

2. **Comparar com site público**:
   - Abrir página publicada em nova aba
   - Redimensionar janela para mesmo viewport
   - Comparar visualmente

3. **Verificar breakpoints**:
   - Usar DevTools Responsive Mode
   - Testar 390px, 834px, 1440px
   - Confirmar que layout muda corretamente

---

## 🚀 Roadmap de Implementação

### Fase 1: Preview básico
- [ ] Criar rota `/preview/:slug`
- [ ] Fetch de página por slug (draft + published)
- [ ] Renderizar seções com `SectionRenderer`
- [ ] Aplicar tokens do Design System

### Fase 2: Controles de viewport
- [ ] Criar `PreviewFrame` component
- [ ] Criar `PreviewControls` component
- [ ] Implementar escala automática
- [ ] Botões Desktop/Tablet/Mobile

### Fase 3: Integração com Editor
- [ ] Adicionar preview no `PageEditor`
- [ ] Split view (editor esquerda, preview direita)
- [ ] Auto-refresh ao salvar (opcional)
- [ ] Botão manual de refresh

### Fase 4: Refinamentos
- [ ] Loading state no preview
- [ ] Error boundary se página não existir
- [ ] Banner "Preview - Draft" no topo
- [ ] Sincronização scroll (opcional)

---

## 💡 Dicas de Implementação

### 1. Use PostMessage para comunicação iframe
```tsx
// No iframe (preview)
window.parent.postMessage({ type: 'PREVIEW_LOADED' }, '*');

// No admin (parent)
useEffect(() => {
  const handleMessage = (e: MessageEvent) => {
    if (e.data.type === 'PREVIEW_LOADED') {
      setPreviewReady(true);
    }
  };
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

### 2. Evite scroll horizontal no iframe
```css
iframe {
  overflow-x: hidden;
}
```

### 3. Adicione transição suave ao alternar viewport
```tsx
<motion.div
  animate={{ scale }}
  transition={{ duration: 0.3 }}
>
  <iframe ... />
</motion.div>
```

---

## 📚 Referências

- [MDN iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
- [PostMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [CSS Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)

---

**Última atualização**: 2026-02-10

