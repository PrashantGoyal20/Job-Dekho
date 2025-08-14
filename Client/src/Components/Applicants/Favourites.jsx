import React from 'react'
import { useState } from 'react'
import Header from '../Permanent/Header'
import Footer from '../Permanent/Footer'
import axios from "axios"
import { useEffect } from 'react'
import { useContext } from 'react'
import { Context } from '../../main'
import { MoveRight } from 'lucide-react'
import Loader from '../Permanent/Loader'
import "./favourite.css"
import { useNavigate } from 'react-router-dom'

const Favourites = () => {
    const [application,setApplication]=useState([])
    const [load,setLoad]=useState(true)
    const {use,isAuthorized}=useContext(Context)
    const [employer,setEmployer]=useState([])
    const [filter, setFilter] = useState('all');
    const navigate=useNavigate()
    
      const getStatusClass = (status) => {
        switch (status) {
          case 'Pending': return 'status-pending';
          case 'Submitted': return 'status-interview';
          case 'Shortlisted': return 'status-accepted';
          case 'Rejected': return 'status-rejected';
          default: return 'status-pending';
    
        }
      };
    
    

    useEffect(() => {
        // if(!isAuthorized || user?.role!='Job Manager'){
        //     navigate('/login')
        // }
        const fetchJobs = async () => {

            await axios.get(`http://localhost:3000/job/getAllFavourites`, {
                withCredentials: true
            }).then((res) => {
                setApplication(res.data.applications)
                setEmployer(res.data.employer)
                setLoad(false)
            })

        }
        fetchJobs();
    }, [])

    
    const filteredApplications = application.filter(app => 
        filter === 'all' || app.status === filter
      );

  return (
    <div>
        <div>
            {load ? <Loader /> : <>
                <Header />
                <div className='view-app'>
                
                {Object.keys(application).length > 0 ? <>
                    <>
          <div className="header-content">
            <h1>Applications</h1>
            <p className="subtitle">Manage your career opportunities</p>
          </div>
            <div className="filters">
              <button
                className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('all')}
              >
                All Applications
              </button>
              <button
                className={filter === 'Pending' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('Pending')}
              >
                Pending
              </button>
              <button
                className={filter === 'Submitted' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('Submitted')}
              >
                Submited
              </button>
              <button
                className={filter === 'Shortlisted' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('Shortlisted')}
              >
                Accepted
              </button>
              <button
                className={filter === 'Rejected' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('Rejected')}
              >
                Rejected
              </button>
            </div>

            <div className="applications-list">
              {filteredApplications.map((app,i) => (
                <div key={app.id} className="application-card" onClick={(e)=>navigate(`/applicationDetails/${app._id}`)}>
                  <div className="card-left">
                    <div className="job-header">
                      <h3 className="job-title">{app.name}</h3>
                      <div className="job-meta">
                        <span className="company">{employer[i].company}</span>
                        <span className="separator">•</span>
                        <span className="location">{employer[i].location}</span>
                      </div>
                    </div>

                    <div className="job-details">
                      <div className="detail-row">
                        <span className="detail-label">Salary</span>
                        <span className="detail-value">{employer[i].salary}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Type</span>
                        <span className="detail-value">{employer[i].category}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Applied</span>
                        <span className="detail-value">{new Date(app.postedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-right">
                    <div className={`status ${getStatusClass(app.status)}`}>
                      <div className="status-dot"></div>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </div>

                    <div className="card-actions">
                      <button className="action-btn">⋯</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </>
                </> : <>
                    <div class="no-fav">
                        No Favourite Applications
                    </div>
                </>}
                </div>
                <Footer />
            </>}

        </div>
    </div>
  )
}

export default Favourites