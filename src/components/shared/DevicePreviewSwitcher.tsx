/**
 * DevicePreviewSwitcher
 *
 * Switcher de preview por dispositivo no admin.
 * Permite visualizar como ficará em mobile/tablet/desktop.
 */

'use client';

import { useState } from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import type { Breakpoint } from '@/types/cms';

export interface DevicePreviewSwitcherProps {
  value: Breakpoint;
  onChange: (breakpoint: Breakpoint) => void;
}

const devices = [
  { value: 'mobile' as Breakpoint, label: 'Mobile', icon: Smartphone },
  { value: 'tablet' as Breakpoint, label: 'Tablet', icon: Tablet },
  { value: 'desktop' as Breakpoint, label: 'Desktop', icon: Monitor },
];

export function DevicePreviewSwitcher({ value, onChange }: DevicePreviewSwitcherProps) {
  return (
    <div className="inline-flex items-center gap-1 bg-muted rounded-lg p-1">
      {devices.map((device) => {
        const Icon = device.icon;
        const isActive = value === device.value;

        return (
          <button
            key={device.value}
            onClick={() => onChange(device.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded transition-all',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label={device.label}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">{device.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * PreviewFrame
 *
 * Frame de preview com dimensões responsivas
 */
export interface PreviewFrameProps {
  breakpoint: Breakpoint;
  children: React.ReactNode;
}

export function PreviewFrame({ breakpoint, children }: PreviewFrameProps) {
  const dimensions = {
    mobile: { width: '375px', height: '667px' },
    tablet: { width: '768px', height: '1024px' },
    desktop: { width: '100%', height: '100%' },
  };

  const { width, height } = dimensions[breakpoint];

  return (
    <div className="flex items-center justify-center bg-muted/30 p-8 rounded-lg overflow-auto">
      <div
        className={cn(
          'bg-background shadow-2xl transition-all duration-300',
          breakpoint === 'mobile' && 'rounded-3xl',
          breakpoint === 'tablet' && 'rounded-2xl',
          breakpoint === 'desktop' && 'w-full h-full'
        )}
        style={{
          width,
          height: breakpoint === 'desktop' ? 'auto' : height,
          maxWidth: '100%',
        }}
      >
        <div className="h-full overflow-auto">{children}</div>
      </div>
    </div>
  );
}
