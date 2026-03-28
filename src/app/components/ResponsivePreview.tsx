import { useState } from 'react';
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink } from 'lucide-react';

type Viewport = {
  name: string;
  icon: typeof Monitor;
  width: number;
  height: number;
  scale?: number;
};

const VIEWPORTS: Record<string, Viewport> = {
  desktop: {
    name: 'Desktop',
    icon: Monitor,
    width: 1440,
    height: 900,
  },
  tablet: {
    name: 'Tablet',
    icon: Tablet,
    width: 834,
    height: 1112,
  },
  mobile: {
    name: 'Mobile',
    icon: Smartphone,
    width: 390,
    height: 844,
  },
};

type ResponsivePreviewProps = {
  url: string;
  title?: string;
};

export function ResponsivePreview({ url, title = 'Preview' }: ResponsivePreviewProps) {
  const [viewport, setViewport] = useState<keyof typeof VIEWPORTS>('desktop');
  const [key, setKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEmptyHint, setShowEmptyHint] = useState(false);

  const currentViewport = VIEWPORTS[viewport];
  const Icon = currentViewport.icon;

  // Calculate scale to fit in container
  const containerMaxWidth = 1200;
  const containerMaxHeight = 700;
  const scaleX = containerMaxWidth / currentViewport.width;
  const scaleY = containerMaxHeight / currentViewport.height;
  const scale = Math.min(scaleX, scaleY, 1);

  const scaledWidth = currentViewport.width * scale;
  const scaledHeight = currentViewport.height * scale;

  function handleRefresh() {
    setError(null);
    setLoading(true);
    setKey((prev) => prev + 1);
  }

  function handleOpenNewTab() {
    window.open(url, '_blank');
  }

  function handleIframeLoad() {
    setLoading(false);
    setError(null);
    
    // Show hint after a short delay
    setTimeout(() => {
      setShowEmptyHint(true);
    }, 1500);
    
    // Check if iframe has content
    try {
      const iframe = document.querySelector(`iframe[src="${url}"]`) as HTMLIFrameElement;
      if (iframe?.contentWindow) {
        // iframe accessible
      }
    } catch (e) {
      // CORS restriction - expected for cross-origin content
    }
  }

  function handleIframeError() {
    setLoading(false);
    setError('Falha ao carregar preview');
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          {Object.entries(VIEWPORTS).map(([key, vp]) => {
            const VpIcon = vp.icon;
            const isActive = viewport === key;

            return (
              <button
                key={key}
                onClick={() => setViewport(key as keyof typeof VIEWPORTS)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isActive
                    ? 'bg-[#ea526e] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                style={{ transition: 'none' }}
              >
                <VpIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{vp.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600 mr-3">
            {currentViewport.width} × {currentViewport.height}
            {scale < 1 && ` (${Math.round(scale * 100)}%)`}
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:bg-white rounded-lg border border-gray-300"
            style={{ transition: 'none' }}
            title="Recarregar preview"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleOpenNewTab}
            className="p-2 text-gray-600 hover:bg-white rounded-lg border border-gray-300"
            style={{ transition: 'none' }}
            title="Abrir em nova aba"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg border border-gray-200 min-h-[600px] relative">
        {/* Iframe Blocker Notice */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/95 backdrop-blur-sm z-20 rounded-lg">
          <div className="text-center max-w-md p-6">
            <ExternalLink className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Preview em Nova Aba
            </h3>
            <p className="text-gray-600 mb-6">
              Por restrições de segurança do ambiente Figma, o preview inline não está disponível. 
              Clique no botão abaixo para visualizar a página em uma nova aba.
            </p>
            <button
              onClick={handleOpenNewTab}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ea526e] text-white rounded-lg hover:bg-[#d94860] text-lg font-medium"
              style={{ transition: 'none' }}
            >
              <ExternalLink className="h-5 w-5" />
              Abrir Preview em Nova Aba
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Você também pode usar o botão no canto superior direito
            </p>
          </div>
        </div>
        
        <div
          className="bg-white shadow-2xl rounded-lg overflow-hidden relative"
          style={{
            width: scaledWidth,
            height: scaledHeight,
          }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-gray-600">Carregando preview...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="text-red-500 text-4xl mb-2">⚠️</div>
                <p className="text-sm text-gray-600">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-4 py-2 bg-[#ea526e] text-white rounded-lg hover:bg-[#d94860]"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}
          
          <div
            style={{
              width: currentViewport.width,
              height: currentViewport.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <iframe
              key={key}
              src={url}
              title={title}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Preview renderizado em tempo real do site público</p>
        {showEmptyHint && (
          <p className="mt-2 text-gray-400">Se o preview estiver vazio, tente recarregar ou abrir em uma nova aba.</p>
        )}
      </div>
    </div>
  );
}