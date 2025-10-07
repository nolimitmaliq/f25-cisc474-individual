import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const switchRole = () => {
    role === "Student" ? navigate({to: '/student'}) :
    role === "Instructor" ? navigate({to: '/instructor'}) :
    role === "Admin" ?navigate({to: '/admin'}) :
    alert("Invalid role selected");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    switchRole();
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <div>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
          LMS Login
        </h1>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="role-select" style={{ display: "block", marginBottom: "0.5rem" }}>
              User Role
            </label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              required
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              required
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          
          <button
            type="submit"
            style={{ 
              padding: "0.75rem", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Login
          </button>
        </form>

      </div>
    </main>
  );
}
