import React, { useState, useEffect, useContext } from 'react'
import axios from "axios"
import Header from '../Permanent/Header'
import Footer from '../Permanent/Footer'
import Loader from '../Permanent/Loader'
import "./myjobs.css"
import { useNavigate } from 'react-router-dom'
import { Context } from '../../main'
import { MoveRight } from 'lucide-react'

const MyJobs = () => {
    const server=import.meta.env.VITE_APP_SERVER
    const [jobs, setJobs] = useState([])
    const [load, setLoad] = useState(true)
    const navigate = useNavigate()
    const { user, isAuthorized } = useContext(Context)

    useEffect(() => {
        if(!isAuthorized || user?.role!='Job Manager'){
            navigate('/login')
        }
        const fetchJobs = async () => {

            await axios.get(`${server}/job/getMyJobs`, {
                withCredentials: true
            }).then((res) => {
                setJobs(res.data.jobs)
                setLoad(false)
            })

        }
        fetchJobs();
    }, [])

    const handleSelectJob = async (index) => {
        navigate(`/myJobDetails/${index}`)
    }
    return (
        <div>
            {load ? <Loader /> : <>
                <Header />
                <div className='myjob-container'>
                <h4 class="section-title">Jobs That You Provided</h4>
                {jobs ? <>
                    <div class="jobs-grid-2" id="jobs-grid">
                        {jobs.map((job, index) => {
                            return (
                                <div className='job-card'>
                                    <div>
                                        <span className='job-header'>{job.company}</span>

                                        <span className='job-title'>{job.title}</span>
                                        {job.fixedSalary ? <p className='job-footer'>₹{job.fixedSalary}</p> : <p className='job-footer'>₹{job.salaryFrom}-₹{job.salaryTo}</p>}
                                        <p className='job-stats'>Location : {job.location}</p>
                                        <button className='apply-btn' onClick={(e) => handleSelectJob(job._id)}><span>Details </span><MoveRight size={20} /></button>
                                    </div>
                                    <img className='job-logo' src={job.logo.url} />
                                </div>)
                        })}
                    </div>
                </> : <>
                    <div className='no-jobs'>
                       HAVEN'T POSTED ANY JOBS YET
                    </div>
                </>}
                </div>
                <Footer />
            </>}

        </div>
    )
}

export default MyJobs