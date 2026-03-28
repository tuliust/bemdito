"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "./utils";

function Label({
  className,
  style,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      style={{
        fontSize:   'var(--admin-item-tertiary-size,   0.875rem)',
        fontWeight: 'var(--admin-item-tertiary-weight, 500)',
        color:      'var(--admin-item-tertiary-color,  inherit)',
        ...style,
      }}
      {...props}
    />
  );
}

export { Label };