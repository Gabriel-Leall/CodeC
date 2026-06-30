import React, { useEffect, useState } from "react";

type User = { id: string; name: string };

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/users/" + userId)
      .then(response => response.json())
      .then(data => setUser(data));
  }, [userId]);

  return <p>{user ? user.name : "Loading..."}</p>;
}
