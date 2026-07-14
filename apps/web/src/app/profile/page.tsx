import { buildProfileViewModel } from "./profile-data";
import { ProfileShell } from "./profile-shell";
import { loadProfileData } from "./profile-service";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { user, attempts, recommendations } = await loadProfileData();
  const profile = buildProfileViewModel({
    user,
    attempts,
    recommendations,
  });

  return <ProfileShell profile={profile} />;
}
