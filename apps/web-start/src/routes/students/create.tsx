import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useApiMutation } from '../../integrations/api';
import { StudentCreateIn, StudentOut } from '@repo/api';

export const Route = createFileRoute('/students/create')({
  component: RouteComponent,
});

function RouteComponent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    lastname: '',
    major: '',  // Always a string, never undefined
  });
  
  const navigate = useNavigate();
  
  const mutation = useApiMutation<StudentCreateIn, StudentOut>({
    endpoint: () => ({
      path: '/students', 
      method: 'POST',
    }),
    invalidateKeys: [['students', 'list']],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.name || !formData.lastname) {
      alert('Please fill in all required fields (Email, First Name, Last Name)');
      return;
    }

    // Create the data object matching StudentCreateIn exactly
    const studentData: StudentCreateIn = {
      email: formData.email.trim(),
      name: formData.name.trim(),
      lastname: formData.lastname.trim(),
      major: formData.major.trim(), // Always send as string (can be empty string)
    };

    console.log('📤 Submitting student data:', studentData);
    mutation.mutate(studentData);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <header>
        <h1>Create a New Student</h1>
        <p style={{ color: '#6c757d' }}>All fields marked with * are required</p>
      </header>
      
      {mutation.isPending ? (
        <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
          <p>⏳ Creating student...</p>
        </div>
      ) : (
        <>
          {mutation.isError ? (
            <div style={{ 
              color: 'red', 
              marginBottom: '1rem', 
              padding: '1rem', 
              border: '2px solid red', 
              borderRadius: '4px',
              backgroundColor: '#fff5f5'
            }}>
              <strong>❌ Error creating student</strong>
              <p style={{ marginTop: '0.5rem' }}>{mutation.error.message}</p>
              <details style={{ marginTop: '0.5rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  Show technical details
                </summary>
                <pre style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.85rem', 
                  overflow: 'auto',
                  backgroundColor: '#f5f5f5',
                  padding: '0.5rem',
                  borderRadius: '4px'
                }}>
                  {JSON.stringify(mutation.error, null, 2)}
                </pre>
              </details>
            </div>
          ) : null}
          
          {mutation.isSuccess ? (
            <div style={{ 
              color: 'green', 
              marginBottom: '1rem', 
              padding: '1rem', 
              border: '2px solid green', 
              borderRadius: '4px',
              backgroundColor: '#f0fff4'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>✅ Student Created Successfully!</h3>
              <p><strong>ID:</strong> {mutation.data.id}</p>
              <p><strong>Name:</strong> {mutation.data.name} {mutation.data.lastname}</p>
              <p><strong>Email:</strong> {mutation.data.email}</p>
              {mutation.data.major && <p><strong>Major:</strong> {mutation.data.major}</p>}
              <button
                onClick={() => navigate({ to: '/students' })}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  fontWeight: 'bold',
                }}
              >
                Go to Student List
              </button>
            </div>
          ) : null}
          
          <hr />
          
          <form 
            onSubmit={handleSubmit}
            style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}
          >
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                Email <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
                required
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                First Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="John"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
                required
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                Last Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Doe"
                value={formData.lastname}
                onChange={(e) => handleChange('lastname', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
                required
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                Major (Optional)
              </label>
              <input
                type="text"
                placeholder="Computer Science"
                value={formData.major}
                onChange={(e) => handleChange('major', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
              <small style={{ color: '#6c757d', display: 'block', marginTop: '0.25rem' }}>
                Leave empty if not applicable
              </small>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              style={{
                padding: '1rem 2rem',
                backgroundColor: mutation.isPending ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'background-color 0.2s',
              }}
            >
              {mutation.isPending ? '⏳ Creating...' : '✨ Create Student'}
            </button>
          </form>
          
          <hr style={{ marginTop: '2rem' }} />
          
          <Link 
            to="/students"
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            ← Back to Student List
          </Link>
        </>
      )}
    </div>
  );
}