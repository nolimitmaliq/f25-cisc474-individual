"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Admin() {
    const [activeTab, setActiveTab] = useState("Search Students");
    const router = useRouter();
    
    const tabs = ["Search Students", "Settings", "Usage Reports", "Profile", "Sign Out"];
    
    const handleTabClick = (tab: string) => {
        console.log(`${tab} clicked`);
        
        if (tab === "Sign Out") {
            // Handle sign out - redirect to homepage
            router.push("/");
        } else {
            // Set active tab for other options
            setActiveTab(tab);
        }
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case "Search Students":
                return (
                    <div style={{ padding: "2rem" }}>
                        <h2>Search Students</h2>
                        <input 
                            type="text" 
                            placeholder="Search for students..." 
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginBottom: "1rem",
                                border: "1px solid #ccc",
                                borderRadius: "4px"
                            }}
                        />
                        <div>
                            <p>Student search results will appear here...</p>
                        </div>
                    </div>
                );
            case "Settings":
                return (
                    <div style={{ padding: "2rem" }}>
                        <h2>System Settings</h2>
                        <p>Admin settings and configurations...</p>
                    </div>
                );
            case "Usage Reports":
                return (
                    <div style={{ padding: "2rem" }}>
                        <h2>Usage Reports</h2>
                        <p>System usage analytics and reports...</p>
                    </div>
                );
            case "Profile":
                return (
                    <div style={{ padding: "2rem" }}>
                        <h2>Admin Profile</h2>
                        <p>Manage your admin profile...</p>
                    </div>
                );
            default:
                return (
                    <div style={{ padding: "2rem" }}>
                        <h2>Welcome Admin</h2>
                        <p>Select a tab to get started.</p>
                    </div>
                );
        }
    };

    return (
        <div style={{ 
            minHeight: "100vh", 
            backgroundColor: "#f5f5f5",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
            <nav style={{
            
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)", 
                padding: "1rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                borderBottom: "1px solid #e2e8f0"
            }}>
                <h1 style={{ color: "black", margin: 0, marginBottom: "1rem" }}>Admin Dashboard</h1>
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
                                    backgroundColor: isActive ? "#3b82f6" : "transparent",
                                    color: isActive ? "#1e293b" : "#64748b",
                                    transition: "background-color 0.2s"
                                }}
                                onMouseOver={(e) => {
                                    if (!isActive && !isSignOut) {
                                        e.currentTarget.style.backgroundColor = "#e2e8f0";
                                        e.currentTarget.style.color = "#1e293b";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isActive && !isSignOut) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                        e.currentTarget.style.color = "#64748b";
                                    }
                                }}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            </nav>
            <main>
                {renderTabContent()}
            </main>
        </div>
    );
}