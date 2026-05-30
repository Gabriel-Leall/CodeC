import { HankoMarkSvg } from "@CC/ui/assets/zen/sumi-strokes";
import { cn } from "@CC/ui/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type ZenAvatarProps = ComponentProps<"div"> & {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  seal?: boolean;
};

export function ZenAvatar({ className, src, alt = "", fallback, seal = true, ...props }: ZenAvatarProps) {
  return (
    <div
      className={cn("relative grid size-14 place-items-center border border-[color:var(--zen-border)] text-[color:var(--zen-ink)]", className)}
      {...props}
    >
      {src ? <img src={src} alt={alt} className="size-full object-cover" /> : <span className="text-sm font-semibold">{fallback ?? "道"}</span>}
      {seal ? (
        <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center border border-[color:var(--zen-hanko)] bg-[color:var(--zen-washi)] text-[color:var(--zen-hanko)]">
          <HankoMarkSvg className="size-3.5" />
        </span>
      ) : null}
    </div>
  );
}

