const cache = new Map<string, string>();

async function refreshUser(id: string) {
  const value = await fetchUser(id);
  cache.set(id, value);
}

async function refreshVisibleUsers() {
  await Promise.all([
    refreshUser("u1"),
    refreshUser("u1"),
  ]);
}
