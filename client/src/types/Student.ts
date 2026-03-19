export interface Student {
  _id: string;
  name: string;
  email: string;
  age: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  subject: string;
  createdAt: string;
  updatedAt: string;
}

export type StudentFormData = Omit<Student, '_id' | 'createdAt' | 'updatedAt'>;

export const GRADE_OPTIONS: Student['grade'][] = ['A', 'B', 'C', 'D', 'F'];

export const GRADE_COLORS: Record<Student['grade'], string> = {
  A: '#22c55e',
  B: '#3b82f6',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444',
};