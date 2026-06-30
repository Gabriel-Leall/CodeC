import React, { useState } from "react";

type Profile = {
  name: string;
  prefs: {
    compact: boolean;
  };
};

export function ProfileSettings() {
  const [profile, setProfile] = useState<Profile>({
    name: "Ana",
    prefs: { compact: false },
  });

  const enableCompact = () => {
    profile.prefs.compact = true;
    setProfile(profile);
  };

  return (
    <div>
      <button onClick={enableCompact}>Compactar</button>
      <p>{profile.prefs.compact ? "Compacto" : "Normal"}</p>
    </div>
  );
}
