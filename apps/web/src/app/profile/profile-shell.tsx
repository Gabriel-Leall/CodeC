import { ProfileContent } from "./profile-content";
import type { ProfileViewModel } from "./profile-types";

export function ProfileShell({ profile }: { profile: ProfileViewModel }) {
  return (
    <main
      data-profile-screen="true"
      className="min-h-[calc(100svh-4rem)] bg-[var(--profile-bg)] text-[var(--profile-text-primary)]"
    >
      <div className="min-h-0">
        <section className="min-h-0 px-4 py-4 sm:px-6 lg:px-7 lg:py-6">
          <ProfileContent profile={profile} />
        </section>
      </div>
    </main>
  );
}
