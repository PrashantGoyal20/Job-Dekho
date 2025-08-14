import React from 'react'
import Header from '../Permanent/Header'
import "./homepage.css"
import JobCategory from './JobCategory.jsx'
import JobCompany from './JobCompany.jsx'
import SearchBar from './SearchBar.jsx'
import Footer from '../Permanent/Footer.jsx'
import { useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'


const Homepage = () => {
  const navigate = useNavigate()

  const handleNavigation = () => {
    navigate('/chat')
  }
  return (
    <div >
      <Header/>
      <section id='home'>

        <SearchBar/>
        <div className='bot-icon-cover' onClick={handleNavigation}>
          <button className='bot-icon'><MessageSquare size={25} color='white'/></button>
        </div>
        <JobCategory />
        <JobCompany />
      </section>
      <Footer />
    </div>
  )
}

export default Homepage