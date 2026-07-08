import { cn } from "@kodan/ui/lib/utils";

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    // react-doctor-disable-next-line react-doctor/prefer-tag-over-role
    <div
      className={cn(
        "h-1.5 overflow-hidden rounded-full bg-[color:var(--profile-border)]",
        className,
      )}
      aria-label={label}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
    >
      <div
        className="h-full rounded-full bg-[var(--profile-accent-blue)]"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
