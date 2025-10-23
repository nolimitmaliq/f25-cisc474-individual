import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
// 1. REMOVED: useApiMutation
// 2. ADDED: useMutation and useQueryClient
import { useMutation, useQueryClient } from '@tanstack/react-query';
// 3. ADDED: The mutateBackend function from your professor's example
// (Assuming this is in your 'integrations' folder)
import { mutateBackend } from '../../integrations/fetcher';
import { StudentCreateIn, StudentOut } from '@repo/api';


export const Route = createFileRoute('/students/create')({
 component: RouteComponent,
});

function RouteComponent(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [major, setMajor] = useState('');
    // 4. ADDED: You need to get the queryClient to invalidate the cache
    const queryClient = useQueryClient();

    // 5. REPLACED: This now uses the standard useMutation
const mutation = useMutation({
      // This is the function that will run when you call mutate()
      mutationFn: (newStudent: StudentCreateIn) => {
        return mutateBackend<StudentOut>('/students', 'POST', newStudent);
      },
      // This runs after the mutation is successful
      onSuccess: () => {
        // this is how the cache is updating by grabbing the key
        queryClient.invalidateQueries({ queryKey: ['students', 'list'] });
      },
    });

  return (
  <div style={{ padding: '2rem' }}>
  <header>
  <h1>Create a New Student</h1>
  </header>
  {mutation.isPending ? (
  <div>Creating student...</div>
  ) : (
   <>
  {mutation.isError ? (
            // This error check works, but you'll need to update it
            // if the 'unknown' error appears again
 <div>Error creating student: {mutation.error.message}</div>
 ) : null}
  {mutation.isSuccess ? (
 <div>Student created successfully! ID: {mutation.data.id}</div>
          ) : null}
          
          <hr />
          
          {/* 6. Create the form inputs */}
          <div style={{ display: 'grid', gap: '1rem', maxWidth: '300px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Temporary Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}/>
            <button
              onClick={() => {
                mutation.mutate({
                  email,
                  password,
                  name,
                  lastname,
                });
              }}
            >
              Create Student
            </button>
          </div>
          
          <hr />
          
          <Link to="/students">Back to Student List</Link>
        </>
      )}
    </div>
  );
}