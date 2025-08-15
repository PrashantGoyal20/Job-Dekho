import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./header.css"
import { Context } from '../../main.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRef } from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import Person2Icon from '@mui/icons-material/Person2';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const Header = () => {

  const server=import.meta.env.VITE_APP_SERVER
  const { isAuthorized, setIsAuthorized, user ,setUser} = useContext(Context);
  const navigateTo = useNavigate();
  const navRef = useRef()

  const navigatePostJobs=()=>{
    navigateTo('/postJobs')
  }

  const handleLogout = async () => {
    try {
      await axios.get(
        `${server}/user/logout`
        , { withCredentials: true }
      ).then((response)=>{;
      toast.success(response.data.message);
      setIsAuthorized(false);
      setUser({})
      navigateTo("/login");})
    } catch (error) {
      toast.error(error.response.data.message), setIsAuthorized(true);
    }
  };


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header class="glass-header">
        <nav class="nav-container">
            <div class="logo-section">
                <div class="logo-icon">
                    <Link to='/'><img className='logo-sphere' src='https://res.cloudinary.com/dc728fl24/image/upload/v1753727764/JOb_DEKHO_-white_without_heading-removebg-preview_i4cn6x.png'/></Link>
                </div>
                <h1 class="logo-text">Job Dekho</h1>
            </div>
            

            <div class="nav-links">
                <a href="/allJobs" class="nav-link">Jobs</a>
                {user && user.role == "Job Manager" ?<a href="/myJobs" class="nav-link">My Jobs</a>:<></>}
                {user && user.role == "Job Manager" ?<a href="/favourites" class="nav-link">Favourites</a>:<></>}
                {user ?<a href="/savedJobs" class="nav-link">Saved Jobs</a>:<></>}
                {user && user.role == "Job Seeker" ? <a href="/viewApplication" class="nav-link">My Application</a>:<></>}
                {user && user.role == "Job Seeker" ? <a href="/interview" class="nav-link">Interview</a>:<></>}
                {isAuthorized?<></>:<a href="/services" class="nav-link">Services</a>}
                {isAuthorized?<></>:<a href="/company" class="nav-link">Company</a>}

            </div>
            
            <div class="auth-buttons">
             {user && user._id ? <button class="btn-ghost" onClick={handleLogout}>Log Out</button>:<button class="btn-ghost" ><Link to="/register">Sign In</Link></button>}
              {user && user.role=='Job Manager' ?  <button class="btn-primary" onClick={navigatePostJobs}>Post Jobs</button>: <>{isAuthorized ?<></>:<button class="btn-primary"><Link to="/login">Log In</Link></button>}</>} 
            </div>
        </nav>
    </header>
  )
}

export default Header


