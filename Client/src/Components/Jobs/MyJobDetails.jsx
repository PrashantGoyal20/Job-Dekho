import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "./myjobdetails.css"
import Header from '../Permanent/Header'
import Footer from '../Permanent/Footer'
import Loader from '../Permanent/Loader'
import axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
    MapPin,
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
    Star,
    MoveLeft,
    MoveRight
} from 'lucide-react';

function MyJobDetails() {

    const [jobs, setJobs] = useState([])
    const [load, setLoad] = useState(true)
    const navigate = useNavigate()
    const { id } = useParams()
    var start = ''
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

    useEffect(() => {
        const fetchJobs = async () => {

            await axios.get(`http://localhost:3000/job/getMyJobs`, {
                withCredentials: true
            }).then((res) => {
                setJobs(res.data.jobs)
                setLoad(false)
            })

        }
        fetchJobs();
    }, [jobs])

    const handleNavigateApplicants = async (id) => {
        navigate(`/viewOurApplicant/${id}`)
    }
    start = jobs.findIndex(item => item._id === id)

    const deleteJob=async(jobid)=>{
        await axios.get(`http://localhost:3000/job/deleteJob/${jobid}`,{withCredentials:true}).then(
            navigate('/allJobs')
        )
    }

    return (
        <div>
            {load ? <Loader /> : <>
                <Header />
                <div className='my-jobs'>
                    {Object.keys(jobs).length != 0 ? <>
                        <div>
                            <button className="job-custom-prev"><MoveLeft color='white' /></button>

                            <button className="job-custom-next"><MoveRight color='white' /></button>
                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={20}
                                slidesPerView={1}
                                initialSlide={start}
                                autoHeight={true}
                                navigation={{
                                    nextEl: '.job-custom-next',
                                    prevEl: '.job-custom-prev'
                                }}

                                pagination={{ clickable: true }}
                                style={{ padding: '20px' }}
                            >
                                {jobs.map((job, index) => {
                                    const givenDate = new Date(job.jobPostedOn);
                                    return (
                                        <SwiperSlide>

                                            <div className='jobDetail-pagenum'>{index + 1}/{Object.keys(jobs).length}</div>
                                            <div className="job-profile-container">
                                                <div className="job-profile-content">
                                                    <div className="jobdetail-header">
                                                        <div className="job-header-top">
                                                            <div className="company-logo-detail">
                                                                <img className="company-logo-detail" src={job.logo.url} />
                                                            </div>
                                                            <div className="job-title-section">
                                                                <h1 className="jobdetail-title">{job.title}</h1>
                                                                <div className="company-name">{job.company}</div>

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
                                                                    {job.fixedSalary ? <div className="meta-value">{job.fixedSalary}</div> : <div className="meta-value">{job.salartTo}-{ }</div>}
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
                                                                    <div className="meta-value">{Math.floor((Date.now() - givenDate) / (1000 * 60 * 60 * 24))} Days</div>
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
                                                                    {job.requirements?.split('\n').filter((item) => item.trim().length != 0).map((requirement, index) => (
                                                                        <li key={index}>{requirement}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <div className="detail-section">
                                                                <h2 className="section-title">Employee Benefits</h2>
                                                                <ul className="requirements-list">
                                                                    {job.benefits?.split('\n').filter((item) => item.trim().length != 0).map((requirement, index) => (
                                                                        <li key={index}>{requirement}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div><div className="job-sidebar">
                                                            <div className="apply-section">
                                                                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Ready to See Applicants?</h3>
                                                                <button className="apply-button" onClick={(e) => handleNavigateApplicants(job._id)}>
                                                                    See Applicants
                                                                </button>
                                                            </div>

                                                            <div className="delete-section">
                                                                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Ready to Delete Job Posting?</h3>
                                                                <button className="delete-button" onClick={(e) => deleteJob(job._id)}>
                                                                    Delete Job
                                                                </button>
                                                            </div>


                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        </div>
                    </> : <div ></div>}

                </div>
                <Footer />
            </>}
        </div>
    )
}

export default MyJobDetails