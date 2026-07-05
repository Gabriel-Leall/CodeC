import { cn } from "@kodan/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const alertVariants = cva(
  [
    "relative w-full overflow-hidden rounded-none border px-3 py-2 text-xs leading-relaxed",
    "before:pointer-events-none before:absolute before:inset-0 before:opacity-70",
    "before:bg-[radial-gradient(circle_at_15%_20%,_var(--parchment-fiber)_0,_transparent_48%),radial-gradient(circle_at_85%_75%,_var(--parchment-fiber)_0,_transparent_52%)]",
    "after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-[repeating-linear-gradient(90deg,transparent,transparent_5px,var(--parchment-edge)_6px,transparent_9px)]",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "[&>svg]:absolute [&>svg]:top-2.5 [&>svg]:left-3",
    "has-[>svg]:pl-9",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-[var(--parchment-border)] bg-[var(--parchment-bg)] text-[var(--parchment-ink)]",
        success:
          "border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success-foreground)]",
        warning:
          "border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning-foreground)]",
        error: "border-[var(--error-border)] bg-[var(--error-bg)] text-[var(--error-foreground)]",
        info: "border-[var(--info-border)] bg-[var(--info-bg)] text-[var(--info-foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 font-semibold tracking-[0.04em] uppercase", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-[11px] leading-relaxed opacity-95 [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
