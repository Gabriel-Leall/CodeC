import { buildStaticProfileViewModel } from "./profile-data";
import { ProfileContent } from "./profile-content";

export default function ProfilePage() {
  const profile = buildStaticProfileViewModel();

  return (
    <main
      data-profile-screen="true"
      className="min-h-full bg-[var(--profile-bg)] px-4 py-6 text-[var(--profile-text-primary)] sm:px-6 lg:px-8"
    >
      <ProfileContent profile={profile} />
    </main>
  );
}
