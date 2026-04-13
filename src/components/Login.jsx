import '../App.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
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

 const handleSuccess = async (credentialResponse) => {
    // This 'credential' is the long JWT (ID Token) Django is looking for
    const idToken = credentialResponse.credential; 
    console.log("ID Token:", idToken); 

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/google-login/", {
        token: idToken,
      });

      // Save your Django token and redirect
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      window.location.href = "/profile"; 
    } catch (error) {
      console.error("Backend login failed", error);
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