import { Student } from "../types/student";

const BASE = "/students";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error: string }).error ?? "Unknown error");
  return data as T;
}

export const studentApi = {
  list(): Promise<Student[]> {
    return fetch(BASE).then((r) => handleResponse<Student[]>(r));
  },

  search(query: string): Promise<Student[]> {
    return fetch(`${BASE}/search?q=${encodeURIComponent(query)}`).then((r) =>
      handleResponse<Student[]>(r)
    );
  },

  create(name: string, email: string): Promise<Student> {
    return fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    }).then((r) => handleResponse<Student>(r));
  },

  update(id: string, name: string, email: string): Promise<Student> {
    return fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    }).then((r) => handleResponse<Student>(r));
  },

  delete(id: string): Promise<void> {
    return fetch(`${BASE}/${id}`, { method: "DELETE" }).then((r) =>
      handleResponse<void>(r)
    );
  },
};