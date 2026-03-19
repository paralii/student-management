import { studentRepository } from '../repositories/studentRepository';
import type { CreateStudentDto, UpdateStudentDto } from '../dto/studentDto';
import type { IStudent } from '../models/Student';

export class StudentService {
  async getAll(): Promise<IStudent[]> {
    return studentRepository.findAll();
  }

  async getById(id: string): Promise<IStudent> {
    const student = await studentRepository.findById(id);
    if (!student) throw new NotFoundError(`Student with id "${id}" not found`);
    return student;
  }

  async create(dto: CreateStudentDto): Promise<IStudent> {
    const existing = await studentRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError(`Email "${dto.email}" is already registered`);
    return studentRepository.create(dto);
  }

  async update(id: string, dto: UpdateStudentDto): Promise<IStudent> {
    if (dto.email) {
      const existing = await studentRepository.findByEmail(dto.email);
      if (existing && String(existing._id) !== id)
        throw new ConflictError(`Email "${dto.email}" is already in use`);
    }
    const updated = await studentRepository.update(id, dto);
    if (!updated) throw new NotFoundError(`Student with id "${id}" not found`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await studentRepository.delete(id);
    if (!deleted) throw new NotFoundError(`Student with id "${id}" not found`);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export const studentService = new StudentService();