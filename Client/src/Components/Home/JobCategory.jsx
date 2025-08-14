import React, { useContext, useEffect, useState } from 'react'
import "./homepage.css"
import { useNavigate,Link } from 'react-router-dom';
import { MoveRight } from 'lucide-react';

import axios from 'axios'

const JobCategory = () => {

    const server=import.meta.env.VITE_APP_SERVER
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([])
    const [total, setTotal] = useState('')
    useEffect(() => {
        const fetchJobs = async () => {
            await axios.get(
                `${server}/job/getAllJobs`
            ).then((response) => {
                setJobs(response.data.jobs.slice(0,6))
                setTotal(Object.keys(response.data.jobs)?.length)
            }

            );
        };
        fetchJobs();
    }, []);


    const handleSearch = () => {
        navigate('/allJobs')

    };

    const handleNavigation = (id) => {
    navigate(`/jobDetails/${id}`)
  }

    return (
        <section class="jobs-section">
            <div class="section-header">
                <h3 class="section-title">Featured Opportunities</h3>
                <div class="job-counter">
                    <span id="job-count">{total}</span>
                    <span>positions available</span>
                </div>
            </div>

            <div class="jobs-grid" id="jobs-grid">
                {jobs.map((job, index) => {
                    return (
                        <div className='job-card'>
                            <div>
                                <span className='job-header'>{job.company}</span>

                                <span className='job-title'>{job.title}</span>
                                {job.fixedSalary?<p className='job-footer'>₹{job.fixedSalary}</p>:<p className='job-footer'>₹{job.salaryFrom}-₹{job.salaryTo}</p>}
                                <p className='job-stats'>Location : {job.location}</p>
                                <button className='apply-btn' onClick={(e) => handleNavigation(job._id)}><span>Apply Now </span><MoveRight size={20}/></button>
                            </div>
                            <img className='job-logo' src={job.logo.url} />
                        </div>
                    )
                })}
            </div>

            <div class="load-more-section">
                <button class="load-more-btn" onClick={handleSearch}>
                    <span>Load More Positions</span>
                    <div class="btn-ripple"></div>
                </button>
            </div>
        </section>
    )
}

export default JobCategory