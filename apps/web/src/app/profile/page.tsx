import { buildStaticProfileViewModel } from "./profile-data";
import { ProfileShell } from "./profile-shell";

export default function ProfilePage() {
  const profile = buildStaticProfileViewModel();

  return <ProfileShell profile={profile} />;
}
