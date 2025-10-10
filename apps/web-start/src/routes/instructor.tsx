import { createFileRoute } from '@tanstack/react-router'
import { useState} from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { backendFetcher } from '../integrations/fetcher';

export const Route = createFileRoute('/instructor')({
  component: Instructor,
})

function Instructor() {
const [activeTab, setActiveTab] = useState("Create Assignment");
    const navigate = useNavigate();
    const tabs = ["Create Assignment", "Courses", "Profile", "Sign Out"];
    const courseDescription = ["Introduction to Calculus - Fall 2025", "Multivariable Calculus", "Applied Statistcs"]

    const handleTabClick = (tab: string) => {
        if (tab === "Sign Out") {
            // Navigate back to login page
            navigate({to:'/'});
        } else {
            setActiveTab(tab);
        }
    };
    const { isPending, isError, data, error } = useQuery({
    queryKey: ['instructors'],
    queryFn: backendFetcher('/instructors'),
  });

  if(isPending){
    return <span>Loading...</span>
  }
  if(isError){
    return <span>Error is {error.message}</span>
  }
    
    const renderTabContent = () => {
        switch (activeTab) {
            case "Create Assignment":
                return (
                    <div>
                        <h2>Create New Assignment</h2>
                        <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                                        Assignment Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter assignment title..."
                                        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                                        Course
                                    </label>
                                    <select style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                                        <option>Mathematics 101</option>
                                        <option>Advanced Calculus</option>
                                        <option>Statistics 201</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                                        Due Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                                        Instructions
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="Enter assignment instructions..."
                                        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                                    />
                                </div>
                                <div style={{ display: "flex", gap: "1rem" }}>
                                    <button
                                        type="submit"
                                        style={{ padding: "0.75rem 1.5rem", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                    >
                                        Create Assignment
                                    </button>
                                    <button
                                        type="button"
                                        style={{ padding: "0.75rem 1.5rem", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                    >
                                        Save as Draft
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
            case "Courses":
                return (
                    <div>
                        <h2>My Courses</h2>
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {["Mathematic 101"].map((course, courseIndex) => {
                                return (
                                    <div key = {courseIndex} 
                                        style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px", backgroundColor: "white" }}>
                                        <h3>{course}</h3>
                                        <p>{courseDescription[courseIndex]}</p>
                                        <p><strong>Enrolled Students:</strong> 45</p>
                                        <p><strong>Assignments:</strong> 8</p>
                                        <div style={{ marginTop: "1rem" }}>
                                            <button style={{ padding: "0.5rem 1rem", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", marginRight: "0.5rem" }}>
                                            View Students
                                            </button>
                                            <button style={{ padding: "0.5rem 1rem", backgroundColor: "#ffc107", color: "black", border: "none", borderRadius: "4px" }}>
                                                Manage Course
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
            case "Profile":
                return (
                    <div>
                        <h2>Instructor Profile</h2>
                        <div style={{ border: "1px solid #ddd", padding: "1.5rem", borderRadius: "8px", backgroundColor: "white" }}>
                            <div style={{ display: "grid", gap: "1rem" }}>
                                {JSON.stringify(data)}
                            </div>
                            <button
                                style={{
                                    marginTop: "1rem",
                                    padding: "0.75rem 1rem",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                );
            default:
                return <div>Select a tab to view content</div>;
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            <nav style={{
                backgroundColor: "#8e44ad",
                padding: "1rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h1 style={{ color: "white", margin: 0, marginBottom: "1rem" }}>Instructor Dashboard</h1>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {tabs.map((tab, tabIndex) => {
                        const isActive = activeTab === tab;
                        const isSignOut = tab === "Sign Out";
                        
                        return (
                            <button
                                onClick={() => handleTabClick(tab)}
                                key={tabIndex}
                                style={{
                                    padding: "0.5rem 1rem",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    backgroundColor: isSignOut 
                                        ? "#e74c3c" 
                                        : isActive 
                                            ? "#9b59b6" 
                                            : "#663399",
                                    color: "white",
                                    transition: "background-color 0.2s"
                                }}
                                onMouseOver={(e) => {
                                    if (!isActive && !isSignOut) {
                                        e.currentTarget.style.backgroundColor = "#7d4cdb";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isActive && !isSignOut) {
                                        e.currentTarget.style.backgroundColor = "#663399";
                                    }
                                }}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            </nav>
            
            <main style={{ padding: "2rem" }}>
                {renderTabContent()}
            </main>
        </div>
    );}
