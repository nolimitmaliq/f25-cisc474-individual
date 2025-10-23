// src/routes/students/$studentId.tsx

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
// 1. ADDED: mutateBackend (assuming it's in your fetcher file)
import { backendFetcher, mutateBackend } from '../../integrations/fetcher';
// 2. ADDED: useMutation and useQueryClient
import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import type { StudentOut } from '@repo/api';
import { useState } from 'react';
// 3. REMOVED: useApiMutation
// import { useApiMutation } from '../../integrations/api';

// 1. This is the "recipe" to fetch ONE student's full profile
const studentsQueryOptions = (studentId: string) =>
  queryOptions({
    queryKey: ['students', studentId],
    queryFn: backendFetcher<StudentOut>(`/students/${studentId}`),
  });

/*

  Analogy: The Smart Data Pantry
  queryClient = The Pantry: It's the central place where all your data "jars" are stored.
  queryKey = The Label: ['students', 'abc-123'] is the unique label on a jar.
  queryFn = The Recipe: The backendFetcher function is the recipe for how to go to the store 
  (your API) and get the ingredients if the jar is empty.
  In your loader code: queryClient.ensureQueryData(studentsQueryOptions(studentId))

  You are literally saying: "Hey Pantry (queryClient), I need the jar labeled ['students', 'abc-123']. 
  Go check if you have it. If you don't, or if it's old, use this recipe to fill it up right now. 
  Don't let my page render until that jar is full."

  */

// 4. CRITICAL FIX: The route string MUST match your filename
export const Route = createFileRoute('/students/$studentId')({
  component: StudentDashboardComponent,
  loader: ({ context: { queryClient }, params: { studentId } }) => {
    return queryClient.ensureQueryData(studentsQueryOptions(studentId));
  },
});

// 3. This is your FULL component
function StudentDashboardComponent() {
  // 5. CRITICAL FIX: Get 'studentId' with capital 'I'
  const { studentId } = Route.useParams();
  const { data: student } = useSuspenseQuery(studentsQueryOptions(studentId));

  // 6. ADDED: Get the queryClient for cache invalidation
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 7. REPLACED: This now uses the standard useMutation
  const deleteMutation = useMutation({
    mutationFn: () =>
      mutateBackend<{ message: string }>(`/students/${studentId}`, 'DELETE'),
    onSuccess: () => {
      // Invalidate the master list
      queryClient.invalidateQueries({ queryKey: ['students', 'list'] });
      // Navigate back to the student list
      navigate({ to: '/students' });
    },
  });

  const [activeTab, setActiveTab] = useState('Profile');
  const tabs = ['Profile', 'Courses', 'Submissions', 'Notifications', 'Sign Out'];

  const handleTabClick = (tab: string) => {
    if (tab === 'Sign Out') {
      navigate({ to: '/' });
    } else {
      setActiveTab(tab);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <div>
            <h2>Student Profile</h2>
            {/* ... profile div ... */}
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
            {/* ... danger zone div ... */}
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
                    // 8. FIXED: onSuccess is now defined in the hook,
                    // so mutate() only takes one argument.
                    deleteMutation.mutate();
                  }
                }}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Student'}
              </button>
              {deleteMutation.isError && (
                <div style={{ color: 'red', marginTop: '0.5rem' }}>
                  {/* 9. FIXED: Check if error is an 'Error' instance */}
                  Error:{' '}
                  {deleteMutation.error instanceof Error
                    ? deleteMutation.error.message
                    : 'An unknown error occurred'}
                </div>
              )}
            </div>
          </div>
        );
      // ... (other cases are all correct) ...
      case 'Courses':
        return (
          <div>
            <h2>My Courses</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {/*
                FIX: Use student.enrollments instead of a hard-coded array
              */}
              {student.enrollments.length === 0 ? (
                <p>This student is not enrolled in any courses.</p>
              ) : (
                student.enrollments.map((enrollment) => {
                  return (
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
                  );
                })
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
                student.submissions.map((submission) => {
                  return (
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
                  );
                })
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

  // ... (Your main return/JSX is all correct) ...
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