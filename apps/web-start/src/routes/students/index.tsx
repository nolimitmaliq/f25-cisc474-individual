// src/routes/students/index.tsx

import { Link, createFileRoute } from '@tanstack/react-router';
import { useApiQuery } from '../../integrations/api';
import type { StudentOut } from '@repo/api';

export const Route = createFileRoute('/students/')({
  component: StudentListPage,
});

function StudentListPage() {
  // Use useApiQuery to fetch students with Auth0 authentication
  const { data: students, isLoading, isError, error } = useApiQuery<StudentOut[]>(
    ['students', 'list'],
    '/students'  // No /api prefix - matches backend @Controller('students')
  );

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Student Roster</h1>
        <p>Loading students...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Student Roster</h1>
        <p style={{ color: 'red' }}>
          Error loading students: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Student Roster</h1>
      <p>Select a student to view their dashboard.</p>
      
      {/* Create New Student Button */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/students/create"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s',
          }}
        >
          + Create New Student
        </Link>
      </div>

      {/* Student List */}
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
        {students && students.length > 0 ? (
          students.map((student) => (
            <Link
              key={student.id}
              to="/students/$id"
              params={{ id: student.id }}
              style={{
                display: 'block',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'black',
                backgroundColor: '#f9f9f9',
                transition: 'background-color 0.2s, box-shadow 0.2s',
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0' }}>
                {student.name} {student.lastname}
              </h3>
              <p style={{ margin: '0', color: '#6c757d' }}>{student.email}</p>
              {student.major && (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#495057' }}>
                  <strong>Major:</strong> {student.major}
                </p>
              )}
            </Link>
          ))
        ) : (
          <p>No students found. Create your first student!</p>
        )}
      </div>

      {/* Back to Home Link */}
      <div style={{ marginTop: '2rem' }}>
        <Link
          to="/home"
          style={{
            color: '#007bff',
            textDecoration: 'none',
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}