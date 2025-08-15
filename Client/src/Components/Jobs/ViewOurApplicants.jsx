import React, { useState, useEffect, useContext } from 'react'
import './viewourapplicants.css'
import { useNavigate, useParams } from 'react-router-dom'
import { Context } from '../../main'
import toast from 'react-hot-toast'
import axios from "axios"
import Loader from '../Permanent/Loader'
import Header from '../Permanent/Header'
import Footer from '../Permanent/Footer'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ArrowLeft, ThumbsDown,ThumbsUp,Mail, Phone, MapPin, Award, Clock,EyeOff, Star, FileText, Eye, Download, Calendar, MoveLeft, MoveRight, ExternalLink, ChartNoAxesCombined } from 'lucide-react'


const ViewOurApplicants = () => {
    const server=import.meta.env.VITE_APP_SERVER
    const [application, setApplication] = useState([])
    const [employer, setEmployer] = useState({})
    const { user, isAuthorized } = useContext(Context);
    const navigate = useNavigate();
    const [load, setLoad] = useState(true)
    const { id } = useParams()
    const [ischecked, setIschecked] = useState(false)
    const [note, setNote] = useState('')
    const [activeTab, setActiveTab] = useState('overview')
    const [preview,setPreview]=useState(false) 
    const [status,setStatus]=useState(false)
    const [favourite,setfavourite]=useState(false)

    useEffect(() => {
        if(!isAuthorized){
            navigate('/login')
        }
        try {

            axios.get(`${server}/app/employer/getAll/${id}`, {
                withCredentials: true,
            })
                .then((res) => {
                    setApplication(res.data.applications);
                    setEmployer(res.data.employer)
                    setLoad(false)
                });

        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error)
        }
    }, [isAuthorized,application]);

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

    const changeStatus=async(value,id)=>{
    await axios.post(`${server}/app/changeStatus/${id}`,{status:value},{withCredentials:true}).then(
        (res)=>{
            setStatus(false)
            
        }
    )
    }


    return (
        <div>
            {load ? <Loader /> : <>
                <Header />
                {Object.keys(application).length != 0 ?
                    <div className='application-details'>
                        <button className="job-custom-prev"><MoveLeft color='white' /></button>

                        <button className="job-custom-next"><MoveRight color='white' /></button>

                        <Swiper
                            slidesPerView={1}
                            autoHeight={true}
                            spaceBetween={0}
                            pagination={{ clickable: true }}
                            modules={[Navigation, Pagination]}
                            style={{ width: '100%' }}
                            navigation={{
                                nextEl: '.job-custom-next',
                                prevEl: '.job-custom-prev'
                            }}
                        >
                            {application.map((app, i) => {
                                const givenDate=new Date(app.postedOn)
                               return (<>


                                    <SwiperSlide key={i}>
                                        <>
                                            <div className="app-container">
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
                                                                    <button onClick={(e)=>setStatus(!status)} className={`btn btn-success status-${app.status}`}>{app.status}</button>
                                                                    
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
                                                                { id: 'documents', label: 'Documents' },
                                                                { id: 'notes', label: 'Notes' }
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
                                                        {status?<div className='status-btn'>
                                                                        <button onClick={(e)=>changeStatus('Submitted',app._id)}>Submitted</button>
                                                                        <button onClick={(e)=>changeStatus('Pending',app._id)}>Pending</button>
                                                                        <button  onClick={(e)=>changeStatus('Shortlisted',app._id)}>Shortlisted</button>
                                                                        <button  onClick={(e)=>changeStatus('Rejected',app._id)}>Rejected</button>
                                                                    </div>:<></>}
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
                                                                        <h4>{application.resume}</h4>
                                                                        <p className="document-meta">Resume • PDF • 2.3 MB</p>
                                                                    </div>
                                                                </div>
                                                                <div className="document-actions">
                                                                    <button className="icon-button" onClick={(e)=>setPreview(!preview)}>
                                                                       {preview?<EyeOff size={18}/>:<Eye size={18} />} 
                                                                    </button>
                                                                    <a href={app.resume.url} download target="_blank" rel="noopener noreferrer">
                                                                    <button className="icon-button">
                                                                        <Download size={18} />
                                                                    </button>
                                                                </a>
                                                                    
                                                                </div>
                                                            </div>
                                                            {preview?<img className='resume-image' src={app.resume.url}/>:<></>}
                                                        </div>
                                                    )}

                                                    {activeTab === 'notes' && (
                                                        <div className="content-main">
                                                            {/* Add Note */}
                                                            <div className="card">
                                                                <h3 className="card-title">Add Note</h3>
                                                                <div className="note-form">
                                                                    <textarea
                                                                        value={note}
                                                                        onChange={(e) => setNote(e.target.value)}
                                                                        placeholder="Add your notes about this candidate..."
                                                                        className="note-input"
                                                                    />

                                                                    <button
                                                                        // onClick={addNote}
                                                                        className="btn btn-primary"
                                                                    >
                                                                        Add Note
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Notes List */}
                                                            <div className="card">
                                                                <h3 className="card-title">Notes History</h3>
                                                                <div className="notes-list">
                                                                    {/* {notes.map((note) => (
                                                                    <div key={note.id} className="note-item">
                                                                        <div className="note-header">
                                                                            <span className="note-author">{note.author}</span>
                                                                            <span className="note-date">{formatDate(note.date)}</span>
                                                                        </div>
                                                                        <p className="note-content">{note.content}</p>
                                                                    </div>
                                                                ))} */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    </SwiperSlide>
                                </>)
                            })}
                        </Swiper></div> : <div className='no-application'>
                        Sorry No Application
                    </div>}

                <Footer />
            </>}
        </div>
    )
}

export default ViewOurApplicants