import React, { useState, useEffect, useContext ,useRef} from 'react'
import './application.css'
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
import { ArrowLeft, ThumbsDown, ThumbsUp, Mail, Phone, MapPin, Award, IndianRupee, EyeOff, Star, FileText, Eye, Download, Calendar, MoveLeft, MoveRight, ExternalLink, ChartNoAxesCombined } from 'lucide-react'

import {
    LiveKitRoom,
    GridLayout,
    ParticipantTile,
    useTracks,
    ControlBar,
    VideoConference
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import VideoGrid from './Messaging/Room'

function Application() {
    const [application, setApplication] = useState([])
    const [employer, setEmployer] = useState([])
    const { user, isAuthorized } = useContext(Context);
    const navigate = useNavigate();
    const [load, setLoad] = useState(true)
    const index = useParams()
    const [meetStart, setMeetStart] = useState(false)
    const [token, setToken] = useState('')
    const [url, setUrl] = useState('')
    const [activeTab, setActiveTab] = useState('overview')
    const [note,setNote]=useState('')
    const [preview,setPreview]=useState(false) 
    const noInterviewRef=useRef(null)
    var name = ''
    var room = ''



    useEffect(() => {
        // if(!isAuthorized){
        //     navigate('/login')
        // }
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
    }, [isAuthorized, application]);

    const joinInterview = async (id, i) => {
        if (!application[i].roomToken) return;
        await axios.get(`http://localhost:3000/join-meet/${id}`).then((res) => {
            room = res.data.token
            name = application[i].name
            setUrl(res.data.url)
            return;
        })
    }

    const handleData = async (id, i) => {
        const data = await joinInterview(id, i)
        console.log(room)
        await initiateRoom(id)
    }

    const initiateRoom = async (id) => {
        setLoad(true)
        console.log(name + "" + room + " " + id)
        await axios.post(`http://localhost:3000/get-token/${id}`, { room, name, isApplicant: true }, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        }).then((res) => {
            setToken(res.data.token)
            setUrl(res.data.url)
            setLoad(false)
            setMeetStart(true)
        })
    }

    const handleNavigation = () => {
        navigate('/viewApplication')
    }


    const handleNoInterview=()=>{
        noInterviewRef.current.classList.replace('no-interview-hidden','no-interview')
        setTimeout(()=>{
        noInterviewRef.current.classList.replace('no-interview','no-interview-hidden')
        },10000)
    }

    return (
        <div>
            {load ? <Loader /> : <>{meetStart ? <>
                <LiveKitRoom
                    token={token}
                    serverUrl={url}
                    connect
                    onDisconnected={handleNavigation}
                    style={{ height: '100vh', background: 'black', color: "white" }}
                >
                    <VideoConference />

                </LiveKitRoom>
            </> :
                <div >
                    <Header />
                    <span ref={noInterviewRef} className='no-interview-hidden'>No Interview Started</span>
                    {Object.keys(application).length != 0 ?
                        <div className='application-container'>
                        <button className="job-custom-prev"><MoveLeft color='white' /></button>
                        
                                                <button className="job-custom-next"><MoveRight color='white' /></button>
                            <Swiper
                                // initialSlide={Number(index.index)}
                                slidesPerView={1}
                                autoHeight={true}
                                spaceBetween={0}
                                navigation={{
                                nextEl: '.job-custom-next',
                                prevEl: '.job-custom-prev'
                            }}
                                pagination={{ clickable: true }}
                                modules={[Navigation, Pagination]}
                                style={{ width: '100%' }}
                            >
                                {application.map((app, i) => {
                                    const givenDate = new Date(app.postedOn)
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
                                                                        {!app.roomToken?<button className="btn btn-primary " onClick={handleNoInterview}>Enter Interview</button>:<button className="btn btn-primary-interview-started" onClick={(e) => handleData(app._id, i)}>Enter Interview</button>}
                                                                        <button className={`btn btn-success status-${app.status}`}>{app.status}</button>
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
                                                                                <img src={employer[i].logo.url}/>
                                                                                <span className="contact-link-text">{employer[i].comapny}</span>
                                                                            </div>
                                                                            <div className="company-information">
                                                                                <Mail size={16} />
                                                                                <span className="contact-link-text">{employer[i].contactEmail}</span>
                                                                            </div>
                                                                            <div className="company-information">
                                                                                <Star size={16} />
                                                                                <span className="contact-link-text">{employer[i].title}</span>
                                                                            </div>
                                                                            <div className="company-information">
                                                                                <MapPin size={16} />
                                                                                <span className="contact-link-text">{employer[i].location}</span>
                                                                            </div>
                                                                            <div className="company-information">
                                                                                <IndianRupee size={16} />
                                                                                <span className="contact-link-text">{employer[i].salary}</span>
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
                                                                            <h4>{application.resume}</h4>
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
                                                </div>
                                            </>
                                        </SwiperSlide>
                                    </>)
                                })}
                            </Swiper>
                            </div> : <div className='no-application'>
                        Sorry No Application
                    </div>
                            }

                            <Footer />
                        </div>
                    
            }</>
            }
        </div>
    )
}

export default Application


