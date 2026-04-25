import  { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import '../App.css';
import AxiosInstance from './AxiosInstance';
import {baseURL} from './AxiosInstance'
import axios from "axios";

export default function Register({setToken}) { // Removed setToken if you want them to log in manually
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
      
      console.log('1.before request');
      
      const response=await axios.post("http://127.0.0.1:8000/api/register/", { 
        username, 
        password 
      });
      
      console.log("2.Registration Success:", response.data);

      // 2. Extract the JWT tokens (matching your backend response)
      const { access, refresh } = response.data;

      // 3. Save to localStorage so the App.jsx bouncer sees them
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // 4. Update the state in App.jsx (if you passed setToken as a prop)
     
          setToken(access);
      
      console.log("3.before Navigate");
      
      // 5. Navigate straight to Home
      navigate("/home"); 
      console.log("4.after Navigate");
      
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