import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../../main'
import axios from 'axios'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import "./viewapplication.css"
import { v4 as uuidv4 } from "uuid"
import Header from '../Permanent/Header';
import Loader from '../Permanent/Loader';
import Footer from '../Permanent/Footer';

const ViewApplication = () => {
  const [application, setApplication] = useState([])
  const [employer, setEmployer] = useState([])
  const { user, isAuthorized } = useContext(Context);
  const navigate = useNavigate();
  const [load, setLoad] = useState(true)
  const [filter, setFilter] = useState('all');

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Submitted': return 'status-interview';
      case 'Shortlisted': return 'status-accepted';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';

    }
  };

  const filteredApplications = application.filter(app => 
    filter === 'all' || app.status === filter
  );


  useEffect(() => {
    try {

      axios
        .get("http://localhost:3000/app/employee/viewApplication", {
          withCredentials: true,
        })
        .then((res) => {
          setApplication(res.data.applications);
          setEmployer(res.data.employer)
          setLoad(false)
        });

    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  // if (!isAuthorized) {
  //   return navigate("/login");
  // }

  const handleNavigation = (id) => {
    navigate(`/viewApplication/${id}`)
  }


  return (
    <div>
    
      {load ? <Loader /> : <>
        <Header />
        <div className='view-app'>
          {Object.keys(application).length > 0 ? <>
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
                <div key={app.id} className="application-card" onClick={(e)=>handleNavigation(app._id)}>
                  <div className="card-left">
                    <div className="job-header">
                      <h3 className="job-title">{employer[i].title}</h3>
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
        </> : <h3 style={{ marginBottom: "120px" }}>No available applications !!!!</h3>}
      </div>
      <Footer />
    </>}
     
    </div >

  )
}

export default ViewApplication