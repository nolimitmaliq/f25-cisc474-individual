import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useApiMutation } from '../../integrations/api'; 
import type { StudentUpdateIn, StudentOut } from '@repo/api';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { backendFetcher } from '../../integrations/fetcher';

// 1. This is the "recipe" to fetch ONE student's full profile
const studentsQueryOptions = (studentId: string) =>
  queryOptions({
    queryKey: ['students', studentId],
    queryFn: backendFetcher<StudentOut>(`/students/${studentId}`),
  });


export const Route = createFileRoute('/students/$studentId/update')({
  component: UpdateStudentComponent,
  // 3. Add the loader to pre-fetch the student's data
  loader: ({ context: { queryClient }, params: { studentId } }) => {
    return queryClient.ensureQueryData(studentsQueryOptions(studentId));
  },
});

function UpdateStudentComponent() {
    /*
    const studentId = Route.useParams().studentId; This line's job is to read the URL and 
    get the specific student's ID from it. When you visit /students/abc-123/update, 
    this code reaches into the Route definition, calls the useParams() hook, 
    and pulls out the studentId variable, which would be "abc-123".
    */
  const studentId = Route.useParams().studentId;
  const { data: student } = useSuspenseQuery(studentsQueryOptions(studentId));

  const [name, setName] = useState(student.name ?? '');
  const [lastname, setLastname] = useState(student.lastname ?? '');
  const [major, setMajor] = useState(student.major ?? '');

  const navigate = useNavigate();
  const mutation = useApiMutation<StudentUpdateIn, StudentOut>({
    endpoint: (variables) => ({
      path: `/students/${studentId}`,
      method: 'PATCH',
    }),
    invalidateKeys: [
      ['students', 'list'], // Invalidate the master list
      ['students', studentId], // Invalidate this student's profile
    ]
  });

  return (
    <div style={{ padding: '2rem' }}>
      <header>
        <h1>Update Student: {student.name} {student.lastname}</h1>
      </header>
      
      {mutation.isPending ? (
        <div>Updating student...</div>
      ) : (
        <>
          {mutation.isError ? (
            <div>Error updating student: {mutation.error.message}</div>
          ) : null}
          
          <hr />
          
          {/* 10. Create the form inputs, pre-filled with state */}
          <div style={{ display: 'grid', gap: '1rem', maxWidth: '300px' }}>
            <label>First Name:</label>
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Last Name:</label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <label>Major:</label>
            <input
              type="text"
              placeholder="Major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
            <button
              onClick={() => {
                mutation.mutate(
                  { name, lastname, major},
                  { // 3. Pass onSuccess as the second argument
                    onSuccess: () => {
                      navigate({ to: '/students/$studentId', params: { studentId } });
                    }
                  }
                );
              }}
            >
              Save Changes
            </button>
          </div>
          
          <hr />
          
          <Link to="/students/$studentId" params={{ studentId }}>
            Cancel (Back to Profile)
          </Link>
        </>
      )}
    </div>
  );
}