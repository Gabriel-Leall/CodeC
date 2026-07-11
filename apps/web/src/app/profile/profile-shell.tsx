import { ProfileContent } from "./profile-content";
import { ProfileSidebar } from "./profile-sidebar";
import { ProfileTopHeader } from "./profile-top-header";
import type { ProfileViewModel } from "./profile-types";

export function ProfileShell({ profile }: { profile: ProfileViewModel }) {
  return (
    <main
      data-profile-screen="true"
      className="h-svh min-h-0 bg-[var(--profile-bg)] text-[var(--profile-text-primary)]"
    >
      <div className="grid h-full min-h-0 grid-rows-[72px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
        <ProfileSidebar />
        <div className="min-w-0 lg:col-start-2">
          <ProfileTopHeader user={profile.user} />
        </div>
        <section className="min-h-0 overflow-auto px-4 py-4 sm:px-6 lg:col-start-2 lg:px-6 lg:py-5">
          <ProfileContent profile={profile} />
        </section>
      </div>
    </main>
  );
}
