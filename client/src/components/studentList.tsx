import type { Student } from '../types/student';
import { GRADE_COLORS } from '../types/student';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export default function StudentList({ students, onEdit, onDelete }: StudentListProps) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <p>No students yet. Add your first student!</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="students-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Subject</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s._id} className="table-row">
              <td className="row-num">{i + 1}</td>
              <td className="name-cell">{s.name}</td>
              <td className="email-cell">{s.email}</td>
              <td>{s.age}</td>
              <td>{s.subject}</td>
              <td>
                <span
                  className="grade-badge"
                  style={{ '--grade-color': GRADE_COLORS[s.grade] } as React.CSSProperties}
                >
                  {s.grade}
                </span>
              </td>
              <td className="actions-cell">
                <button className="btn-edit" onClick={() => onEdit(s)}>Edit</button>
                <button className="btn-delete" onClick={() => onDelete(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}