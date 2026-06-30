async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  return data as T;
}

type User = {
  id: string;
  name: string;
};

async function loadUser() {
  const user = await getJson<User>("/api/user");
  return user.name.toUpperCase();
}
