// src/routes/students/index.tsx

import { Link, createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { backendFetcher } from '../../integrations/fetcher';
import type { StudentRef } from '@repo/api';

// 1. This query fetches ALL students for the list
// Note: Your backend should send an array of StudentRef, not StudentOut
const studentsListQueryOptions = queryOptions({
  queryKey: ['students', 'list'], // A key for the whole list
  queryFn: backendFetcher<Array<StudentRef>>('/students'), // Fetch ALL students
});

export const Route = createFileRoute('/students/')({
  component: StudentListPage,
  // 2. The loader pre-fetches the LIST
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(studentsListQueryOptions),
});

function StudentListPage() {
  // 3. Get the list of students from the cache
  const { data: students } = useSuspenseQuery(studentsListQueryOptions);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Student Roster</h1>
      <p>Select a student to view their dashboard.</p>
      
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
        {students.map((student) => (
          
          // 5. THIS IS THE CONNECTION!
          // This Link connects this page to your $studentId.tsx file
          <Link
            key={student.id}
            to="/students/$studentId"
            params={{ studentId: student.id }} // Pass the student's ID
            style={{
              display: 'block',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'black',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>{student.name} {student.lastname}</h3>
            <p>{student.email}</p>
          </Link>

        ))}
      </div>
    </div>
  );
}