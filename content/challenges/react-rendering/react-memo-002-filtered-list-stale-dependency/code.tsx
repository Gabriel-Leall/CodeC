import React, { useMemo, useState } from "react";

type User = { id: string; name: string };

export function Directory({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");

  const visibleUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [users]);

  return (
    <section>
      <input value={query} onChange={event => setQuery(event.target.value)} />
      <ul>
        {visibleUsers.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </section>
  );
}
