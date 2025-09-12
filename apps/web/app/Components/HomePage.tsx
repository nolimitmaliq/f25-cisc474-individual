"use client";
import { useState } from "react";

export default function HomePage() {
  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // In a real application, you would handle authentication here
    alert(`Logging in as ${role} with email: ${email}`);
  };

  return (
    <main>
      <div>
        <h1>
          LMS Login
        </h1>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div>
            <label>
              User Role
            </label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className=""
            >
              <option>Student</option>
              <option>Instructor</option>
              <option>Admin</option>
            </select>
          </div>
          <div>
            <label>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email...."
              required
            />
          </div>
          <div>
            <label>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password...."
              required
            />
          </div>
          <button
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

