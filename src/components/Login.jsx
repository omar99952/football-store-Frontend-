import '../App.css'
import React, { useState } from 'react'; // Add this line
import axios from 'axios'; 
import { useNavigate } from "react-router-dom";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", { username, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token); // Comment this out temporarily
      navigate("/home");
      console.log("Token saved to localStorage, but setToken skipped.");
      // alert("Logged in!"); // Removed alert for a smoother transition
    } catch (err) {
      alert("Login failed - Check your credentials");
    }
  };

  return (
    <div className="auth-container"> {/* This centers it */}
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
           
        />
        <button type="submit">Sign In</button> 
        <a class = 'register-link'href="/register"> No account yet? register please</a>
      </form>
     
    </div>
  );
}