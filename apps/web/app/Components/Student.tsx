"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Student() {
    const [activeTab, setActiveTab] = useState("Courses");
    const router = useRouter();
    const tabs = ["Courses", "Submissions", "Notifications", "Profile", "Sign Out"];
    const courseDescription = 
    ["Introduction to Calculus - Fall 2025", "Multivariable Calculus", "Applied Statistcs"]


    const handleTabClick = (tab: string) => {
        if (tab === "Sign Out") {
            // Navigate back to login page
            router.push("/");
        } else {
            setActiveTab(tab);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "Courses":
                return (
                    <div>
                        <h2>My Courses</h2>
                        <div style={{ display: "grid", gap: "1rem" }}>
                              {["Mathematics 101"].map((course, courseIndex) => {
                                return (
                                    <div key = {courseIndex} style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}>
                                        <h3>{course}</h3>
                                        <p>{courseDescription[courseIndex]}</p>
                                        <p><strong>Instructor:</strong> Dr. Smith</p>
                                        <p><strong>Progress:</strong> 75%</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
            case "Submissions":
                return (
                    <div>
                        <h2>My Submissions</h2>
                        <div style={{ display: "grid", gap: "1rem" }}>
                             {["Assignment"].map((assignment, assignmentIndex) => {
                                return (
                                    <div key = {assignmentIndex}  style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}>
                                    <h3>{assignment}</h3>
                                    <p><strong>Status:</strong> Submitted</p>
                                    <p><strong>Grade:</strong> 85/100</p>
                                    <p><strong>Due Date:</strong> 2025-09-10</p>
                                    </div>
                                )
                             })}
                        </div>
                    </div>
                );
            case "Notifications":
                return (
                    <div>
                        <h2>Notifications</h2>
                        <div style={{ display: "grid", gap: "1rem" }}>
                            <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px", backgroundColor: "#f0f8ff" }}>
                                <h4>New Assignment Posted</h4>
                                <p>Assignment 2 has been posted for Math 101</p>
                                <small>2 hours ago</small>
                            </div>
                            <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}>
                                <h4>Grade Updated</h4>
                                <p>Your grade for Assignment 1 has been updated</p>
                                <small>1 day ago</small>
                            </div>
                        </div>
                    </div>
                );
            case "Profile":
                return (
                    <div>
                        <h2>Student Profile</h2>
                        <div style={{ border: "1px solid #ddd", padding: "1.5rem", borderRadius: "8px" }}>
                            <p><strong>Name:</strong> John Doe</p>
                            <p><strong>Student ID:</strong> STU001</p>
                            <p><strong>Email:</strong> john.doe@university.edu</p>
                            <p><strong>Major:</strong> Computer Science</p>
                            <p><strong>Year:</strong> Sophomore</p>
                            <p><strong>GPA:</strong> 3.75</p>
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
                backgroundColor: "#2c3e50",
                padding: "1rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h1 style={{ color: "white", margin: 0, marginBottom: "1rem" }}>Student Dashboard</h1>
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
                                            ? "#3498db" 
                                            : "#34495e",
                                    color: "white",
                                    transition: "background-color 0.2s"
                                }}
                                onMouseOver={(e) => {
                                    if (!isActive && !isSignOut) {
                                        e.currentTarget.style.backgroundColor = "#4a6741";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isActive && !isSignOut) {
                                        e.currentTarget.style.backgroundColor = "#34495e";
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
    );
}