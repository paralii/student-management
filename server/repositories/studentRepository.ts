import Student, { IStudent } from '../models/Student';
import type { CreateStudentDto, UpdateStudentDto } from '../dto/studentDto';

export const studentRepository = {
  async findAll(): Promise<IStudent[]> {
    return Student.find().sort({ createdAt: -1 });
  },

  async findById(id: string): Promise<IStudent | null> {
    return Student.findById(id);
  },

  async findByEmail(email: string): Promise<IStudent | null> {
    return Student.findOne({ email });
  },

  async create(dto: CreateStudentDto): Promise<IStudent> {
    const student = new Student(dto);
    return student.save();
  },

  async update(id: string, dto: UpdateStudentDto): Promise<IStudent | null> {
    return Student.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
  },

  async delete(id: string): Promise<IStudent | null> {
    return Student.findByIdAndDelete(id);
  },

  async existsById(id: string): Promise<boolean> {
    return !!(await Student.exists({ _id: id }));
  },
};