import '../App.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", { username, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/home");
    } catch (err) {
      setError("Login failed — check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>
        {error && <p style={{ color: '#ff4d4d' }}>{error}</p>}
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
        {/* Fixed: className instead of class */}
        <a className="register-link" href="/register">No account yet? Register</a>
      </form>
    </div>
  );
}