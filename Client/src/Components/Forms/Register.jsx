import React, { useContext, useRef, useState } from 'react'
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Star, Sparkles,Phone,MapPin } from 'lucide-react';
import "./register.css"
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../Permanent/Header';
import { useEffect } from 'react';

const Register = () => {


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword,setShowPassword]=useState(false)
  const [phone, setPhone] = useState();
  const [role, setRole] = useState("")
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const error_credentail=useRef(null)
  const error=useRef(null)
  const location=useLocation()
  
  
  const googleRef=useRef(null)
  const { isAuthorized, setIsAuthorized } = useContext(Context);

  useEffect(()=>{
    const query=new URLSearchParams(location.search)
      const googleError=query.get('error')
    if(googleError=='error-in-registeration'){
      googleRef.current.classList.replace('registeration-error-hidden','registeration-error')
      setTimeout(()=>{
      googleRef.current.classList.replace('registeration-error','registeration-error-hidden')},10000)
    }
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if( !phone || !role || !city ){
      error.current.classList.replace("error-hidden","error-visible");
      return
      }
      const { data } = await axios.post("http://localhost:3000/user/register",
        { name, email, phone, password, role, city }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }

      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setCity("");
      setPhone();
      setRole("");
      setIsAuthorized(true);
      navigate('/')
    } catch (error) {
      error.current.classList.replace("error-hidden","error-visible")
    }
  }



  return (
     <div className="form-container">
     <Header/>
     <span ref={googleRef} className='registeration-error-hidden'>Error in Registeration</span>
      <div className="form-card">
        <div className="form-header">
          <div className="logo">
            
              <img className='login-logo' src='https://res.cloudinary.com/dc728fl24/image/upload/v1753727764/JOb_DEKHO_-white_without_heading-removebg-preview_i4cn6x.png'/>
            <h1>Job Dekho</h1>
          </div>
          <h2>Create Account</h2>
          <p>Start your journey with us today</p>
        </div>

        <div className="auth-form">
            <div className="input-group">
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  name="firstName"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  placeholder="First name"
                  className="form-input"
                  required
                />
              </div>
            </div>

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
              <Phone className="input-icon" />
              <input
                type="number"
                name="phone"
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                placeholder="Phone-number"
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <div className="input-wrapper">
              <MapPin className="input-icon" />
              <input
                type="text"
                name="city"
                value={city}
                onChange={(e)=>setCity(e.target.value)}
                placeholder="City You Belong To"
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <div className="input-wrapper">
              <Star className="input-icon" />
              <select className='form-input' value={role} onChange={(e) => setRole(e.target.value)}>
                <option className="option" disabled selected>Select Your Current Status</option>
                <option value="Job Seeker" className="option">Job Seeker</option>
               <option value="Job Manager" className="option">Job Manager</option>
             </select>
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



          <button onClick={handleSubmit} className="submit-btn signup">
            <span>Create Account</span>
            <ArrowRight className="btn-icon" />

          </button>
          <div className='error-hidden' ref={error}>
          Please check all your credentials..!! 
          </div>


          <div className="divider">
            <span>or sign up with</span>
          </div>

          <div className="social-buttons">
            <a href='http://localhost:3000/user/google' className="social-btn" >
              <span className="social-icon google">G</span>
              Google
            </a>
          </div>
        </div>

        <div className="form-footer">
          <p>Already have an account? 
            <button 
              onClick={(e)=>navigate('/login')}
              className="switch-btn"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register