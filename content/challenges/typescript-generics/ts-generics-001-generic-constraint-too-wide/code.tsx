function firstId<T extends object>(items: T[]) {
  if (items.length === 0) return undefined;
  return (items[0] as { id: string }).id;
}

const users = [{ id: "u1", name: "Ana" }];
const id = firstId(users);
