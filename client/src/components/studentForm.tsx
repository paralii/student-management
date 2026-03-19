import { useState, useEffect } from 'react';
import type { Student, StudentFormData } from '../types/student';
import { GRADE_OPTIONS } from '../types/student';

interface StudentFormProps {
  initial?: Student | null;
  onSubmit: (data: StudentFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const empty: StudentFormData = { name: '', email: '', age: 18, grade: 'A', subject: '' };

export default function StudentForm({ initial, onSubmit, onCancel, loading }: StudentFormProps) {
  const [form, setForm] = useState<StudentFormData>(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({ name: initial.name, email: initial.email, age: initial.age, grade: initial.grade, subject: initial.subject });
    } else {
      setForm(empty);
    }
  }, [initial]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'age' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(form);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initial ? 'Edit Student' : 'New Student'}</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          {error && <p className="form-error">{error}</p>}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handle} placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="john@example.com" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input name="age" type="number" value={form.age} onChange={handle} min={5} max={100} required />
            </div>
            <div className="form-group">
              <label>Grade</label>
              <select name="grade" value={form.grade} onChange={handle} required>
                {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input name="subject" value={form.subject} onChange={handle} placeholder="Mathematics" required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving…' : initial ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}