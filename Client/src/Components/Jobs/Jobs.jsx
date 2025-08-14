import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../main';
import Header from '../Permanent/Header';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./jobs.css"
import axios from 'axios'
import { MoveRight, MoveLeft } from 'lucide-react';
import Footer from '../Permanent/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Loader from '../Permanent/Loader';


const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [load, setLoad] = useState(true);
  const [search, setSearch] = useState([])
  const navigate = useNavigate()
  const location = useLocation()


  useEffect(() => {
    const fetchSearch = async () => {
      try {
        await axios.get(`http://localhost:3000/job/searchJob${location.search}`).then((response) => {
          setSearch(response.data?.search[0]?.concat(response.data?.search[1]));
          setLoad(false)
        }

        );
      } catch (error) {
        console.log(error);
      }
    }
    const fetchJobs = async () => {
      try {
        await axios.get(`http://localhost:3000/job/getAllJobs`).then((response) => {
          setJobs(response.data.jobs);
          setLoad(false)
        }

        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchJobs();
    fetchSearch()


  }, []);

  const developer = jobs.filter(job => { return (job.title.toLowerCase().includes('developer') || job.title.toLowerCase().includes('SDE')) })
  const sde = jobs.filter(job => { return (job.title.toLowerCase().includes('sde') || job.title.toLowerCase().includes('software')) })
  const manager = jobs.filter(job => job.title.toLowerCase().includes('manager'))



  const handleNavigation = (id) => {
    navigate(`/jobDetails/${id}`)
  }

  return (

    <div>
      {load ? <><Loader /></> : <><Header />
        {Object.keys(jobs).length != 0 ? <></> : <div style={{ display: 'flex', flexDirection: "column" }}><img src='https://w7.pngwing.com/pngs/714/930/png-transparent-yellow-sorry-emoji-illustration-desktop-sorry-smiley-sorry-love-miscellaneous-sticker.png' />Sorry But There are No Jobs That matches Your Search Result</div>}
        <div className='job-container'>
          <div className='developer-slider'>
            {location.search ? <div>
              <h4 class="section-title">Your Search</h4>
              {Object.keys(search).length != 0 ?
                <div>


                  <button className="search-custom-prev"><MoveLeft color='white' /></button>
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={3}
                    navigation={{
                      nextEl: '.search-custom-next',
                      prevEl: '.search-custom-prev'
                    }}
                    pagination={{ clickable: true }}
                    style={{ padding: '20px' }}
                  >
                    {search.map((job, index) => {
                      return (
                        <SwiperSlide>
                          <div className='job-card-2'>
                            <div>
                              <span className='job-header'>{job.company}</span>

                              <span className='job-title'>{job.title}</span>
                              {job.fixedSalary ? <p className='job-footer'>₹{job.fixedSalary}</p> : <p className='job-footer'>₹{job.salaryFrom}-₹{job.salaryTo}</p>}
                              <p className='job-stats'>Location : {job.location}</p>
                              <button className='apply-btn' onClick={(e) => handleNavigation(job._id)}><span>Apply Now </span><MoveRight size={20} /></button>
                            </div>
                            <img className='job-logo' src={job.logo.url} />
                          </div>
                        </SwiperSlide>)
                    })}

                  </Swiper>
                  <button className="search-custom-next"><MoveRight color='white' /></button>

                </div> : <div className='no-search-result'>No Search Result</div>}
            </div> : <></>}
            <h4 class="section-title">Some Top Developer Jobs</h4>
            {Object.keys(developer).length != 0 ? <>

              <button className="dev-custom-prev"><MoveLeft color='white' /></button>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={3}
                navigation={{
                  nextEl: '.dev-custom-next',
                  prevEl: '.dev-custom-prev'
                }}
                pagination={{ clickable: true }}
                style={{ padding: '20px' }}
              >
                {developer.map((job, index) => {
                  return (
                    <SwiperSlide>
                      <div className='job-card-2'>
                        <div>
                          <span className='job-header'>{job.company}</span>

                          <span className='job-title'>{job.title}</span>
                          {job.fixedSalary ? <p className='job-footer'>₹{job.fixedSalary}</p> : <p className='job-footer'>₹{job.salaryFrom}-₹{job.salaryTo}</p>}
                          <p className='job-stats'>Location : {job.location}</p>
                          <button className='apply-btn' onClick={(e) => handleNavigation(job._id)}><span>Apply Now </span><MoveRight size={20} /></button>
                        </div>
                        <img className='job-logo' src={job.logo.url} />
                      </div>
                    </SwiperSlide>)
                })}

              </Swiper>

              <button className="dev-custom-next"><MoveRight color='white' /></button>
            </> : <></>}
          </div>
          <div className='developer-slider'>
            <h4 class="section-title">Some Top SDE Jobs</h4>
            {Object.keys(sde).length != 0 ? <>
              <button className="sde-custom-prev"><MoveLeft color='white' /></button>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={3}
                pagination={{ clickable: true }}
                style={{ padding: '20px' }}
                navigation={{
                  nextEl: '.sde-custom-next',
                  prevEl: '.sde-custom-prev'
                }}
              >
                {sde.map((job, index) => {
                  return (
                    <SwiperSlide>
                      <div className='job-card-2'>
                        <div>
                          <span className='job-header'>{job.company}</span>

                          <span className='job-title'>{job.title}</span>
                          {job.fixedSalary ? <p className='job-footer'>₹{job.fixedSalary}</p> : <p className='job-footer'>₹{job.salaryFrom}-₹{job.salaryTo}</p>}
                          <p className='job-stats'>Location : {job.location}</p>
                          <button className='apply-btn' onClick={(e) => handleNavigation(job._id)}><span>Apply Now </span><MoveRight size={20} /></button>
                        </div>
                        <img className='job-logo' src={job.logo.url} />
                      </div>
                    </SwiperSlide>)
                })}
              </Swiper>
              <button className="sde-custom-next"><MoveRight color='white' /></button>
            </>
              : <></>}

          </div>

          <div class="jobs-grid-2" id="jobs-grid">
            {jobs.map((job, index) => {
              return (
                <div className='job-card'>
                  <div>
                    <span className='job-header'>{job.company}</span>

                    <span className='job-title'>{job.title}</span>
                    {job.fixedSalary ? <p className='job-footer'>₹{job.fixedSalary}</p> : <p className='job-footer'>₹{job.salaryFrom}-₹{job.salaryTo}</p>}
                    <p className='job-stats'>Location : {job.location}</p>
                    <button className='apply-btn' onClick={(e) => handleNavigation(job._id)}><span>Apply Now </span><MoveRight size={20} /></button>
                  </div>
                  <img className='job-logo' src={job.logo.url} />
                </div>)
            })}
          </div>

        </div>
        <Footer />
      </>}


    </div>
  )
}

export default Jobs