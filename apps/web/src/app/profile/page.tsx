import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getLoginHref } from "@/lib/auth-navigation";
import { isMockMode } from "@/lib/mock-mode";
import { getRuntimeSession } from "@/lib/runtime-data";
import { buildProfileViewModel } from "./profile-data";
import { ProfileShell } from "./profile-shell";
import { loadProfileData } from "./profile-service";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = isMockMode()
    ? null
    : await getRuntimeSession(await headers());

  if (!isMockMode() && !session?.user) {
    redirect(getLoginHref("/profile"));
  }

  const { user, attempts, recommendations } = await loadProfileData(
    session?.user.id,
  );
  const profile = buildProfileViewModel({
    user,
    attempts,
    recommendations,
  });

  return <ProfileShell profile={profile} />;
}
