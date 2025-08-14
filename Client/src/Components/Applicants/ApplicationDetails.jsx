import React, { useState } from 'react'
import axios from "axios"
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../Permanent/Loader'
import { ArrowLeft, ThumbsDown,ThumbsUp,Mail, Phone, MapPin, Award, Clock,EyeOff, Star, FileText, Eye, Download, Calendar, IndianRupee, MoveRight, ExternalLink, ChartNoAxesCombined } from 'lucide-react'
import Footer from '../Permanent/Footer'
import Header from '../Permanent/Header'


const ApplicationDetails = () => {
    const google=import.meta.env.VITE_APP_GOOGLE
  const server=import.meta.env.VITE_APP_SERVER
    const [app, setApp] = useState({})
    const [employer,setEmployer]=useState({})
    const [load, setLoad] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [preview,setPreview]=useState(false) 
    const { id } = useParams()
    const navigate=useNavigate()
    useEffect(() => {
        const fetchApp = async () => {
            await axios.get(`${server}/app/applicationDetails/${id}`, { withCredentials: true })
                .then((res) => {
                    setApp(res.data.application)
                    setEmployer(res.data.employer)
                    setLoad(false)
                })
        }
        fetchApp()
    }, [])

    const handleInterview = (newid, id) => {
        navigate(`/start-interview/${id}/${newid}`)
    }

    const deleteFavourite = async (id) => {
            await axios.post(`${server}/job/deleteFav/${employer._id}`, { appId: id }, {
                withCredentials: true,
            }).then((res) => {
                setIschecked(!ischecked)
            }
            )
    
        }
    
        const addFavourite = async (id) => {
            await axios.post(`${server}/job/addFav/${employer._id}`, { appId: id }, {
                withCredentials: true,
            }).then((res) => {
                setIschecked(!ischecked)
            }
            )
        }

    const givenDate=new Date(app.postedOn)
    return (
        <div>
            {load ? <Loader /> : <><Header/><div style={{margin:"120px"}} className="app-container">
                <div className="header-section">
                    <div className="header-content">

                        <div className="profile-header">
                            <div className="profile-info">
                                <img className="avatar" src={app.profile?.url} />
                                <div className="profile-details">
                                    <h2>{app.name}</h2>
                                    <div className="contact-info">
                                        <span className="contact-item">
                                            <Mail size={16} />
                                            {app.email}
                                        </span>
                                        <span className="contact-item">
                                            <Phone size={16} />
                                            {app.phone}
                                        </span>
                                        <span className="contact-item">
                                            <MapPin size={16} />
                                            {app.address} , {app.city} ({app.pincode})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-actions">

                                <div className="action-buttons">
                                    <button className="btn btn-primary" onClick={(e) => handleInterview(app._id, id)}>Schedule Interview</button>
                                    <button className={`btn btn-success status-${app.status}`}>{app.status}</button>
                                    {employer.favourite?.includes(app._id)?<button className="btn btn-secondary-true" onClick={(e)=>deleteFavourite(app._id)}><ThumbsUp size={18}/>Remove from Favourite</button>:<button className="btn btn-secondary" onClick={(e)=>addFavourite(app._id)}><ThumbsDown size={18}/>Add to Favourite</button>}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>


                <div className="tabs-container">
                    <div className="tabs-content">
                        <div className="tabs-list">
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'experience', label: 'Experience' },
                                { id: 'education', label: 'Education' },
                                { id: 'documents', label: 'Documents' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="main-content">
                    {activeTab === 'overview' && (
                        <div className="content-grid">
                            <div className="content-main">
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <div className="stat-card-content">
                                            <Calendar className="stat-icon calendar" size={20} />
                                            <div className="stat-info">
                                                <div className="stat-info-label">Applied</div>
                                                <div className="stat-info-value">{Math.floor((Date.now() - givenDate) / (1000 * 60 * 60 * 24))} Days Ago </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-card-content">
                                            <Award className="stat-icon award" size={20} />
                                            <div className="stat-info">
                                                <div className="stat-info-label">Experience</div>
                                                <div className="stat-info-value">{app.exp}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-card-content">
                                            <Star className="stat-icon star" size={20} />
                                            <div className="stat-info">
                                                <div className="stat-info-label">Expected Salary</div>
                                                <div className="stat-info-value">{app.expectedSalary}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-card-content">
                                            <ChartNoAxesCombined className="stat-icon star" size={20} />
                                            <div className="stat-info">
                                                <div className="stat-info-label">Expected Salary</div>
                                                <div className="stat-info-value">{app.availableStartDate}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <h3 className="card-title">Cover Letter</h3>
                                    <div className="cover-letter">
                                        {app.coverLetter}
                                    </div>
                                </div>

                                <div className="card">
                                    <h3 className="card-title">Why Interested?</h3>
                                    <div className="cover-letter">
                                        {app.whyInterested}
                                    </div>
                                </div>
                            </div>

                            <div className="content-sidebar">
                                <div className="card">
                                    <h3 className="card-title">Contact & Links</h3>
                                    <div className="contact-links">
                                        <a href={`mailto:${app.email}`} className="contact-link">
                                            <Mail size={16} />
                                            <span className="contact-link-text">{app.email}</span>
                                        </a>
                                        <a href={`tel:${app.phone}`} className="contact-link">
                                            <Phone size={16} />
                                            <span className="contact-link-text">{app.phone}</span>
                                        </a>
                                        <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="contact-link">
                                            <ExternalLink size={16} />
                                            <span className="contact-link-text">Portfolio</span>
                                        </a>
                                        <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-link">
                                            <ExternalLink size={16} />
                                            <span className="contact-link-text">LinkedIn</span>
                                        </a>
                                        <a href={app.githubUrl} target="_blank" rel="noopener noreferrer" className="contact-link">
                                            <ExternalLink size={16} />
                                            <span className="contact-link-text">GitHub</span>
                                        </a>
                                    </div>
                                </div>
                                <div className="card">
                                    <h3 className="card-title">Applied For</h3>
                                    <div className="contact-links">
                                        <div className="company-information">
                                            <img src={employer.logo.url} />
                                            <span className="contact-link-text">{employer.comapny}</span>
                                        </div>
                                        <div className="company-information">
                                            <Mail size={16} />
                                            <span className="contact-link-text">{employer.contactEmail}</span>
                                        </div>
                                        <div className="company-information">
                                            <Star size={16} />
                                            <span className="contact-link-text">{employer.title}</span>
                                        </div>
                                        <div className="company-information">
                                            <MapPin size={16} />
                                            <span className="contact-link-text">{employer.location}</span>
                                        </div>
                                        <div className="company-information">
                                            <IndianRupee size={16} />
                                            <span className="contact-link-text">{employer.salary}</span>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <div className="content-main">
                            <div className="card">
                                <h3 className="card-title">Work Experience</h3>
                                <div className="experience-timeline">
                                    {app.experience.map((exp, index) => (
                                        <div key={index} className="experience-item">
                                            <div className="experience-header">
                                                <div>
                                                    <h4 className="experience-title">{exp.company}</h4>
                                                    <p className="experience-company">{exp.company}</p>
                                                </div>
                                                <span className="experience-duration">{exp.period}</span>
                                            </div>
                                            <p className="experience-description">{exp.details}</p>

                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card">
                                <h3 className="card-title">Notable Projects</h3>
                                <div className="projects-grid">
                                    {app.projects?.map((project, index) => (
                                        <div key={index} className="project-card">
                                            <h4 className="project-title">{project.projectName}</h4>
                                            <p className="project-description">{project.projectDetails}</p>
                                            <div className="project-technologies">
                                                <span className="experience-duration">{project.projectTime}</span>

                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'education' && (
                        <div className="card">
                            <h3 className="card-title">Education</h3>
                            <div className="education-timeline">
                                {/* {application.education.map((edu, index) => (
                                                                                                        <div key={index} className="education-item">
                                                                                                            <div className="education-header">
                                                                                                                <div>
                                                                                                                    <h4 className="education-degree">{edu.degree}</h4>
                                                                                                                    <p className="education-institution">{edu.institution}</p>
                                                                                                                </div>
                                                                                                                <div className="education-details">
                                                                                                                    <span className="education-year">{edu.year}</span>
                                                                                                                    {edu.gpa && (
                                                                                                                        <p className="education-gpa">GPA: {edu.gpa}</p>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ))} */}
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="card">
                            <h3 className="card-title">Documents</h3>
                            <div className="document-item">

                                <div className="document-info">
                                    <FileText className="document-icon" size={24} />
                                    <div className="document-details">
                                        <p className="document-meta">Resume • PDF • 2.3 MB</p>
                                    </div>
                                </div>
                                <div className="document-actions">
                                    <button className="icon-button" onClick={(e) => setPreview(!preview)}>
                                        {preview ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    <a href={app.resume.url} download target="_blank" rel="noopener noreferrer">
                                        <button className="icon-button">
                                            <Download size={18} />
                                        </button>
                                    </a>

                                </div>
                            </div>
                            {preview ? <img className='resume-image' src={app.resume.url} /> : <></>}
                        </div>
                    )}

                </div>
            </div><Footer/></>}
        </div>


    )
}

export default ApplicationDetails