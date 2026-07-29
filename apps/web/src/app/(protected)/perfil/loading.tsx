export default function ProfileLoading() {
  return (
    <main
      data-profile-screen="true"
      className="min-h-full bg-[var(--profile-bg)] px-4 py-6 text-[var(--profile-text-primary)] sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5">
        <SkeletonBlock className="min-h-[220px]" />
        <SkeletonBlock className="min-h-[120px]" />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <SkeletonBlock className="min-h-[340px]" />
          <SkeletonBlock className="min-h-[340px]" />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <SkeletonBlock className="min-h-[360px]" />
          <SkeletonBlock className="min-h-[360px]" />
        </div>
        <SkeletonBlock className="min-h-[180px]" />
      </div>
    </main>
  );
}

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`profile-panel animate-pulse rounded-[8px] border ${className}`}
      aria-hidden="true"
    >
      <div className="h-full rounded-[8px] bg-[color-mix(in_srgb,var(--profile-surface-elevated)_70%,transparent)]" />
    </div>
  );
}
