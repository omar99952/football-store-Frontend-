import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import '../App.css';

export default function Register() { // Removed setToken if you want them to log in manually
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", { 
        username, 
        password 
      });
      
      // 3. Redirect to the Login page (which is at path "/")
      // alert("Registration successful! Please login.");
      navigate("/"); 
      
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Username might be taken.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Create Account</h2>
        {error && <p style={{ color: '#ff4d4d' }}>{error}</p>}
        
        <input 
          type="text" 
          placeholder="Username" 
          required
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          required
          onChange={(e) => setPassword(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Confirm Password" 
          required
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        
        <button type="submit">Register</button>
        <a className='register-link' href="/"> Already have an account? Login</a>
      </form> 
    </div>
  );
}