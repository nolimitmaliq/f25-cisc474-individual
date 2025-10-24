import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useApiQuery, useApiMutation } from '../../integrations/api';
import type { StudentOut, StudentUpdateIn } from '@repo/api';
import { useState } from 'react';

export const Route = createFileRoute('/students/$id')({
  component: StudentDashboardComponent,
});

function StudentDashboardComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  // FIXED: Removed /api prefix to match backend
  const { data: student, isLoading, isError, error } = useApiQuery<StudentOut>(
    ['students', id],
    `/students/${id}`  // ✅ Matches backend @Get(':id')
  );

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [major, setMajor] = useState('');

  // Update form fields when student data loads
  useState(() => {
    if (student) {
      setName(student.name ?? '');
      setLastname(student.lastname ?? '');
      setMajor(student.major ?? '');
    }
  });

  // FIXED: Removed /api prefix
  const updateMutation = useApiMutation<StudentUpdateIn, StudentOut>({
    endpoint: () => ({
      path: `/students/${id}`,  // ✅ Matches backend @Patch(':id')
      method: 'PATCH',
    }),
    invalidateKeys: [['students', 'list'], ['students', id]],
  });

  // FIXED: Removed /api prefix
  const deleteMutation = useApiMutation<Record<string, never>, { message: string }>({
    endpoint: () => ({
      path: `/students/${id}`,  // ✅ Matches backend @Delete(':id')
      method: 'DELETE',
    }),
    invalidateKeys: [['students', 'list']],
  });

  const [activeTab, setActiveTab] = useState('Profile');
  const tabs = ['Profile', 'Courses', 'Submissions', 'Notifications', 'Sign Out'];

  const handleTabClick = (tab: string) => {
    if (tab === 'Sign Out') {
      navigate({ to: '/' });
    } else {
      setActiveTab(tab);
      if (isEditing) {
        setIsEditing(false);
        if (student) {
          setName(student.name ?? '');
          setLastname(student.lastname ?? '');
          setMajor(student.major ?? '');
        }
      }
    }
  };

  const handleSaveChanges = () => {
    updateMutation.mutate(
      { name, lastname, major },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (student) {
      setName(student.name ?? '');
      setLastname(student.lastname ?? '');
      setMajor(student.major ?? '');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this student?')) {
      deleteMutation.mutate(
        {},
        {
          onSuccess: () => {
            navigate({ to: '/students' });
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Loading student profile...</h1>
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Error Loading Student</h1>
        <p style={{ color: 'red' }}>
          {error instanceof Error ? error.message : 'Student not found'}
        </p>
        <Link to="/students" style={{ color: '#007bff' }}>
          ← Back to Student List
        </Link>
      </div>
    );
  }

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
                      Error: {updateMutation.error?.message || 'An unknown error occurred'}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleSaveChanges}
                      disabled={updateMutation.isPending}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: updateMutation.isPending ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
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
                    cursor: deleteMutation.isPending ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete Student'}
                </button>
                {deleteMutation.isError && (
                  <div style={{ color: 'red', marginTop: '0.5rem' }}>
                    Error: {deleteMutation.error?.message || 'An unknown error occurred'}
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
                      {new Date(enrollment.enrollmentDate).toLocaleDateString()}
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
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            const isSignOut = tab === 'Sign Out';

            return (
              <button
                onClick={() => handleTabClick(tab)}
                key={tab}
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

      <main style={{ padding: '0 2rem 2rem 2rem' }}>{renderTabContent()}</main>
    </div>
  );
}