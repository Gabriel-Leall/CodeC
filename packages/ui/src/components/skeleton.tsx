import { cn } from "@kodan/ui/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-none border border-border bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
