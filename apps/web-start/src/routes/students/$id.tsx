// src/routes/students/$id.tsx

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
// 1. ADDED: mutateBackend
import { backendFetcher, mutateBackend } from '../../integrations/fetcher';
// 2. ADDED: useMutation and useQueryClient
import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
// 3. ADDED: StudentUpdateIn
import type { StudentOut, StudentUpdateIn } from '@repo/api';
import { useState } from 'react';

// This is the "recipe" to fetch ONE student's full profile
const studentsQueryOptions = (id: string) => // Changed to id
  queryOptions({
    queryKey: ['students', id], // Changed to id
    queryFn: backendFetcher<StudentOut>(`/students/${id}`), // Changed to id
  });

/*

  Analogy: The Smart Data Pantry
  queryClient = The Pantry: It's the central place where all your data "jars" are stored.
  queryKey = The Label: ['students', 'abc-123'] is the unique label on a jar.
  queryFn = The Recipe: The backendFetcher function is the recipe for how to go to the store
  (your API) and get the ingredients if the jar is empty.
  In your loader code: queryClient.ensureQueryData(studentsQueryOptions(id)) // Changed to id

  You are literally saying: "Hey Pantry (queryClient), I need the jar labeled ['students', 'abc-123'].
  Go check if you have it. If you don't, or if it's old, use this recipe to fill it up right now.
  Don't let my page render until that jar is full."

  */

// 4. Route string uses $id
export const Route = createFileRoute('/students/$id')({
  component: StudentDashboardComponent,
  // Loader uses id
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(studentsQueryOptions(id));
  },
});

