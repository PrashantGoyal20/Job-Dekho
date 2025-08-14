import React from 'react'
import { Link } from 'react-router-dom'
import "./header.css"

const Footer = () => {
  return (
    <footer className='footer-container'>

            <div className='footer-head'>
                <div><p>About Us</p>
                    <Link to='/'>About Us</Link>
                    <Link to='/'>Careers</Link>
                    <Link to='/'>Media Centre</Link>
                    <Link to='/'>Our Planet</Link>
                    <Link to='/'>Our People</Link>
                    <Link to='/'>Our Community</Link>

                </div>
                <div><p>Help</p>
                    <Link to='/'>Help and Contact</Link>
                    <Link to='/'>Job Updates</Link>
                    <Link to='/'>Special Assistance</Link>
                    <Link to='/'>Frequently asked questions</Link>

                </div>
                <div><p>Book</p>
                    <Link to='/'>Book Mock Interviews</Link>
                    <Link to='/'>Job Assistance</Link>
                    <Link to='/'>Career Guidance</Link>
                    <Link to='/'>Planning your Interviews</Link>
                    <Link to='/'>Job Experience</Link>

                </div>
                <div><p>Manage</p>
                    <Link to='/'>Check-In Resume</Link>
                    <Link to='/'>Manage Your Interviews</Link>
                    <Link to='/'>Profile status</Link>

                </div>
            </div>
            <div className='footer-mid'>
                <div><p>Subscribe to our special offers</p>
                    <div>
                        Save with our latest fares and offers.
                    </div>
                    <Link to='/'>Unsubscribe or change your preferences</Link>

                </div>
                <div><p>Job Dekho App</p>
                    <div>Find Your Dream Job with Us</div>
                    <div className='google-play'>
                        <img src='https://res.cloudinary.com/dc728fl24/image/upload/v1750880059/App-Store_n62j1u.jpg' />
                        <img src='https://res.cloudinary.com/dc728fl24/image/upload/v1750880058/Google-Play_cxvmc5.jpg' />
                    </div>

                </div>

            </div>
            <div className='footer-bottom'>
                All these links in footer are just for show, they actually don't work

            </div>
        </footer>
  )
}

export default Footer