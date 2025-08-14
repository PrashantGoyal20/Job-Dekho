import React, { useState, useEffect, useContext } from 'react'
import "./details.css"
import Header from '../Permanent/Header'
import axios from 'axios'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Context } from '../../main'
import {   MapPin, 
  Clock, 
  IndianRupee, 
  Users, 
  Calendar, 
  Briefcase, 
  ChevronDown, 
  ChevronUp,
  Share2,
  Bookmark,
  Heart,
  Star
} from 'lucide-react';
import Loader from '../Permanent/Loader'
import Footer from '../Permanent/Footer'



const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState([]);
  const navigate = useNavigate();
  const [load, setLoad] = useState(true)
  const [isDescriptionExpanded,setIsDescriptionExpanded]=useState(false)
  const { isAuthorized, user } = useContext(Context);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        url: window.location.href
      });
      console.log("Shared successfully");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  } else {
    alert("Sharing not supported on this browser.");
  }
};


  useEffect(() => {

      
    axios
      .get(`http://localhost:3000/job/jobDetails/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
        if(user ){setIsApplied(res.data.job.applicants?.includes(user._id))}
        if(user ){setIsSaved(user.savedJobs?.includes(res.data.job._id))
          console.log(user.savedJobs?.includes(res.data.job._id))
        }
        setLoad(false)
      })
      .catch((error) => {
        navigate("/notfound");
        console.log(error);
      });
  }, [user]);

  const givenDate = new Date(job.jobPostedOn);

   const handleSave = async() => {
    if(!isAuthorized) navigate('/login')
      axios
      .get(`http://localhost:3000/job/saveJob/${id}`, {
        withCredentials: true,
      }).then(setIsSaved(true))

  };

  const deleteSave = () => {
    axios
      .get(`http://localhost:3000/job/deleteSavedJob/${id}`, {
        withCredentials: true,
      }).then(setIsSaved(false))
  };


  return (
    <div>
      {load ? <Loader /> : <>
        <Header />
         <div className="job-profile-container">
        <div className="job-profile-content">
          <div className="jobdetail-header">
            <div className="job-header-top">
              <div className="company-logo-detail">
                <img className="company-logo-detail" src={job.logo.url}/>
              </div>
              <div className="job-title-section">
                <h1 className="jobdetail-title">{job.title}</h1>
                <div className="company-name">{job.company}</div>
                <div className="jobdetail-actions">
                  {user && user.role=='Job Seeker'?<>
                  {isApplied?<button 
                    className={`jobdetail-action-btn primary applied`}
                  >
                    <Briefcase size={16} />
                    Applied!
                  </button>:<button 
                    className={`jobdetail-action-btn primary `}
                    onClick={(e)=>navigate(`/applyApplicants/${job._id}`)}
                  >
                    <Briefcase size={16} />
                    Apply Now
                  </button>}</>:<></>}

                  {isSaved?<button 
                    className="jobdetail-action-btn"
                    onClick={deleteSave}
                  >
                    <Bookmark size={16} fill='#00ff88' />
                    Saved
                  </button>:
                  <button 
                    className="jobdetail-action-btn"
                    onClick={handleSave}
                  >
                    <Bookmark size={16} fill='none' />
                    Save Job
                  </button>}
                  
                  <button className="jobdetail-action-btn" onClick={handleShare}>
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>

            <div className="job-meta">
              <div className="meta-item">
                <MapPin className="meta-icon" size={20} />
                <div className="meta-content">
                  <div className="meta-label">Location</div>
                  <div className="meta-value">{job.location}</div>
                </div>
              </div>
              <div className="meta-item">
                <Clock className="meta-icon" size={20} />
                <div className="meta-content">
                  <div className="meta-label">Job Type</div>
                  <div className="meta-value">{job.category}</div>
                </div>
              </div>
              <div className="meta-item">
                <IndianRupee className="meta-icon" size={20} />
                <div className="meta-content">
                  <div className="meta-label">Salary Range</div>
                  {job.fixedSalary?<div className="meta-value">{job.fixedSalary}</div>:<div className="meta-value">{job.salartTo}-{}</div>}
                </div>
              </div>
              <div className="meta-item">
                <Briefcase className="meta-icon" size={20} />
                <div className="meta-content">
                  <div className="meta-label">Experience</div>
                  <div className="meta-value">{job.experience} Years</div>
                </div>
              </div>
              <div className="meta-item">
                <Calendar className="meta-icon" size={20} />
                <div className="meta-content">
                  <div className="meta-label">Posted</div>
                  <div className="meta-value">{Math.floor((Date.now()-givenDate) / (1000 * 60 * 60 * 24))} Days</div>
                </div>
              </div>
              <div className="meta-item">
                <Users className="meta-icon" size={20} />
                <div className="meta-content">
                  <div className="meta-label">Applicants</div>
                  <div className="meta-value">{Object.keys(job.applicants).length}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="job-content">
            <div className="job-details">
              <div className="detail-section">
                <h2 className="section-title">Job Description</h2>
                <div className={`description-content ${isDescriptionExpanded ? 'description-expanded' : 'description-collapsed'}`}>
                  {job.description}
                </div>
                <button 
                  className="expand-btn"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                >
                  {isDescriptionExpanded ? (
                    <>
                      Show Less
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Read More
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
              </div>

              <div className="detail-section">
                <h2 className="section-title">Requirements</h2>
                <ul className="requirements-list">
                  {job.requirements?.split('\n').filter((item)=>item.trim().length!=0).map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h2 className="section-title">Employee Benefits</h2>
                <ul className="requirements-list">
                  {job.benefits?.split('\n').filter((item)=>item.trim().length!=0).map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            </div>
            {user && user.role=='Job Seeker' && !isApplied?<div className="job-sidebar">
              <div className="apply-section">
                <h3 style={{margin: '0 0 20px 0', fontSize: '18px'}}>Ready to Apply?</h3>
                <button className="apply-button" onClick={(e)=>navigate(`/applyApplicants/${job._id}`)}>
                  Apply Now
                </button>
              </div>

              
            </div>:<></>}
            
          </div>
        </div>
      </div>
        <Footer />
      </>}

    </div>
  )
}

export default JobDetails