// This is your FULL component
function StudentDashboardComponent() {
  // 5. Get 'id' from useParams
  const { id } = Route.useParams();
  const { data: student } = useSuspenseQuery(studentsQueryOptions(id));

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student.name ?? '');
  const [lastname, setLastname] = useState(student.lastname ?? '');
  const [major, setMajor] = useState(student.major ?? '');

  // --- Delete Mutation ---
  const deleteMutation = useMutation({
    mutationFn: () =>
      mutateBackend<{ message: string }>(`/students/${id}`, 'DELETE'),
    onSuccess: () => {
      // Invalidate the master list
      queryClient.invalidateQueries({ queryKey: ['students', 'list'] });
      // Navigate back to the student list
      navigate({ to: '/students' });
    },
  });

  // --- ADDED: Update Mutation ---
  const updateMutation = useMutation({
    mutationFn: (updatedStudentData: StudentUpdateIn) => {
      return mutateBackend<StudentOut>(
        `/students/${id}`,
        'PATCH',
        updatedStudentData,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['students', id] });
      setIsEditing(false); // Exit edit mode on success
    },
  });

  const [activeTab, setActiveTab] = useState('Profile');
  const tabs = ['Profile', 'Courses', 'Submissions', 'Notifications', 'Sign Out'];

  const handleTabClick = (tab: string) => {
    if (tab === 'Sign Out') {
      navigate({ to: '/' });
    } else {
      setActiveTab(tab);
      // If switching tabs, always exit edit mode
      if (isEditing) {
        setIsEditing(false);
        // Reset form fields to original values when cancelling
        setName(student.name ?? '');
        setLastname(student.lastname ?? '');
        setMajor(student.major ?? '');
      }
    }
  };

  // --- Function to handle saving changes ---
  const handleSaveChanges = () => {
    updateMutation.mutate({ name, lastname, major });
  };

  // --- Function to handle cancelling edit ---
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form fields to original values
    setName(student.name ?? '');
    setLastname(student.lastname ?? '');
    setMajor(student.major ?? '');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <div>
            <h2>Student Profile</h2>
            {isEditing ? (
             
              <div
                style={{
                  border: '1px solid #ddd',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  backgroundColor: '#f0f8ff', 
                }}
              >
                <h3>Editing Profile</h3>
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
                  {updateMutation.isError && (
                    <div style={{ color: 'red' }}>
                      Error:{' '}
                      {updateMutation.error instanceof Error
                        ? updateMutation.error.message
                        : 'An unknown error occurred'}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleSaveChanges}
                      disabled={updateMutation.isPending}
                      style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }} // Green for save
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={handleCancelEdit} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              // --- VIEW MODE ---
              <>
                <button
                  onClick={() => setIsEditing(true)} // Enter edit mode
                  style={{
                    marginBottom: '1rem',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: '#3498db',
                    color: 'white',
                    transition: 'background-color 0.2s',
                  }}
                >
                  Edit Profile
                </button>
                <div
                  style={{
                    border: '1px solid #ddd',
                    padding: '1.5rem',
                    borderRadius: '8px',
                  }}
                >
                  <p>
                    <strong>Name:</strong> {student.name} {student.lastname}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p>
                    <strong>Major:</strong> {student.major ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Student ID:</strong> {student.id}
                  </p>
                </div>
              </>
            )}
            {!isEditing && (
              <div
                style={{
                  marginTop: '2rem',
                  border: '1px solid red',
                  padding: '1rem',
                  borderRadius: '8px',
                }}
              >
                <h3>Danger Zone</h3>
                <p>Deleting this student is permanent and cannot be undone.</p>
                <button
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to permanently delete this student?',
                      )
                    ) {
                      deleteMutation.mutate();
                    }
                  }}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete Student'}
                </button>
                {deleteMutation.isError && (
                  <div style={{ color: 'red', marginTop: '0.5rem' }}>
                    Error:{' '}
                    {deleteMutation.error instanceof Error
                      ? deleteMutation.error.message
                      : 'An unknown error occurred'}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'Courses':
        return (
          <div>
            <h2>My Courses</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {student.enrollments.length === 0 ? (
                <p>This student is not enrolled in any courses.</p>
              ) : (
                student.enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    style={{
                      border: '1px solid #ddd',
                      padding: '1rem',
                      borderRadius: '8px',
                    }}
                  >
                    <h3>{enrollment.course.title}</h3>
                    <p>
                      <strong>Code:</strong> {enrollment.course.code}
                    </p>
                    <p>
                      <strong>Enrolled:</strong>{' '}
                      {new Date(
                        enrollment.enrollmentDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'Submissions':
        return (
          <div>
            <h2>My Submissions</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {student.submissions.length === 0 ? (
                <p>This student has no submissions.</p>
              ) : (
                student.submissions.map((submission) => (
                  <div
                    key={submission.id}
                    style={{
                      border: '1px solid #ddd',
                      padding: '1rem',
                      borderRadius: '8px',
                    }}
                  >
                    <h3>Submission ID: {submission.id}</h3>
                    <p>
                      <strong>Status:</strong> {submission.status}
                    </p>
                    <p>
                      <strong>Grade:</strong> {submission.grade ?? 'Not Graded'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'Notifications':
        return (
          <div>
            <h2>Notifications</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div
                style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: '#f0f8ff',
                }}
              >
                <h4>New Assignment Posted</h4>
                <p>Assignment 2 has been posted for Math 101</p>
                <small>2 hours ago</small>
              </div>
              <div
                style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  borderRadius: '8px',
                }}
              >
                <h4>Grade Updated</h4>
                <p>Your grade for Assignment 1 has been updated</p>
                <small>1 day ago</small>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav
        style={{
          backgroundColor: '#2c3e50',
          padding: '1rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ color: 'white', margin: 0, marginBottom: '1rem' }}>
          {student.name} {student.lastname}'s Dashboard
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {tabs.map((tab, tabIndex) => {
            const isActive = activeTab === tab;
            const isSignOut = tab === 'Sign Out';

            return (
              <button
                onClick={() => handleTabClick(tab)}
                key={tabIndex}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: isSignOut
                    ? '#e74c3c'
                    : isActive
                    ? '#3498db'
                    : '#34495e',
                  color: 'white',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  if (!isActive && !isSignOut) {
                    e.currentTarget.style.backgroundColor = '#4a6741';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive && !isSignOut) {
                    e.currentTarget.style.backgroundColor = '#34495e';
                  }
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </nav>

      <Link to="/students" style={{ padding: '1rem', display: 'block' }}>
        &larr; Back to Student List
      </Link>

      <main style={{ padding: '0 2rem 2rem 2rem' }}>
        {renderTabContent()}
      </main>
    </div>
  );
}