import { useState, useEffect, useCallback } from 'react';
import type { Student, StudentFormData } from './types/Student.ts';
import StudentForm from './components/studentForm.tsx';
import StudentList from './components/studentList.tsx';
import './App.css';

const API = '/api/students';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API);
      const json = await res.json() as { success: boolean; data: Student[]; message?: string };
      if (json.success) setStudents(json.data);
      else setError(json.message ?? 'Failed to load');
    } catch {
      setError('Could not reach the server. Is it running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchStudents(); }, [fetchStudents]);

  const handleCreate = async (data: StudentFormData) => {
    setFormLoading(true);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json() as { success: boolean; message?: string };
      if (!json.success) throw new Error(json.message ?? 'Create failed');
      setShowForm(false);
      void fetchStudents();
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: StudentFormData) => {
    if (!editing) return;
    setFormLoading(true);
    try {
      const res = await fetch(`${API}/${editing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json() as { success: boolean; message?: string };
      if (!json.success) throw new Error(json.message ?? 'Update failed');
      setEditing(null);
      void fetchStudents();
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this student?')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      const json = await res.json() as { success: boolean };
      if (json.success) setStudents(prev => prev.filter(s => s._id !== id));
    } catch {
      setError('Delete failed');
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.subject.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: students.length,
    avgAge: students.length ? Math.round(students.reduce((a, s) => a + s.age, 0) / students.length) : 0,
    topGrade: students.filter(s => s.grade === 'A').length,
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <div>
              <h1>Student<span>Hub</span></h1>
              <p className="subtitle">Management System</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-primary add-btn" onClick={() => { setEditing(null); setShowForm(true); }}>
            + Add Student
          </button>
        </div>
      </header>

      <div className="stats-bar">
        <div className="stat"><span className="stat-num">{stats.total}</span><span className="stat-label">Students</span></div>
        <div className="stat-divider" />
        <div className="stat"><span className="stat-num">{stats.avgAge}</span><span className="stat-label">Avg Age</span></div>
        <div className="stat-divider" />
        <div className="stat"><span className="stat-num">{stats.topGrade}</span><span className="stat-label">A-Grade</span></div>
      </div>

      <main className="main-content">
        <div className="toolbar">
          <input
            className="search-input"
            type="search"
            placeholder="Search by name, email or subject…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {error && <div className="alert-error">{error} <button onClick={() => setError('')}>✕</button></div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading students…</p>
          </div>
        ) : (
          <StudentList students={filtered} onEdit={s => { setEditing(s); setShowForm(true); }} onDelete={handleDelete} />
        )}
      </main>

      {showForm && (
        <StudentForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          loading={formLoading}
        />
      )}
    </div>
  );
}