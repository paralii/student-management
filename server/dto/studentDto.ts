export interface CreateStudentDto {
  name: string;
  email: string;
  age: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  subject: string;
}

export type UpdateStudentDto = Partial<CreateStudentDto>;

export function validateCreateDto(body: unknown): CreateStudentDto {
  const b = body as Record<string, unknown>;
  const errors: string[] = [];

  if (!b['name'] || typeof b['name'] !== 'string' || b['name'].trim().length < 2)
    errors.push('name must be at least 2 characters');

  if (!b['email'] || typeof b['email'] !== 'string' || !/^\S+@\S+\.\S+$/.test(b['email']))
    errors.push('valid email is required');

  if (b['age'] === undefined || typeof b['age'] !== 'number' || b['age'] < 5 || b['age'] > 100)
    errors.push('age must be a number between 5 and 100');

  if (!b['grade'] || !['A', 'B', 'C', 'D', 'F'].includes(b['grade'] as string))
    errors.push('grade must be one of A, B, C, D, F');

  if (!b['subject'] || typeof b['subject'] !== 'string' || b['subject'].trim().length < 1)
    errors.push('subject is required');

  if (errors.length > 0) throw new Error(errors.join('; '));

  return {
    name: (b['name'] as string).trim(),
    email: (b['email'] as string).toLowerCase().trim(),
    age: b['age'] as number,
    grade: b['grade'] as CreateStudentDto['grade'],
    subject: (b['subject'] as string).trim(),
  };
}

export function validateUpdateDto(body: unknown): UpdateStudentDto {
  const b = body as Record<string, unknown>;
  const dto: UpdateStudentDto = {};

  if (b['name'] !== undefined) {
    if (typeof b['name'] !== 'string' || b['name'].trim().length < 2)
      throw new Error('name must be at least 2 characters');
    dto.name = b['name'].trim();
  }
  if (b['email'] !== undefined) {
    if (typeof b['email'] !== 'string' || !/^\S+@\S+\.\S+$/.test(b['email']))
      throw new Error('valid email is required');
    dto.email = b['email'].toLowerCase().trim();
  }
  if (b['age'] !== undefined) {
    if (typeof b['age'] !== 'number' || b['age'] < 5 || b['age'] > 100)
      throw new Error('age must be a number between 5 and 100');
    dto.age = b['age'];
  }
  if (b['grade'] !== undefined) {
    if (!['A', 'B', 'C', 'D', 'F'].includes(b['grade'] as string))
      throw new Error('grade must be one of A, B, C, D, F');
    dto.grade = b['grade'] as CreateStudentDto['grade'];
  }
  if (b['subject'] !== undefined) {
    if (typeof b['subject'] !== 'string' || b['subject'].trim().length < 1)
      throw new Error('subject is required');
    dto.subject = b['subject'].trim();
  }

  return dto;
}