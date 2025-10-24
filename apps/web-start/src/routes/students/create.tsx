import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useApiMutation } from '../../integrations/api';
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
    
    const mutation = useApiMutation<StudentCreateIn, StudentOut>({
    // 3. Define the API endpoint to hit
    endpoint: (variables) => ({
      path: '/students', // Your backend route for creating a student
      method: 'POST',
    }),
    invalidateKeys: [['students', 'list']], // this is how the cache is updating by grabbing the key
  });

   return (
    <div style={{ padding: '2rem' }}>
      <header>
        <h1>Create a New Student</h1>
      </header>
      
      {/* 5. Show loading/error/success messages */}
      {mutation.isPending ? (
        <div>Creating student...</div>
      ) : (
        <>
          {mutation.isError ? (
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
              onChange={(e) => setMajor(e.target.value)}
            />
            <button
              onClick={() => {
                mutation.mutate({
                  email,
                  password,
                  name,
                  lastname,
                  major,
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