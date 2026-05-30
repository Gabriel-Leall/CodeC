"use client";

import { cn } from "@CC/ui/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";

function ZenTabs({ className, ...props }: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("flex flex-col gap-3", className)} {...props} />;
}

function ZenTabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("flex flex-wrap items-center gap-2 border-b border-[color:var(--zen-border)]", className)}
      {...props}
    />
  );
}

function ZenTabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "zen-focus group relative px-3 pb-2 pt-1 text-xs font-semibold text-[color:var(--zen-muted)] transition-colors hover:text-[color:var(--zen-ink)] data-[state=active]:text-[color:var(--zen-ink)]",
        "after:absolute after:bottom-[-1px] after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[color:var(--zen-hanko)] after:transition-transform data-[state=active]:after:scale-x-100",
        className,
      )}
      {...props}
    />
  );
}

function ZenTabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("zen-focus text-sm/relaxed text-[color:var(--zen-ink)]", className)}
      {...props}
    />
  );
}

export { ZenTabs, ZenTabsContent, ZenTabsList, ZenTabsTrigger };

