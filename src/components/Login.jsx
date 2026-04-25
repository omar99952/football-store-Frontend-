import '../App.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import AxiosInstance from './AxiosInstance';

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    console.log("1. Starting Login Process...");
    try {
      const res = await AxiosInstance.post("token/", { username, password });
      console.log("after post token/");
      
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      // setToken(response.data.access);
      console.log("Access Token Saved:", res.data.access);
      console.log("6. Final Step: Attempting navigation to /home");
      setToken(res.data.access); 
      navigate("/home");
      console.log("7. Navigation command sent!");
    } catch (err) {
      setError("Login failed — check your credentials.");
    }
  };

 const handleSuccess = async (credentialResponse) => {
    try {
        const res = await AxiosInstance.post('google-login/', {
            token: credentialResponse.credential,
        });

        // Store identity first
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("username", res.data.username); // Needed for isolated storage keys

        // Trigger App.js re-render
        setToken(res.data.access); 
        
        navigate("/home"); 
    } catch (error) {
        console.error("Google sync failed", error);
    }
};

  const dividerStyle = {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    margin: '20px 0',
    color: '#888',
  };

  const lineStyle = {
    content: '""',
    flex: 1,
    borderBottom: '1px solid #444',
  };

  const googleContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '10px'
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button type="submit">Sign In</button>

        {/* --- OR Divider --- */}
        <div style={dividerStyle}>
          <div style={lineStyle}></div>
          <span style={{ margin: '0 10px' }}>OR</span>
          <div style={lineStyle}></div>
        </div>

        {/* --- Google Button Container --- */}
        <div style={googleContainerStyle}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log('Login Failed')}
            width="250px" // Forces the Google iframe to a specific width
          />
        </div>

        <a className="register-link" href="/register">No account yet? Register</a>
      </form>
    </div>
  );
}