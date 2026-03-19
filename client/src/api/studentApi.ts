import type { Student, StudentFormData } from '../types/Student.ts';

const BASE = '/api/students';   // ✅ was "/students" — missing /api prefix

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T> | { success: false; message: string };
  if (!res.ok || !json.success) {
    throw new Error((json as { message?: string }).message ?? 'Request failed');
  }
  return (json as ApiResponse<T>).data;
}

export const studentApi = {
  list(): Promise<Student[]> {
    return fetch(BASE).then(handleResponse<Student[]>);
  },

  getById(id: string): Promise<Student> {
    return fetch(`${BASE}/${id}`).then(handleResponse<Student>);
  },

  create(dto: StudentFormData): Promise<Student> {
    return fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then(handleResponse<Student>);
  },

  update(id: string, dto: Partial<StudentFormData>): Promise<Student> {
    return fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then(handleResponse<Student>);
  },

  delete(id: string): Promise<void> {
    return fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(async (res) => {
      if (!res.ok) {
        const json = (await res.json()) as { message?: string };
        throw new Error(json.message ?? 'Delete failed');
      }
    });
  },
};