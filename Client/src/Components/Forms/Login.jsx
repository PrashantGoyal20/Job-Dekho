import React, { useState, useContext, useRef } from 'react'
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Star, Sparkles } from 'lucide-react';
import "./login.css"
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from 'react-router-dom';
import Header from '../Permanent/Header';



const Login = () => {

  const google=import.meta.env.VITE_APP_GOOGLE
  const server=import.meta.env.VITE_APP_SERVER
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("")
  const [showPassword,setShowPassword]=useState(false)
  const navigate = useNavigate();
  const error = useRef(null)
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password || !role) {
        error.current.classList.replace("error-hidden", "error-visible");
        return
      }
      const { data } = await axios.post(`${server}/user/login`,
        { email, password, role }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }

      );
      console.log(data);
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
      setUser(data.user);
      navigate('/')
      console.log(data.message);

    } catch (error) {
      toast.error(error.response.data.message)
      error.current.classList.replace("error-hidden", "error-visible")
    }
  }


  return (
    

    <div className="form-container">
    <Header/>
      <div className="form-card">
        <div className="form-header">
          <div className="logo">
              <img className='login-logo' src='https://res.cloudinary.com/dc728fl24/image/upload/v1753727764/JOb_DEKHO_-white_without_heading-removebg-preview_i4cn6x.png'/>

            
            <h1>Job Dekho</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your account</p>
        </div>

        <div className="auth-form">
          <div className="input-group">
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Email address"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Password"
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

            <div className="input-group">
            <div className="input-wrapper">
              <Star className="input-icon" />
              <select className='form-input' value={role} onChange={(e) => setRole(e.target.value)}>
                <option className="option"  selected>Select Your Current Status</option>
                <option value="Job Seeker" className="option">Job Seeker</option>
               <option value="Job Manager" className="option">Job Manager</option>
             </select>
            </div>
          </div>
          

       

          <button onClick={handleSubmit} className="submit-btn">
            <span>Sign In</span>
            <ArrowRight className="btn-icon" />
          </button>

          <span className='error-hidden' ref={error}>Please check all your credentials..!! </span>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <a href={google} className="social-btn">
              <span className="social-icon google">G</span>
              Google
            </a>
            
          </div>
        </div>

        <div className="form-footer">
          <p>Don't have an account? 
            <button 
              onClick={() => navigate('/register')}
              className="switch-btn"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login