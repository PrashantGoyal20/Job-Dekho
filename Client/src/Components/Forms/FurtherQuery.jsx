import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../Permanent/Header'
import {Phone,Star,MapPin,ArrowRight} from 'lucide-react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { Context } from '../../main'
import toast from 'react-hot-toast'
import axios from 'axios'

const FurtherQuery = () => {
    const { isAuthorized, setIsAuthorized } =useContext(Context)
    const navigate=useNavigate()
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [phone,setPhone]=useState()
    const [city,setCity]=useState('')
    const [role,setRole]=useState('')
    const googleRef=useRef(null)
    const error=useRef(null)
    const location=useLocation()

    useEffect(()=>{
        const query=new URLSearchParams(location.search)
      const googleError=query.get('error')
    if(googleError=='error-in-registeration'){
      googleRef.current.classList.replace('registeration-error-hidden','registeration-error')
      setTimeout(()=>{
      googleRef.current.classList.replace('registeration-error','registeration-error-hidden')},10000)
    }
    setName(query.get('name'))
    setEmail(query.get('email'))
    setPassword(query.get('id').toString())

    },[])


    const handleSubmit=async(e)=>{
         e.preventDefault();
    try {
        console.log(name,password,email,phone,role,city)
      if( !name || !email || !phone || !password || !role || !city ){
      error.current.classList.replace("error-hidden","error-visible");
      return
      }
      const { data } = await axios.post("http://localhost:3000/user/googleAuth",
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
        googleRef.current.text=error.response.data.message
        googleRef.current.classList.replace('registeration-error-hidden','registeration-error')
      setTimeout(()=>{
      googleRef.current.classList.replace('registeration-error','registeration-error-hidden')},10000)
      console.log(error)
      toast.error(error.response.data.message)
    }
    }
  return (
    <div className="form-container">
         <Header/>
         <span ref={googleRef} className='registeration-error-hidden'>Error in Registeration</span>
          <div className="form-card">
            <div className="form-header">
              <div className="logo">
                
                  <img className='login-logo' src='./JOb_DEKHO_-white_without_heading-removebg-preview.png'/>
                <h1>Job Dekho</h1>
              </div>
              <h2>Create Account</h2>
              <p>Please Enter these Further Details</p>
            </div>
    
            <div className="auth-form">
                
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
                    <option className="option" selected>Select Your Current Status</option>
                    <option value="Job Seeker" className="option">Job Seeker</option>
                   <option value="Job Manager" className="option">Job Manager</option>
                 </select>
                </div>
              </div>
    
    
              <button onClick={handleSubmit} className="submit-btn signup">
                <span>Create Account</span>
                <ArrowRight className="btn-icon" />
    
              </button>
              <div className='error-hidden' ref={error}>
              Please check all your credentials..!! 
              </div>
            </div>
    
            
          </div>
        </div>
  )
}

export default FurtherQuery