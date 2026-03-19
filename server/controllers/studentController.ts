import type { Request, Response } from 'express';
import { studentService, NotFoundError, ConflictError } from '../services/studentService';
import { validateCreateDto, validateUpdateDto } from '../dto/studentDto';

function handleError(err: unknown, res: Response): void {
  if (err instanceof NotFoundError) {
    res.status(404).json({ success: false, message: err.message });
  } else if (err instanceof ConflictError) {
    res.status(409).json({ success: false, message: err.message });
  } else if (err instanceof Error) {
    res.status(400).json({ success: false, message: err.message });
  } else {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const studentController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const students = await studentService.getAll();
      res.json({ success: true, count: students.length, data: students });
    } catch (err) {
      handleError(err, res);
    }
  },

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const student = await studentService.getById(req.params['id'] ?? '');
      res.json({ success: true, data: student });
    } catch (err) {
      handleError(err, res);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto = validateCreateDto(req.body);
      const student = await studentService.create(dto);
      res.status(201).json({ success: true, data: student });
    } catch (err) {
      handleError(err, res);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const dto = validateUpdateDto(req.body);
      const student = await studentService.update(req.params['id'] ?? '', dto);
      res.json({ success: true, data: student });
    } catch (err) {
      handleError(err, res);
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await studentService.delete(req.params['id'] ?? '');
      res.json({ success: true, message: 'Student deleted successfully' });
    } catch (err) {
      handleError(err, res);
    }
  },
};