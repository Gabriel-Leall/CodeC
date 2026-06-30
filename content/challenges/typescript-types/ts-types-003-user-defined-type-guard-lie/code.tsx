type LoadedUser = { id: string; ready: true };

function isLoadedUser(value: unknown): value is LoadedUser {
  return Boolean(value);
}

function renderUser(value: unknown) {
  if (!isLoadedUser(value)) return "empty";
  return value.id.toUpperCase();
}
