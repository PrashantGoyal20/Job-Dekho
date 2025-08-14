import React, { useState } from 'react'
import "./postjobs.css"
import { Upload, MapPin, IndianRupee, Clock, Users, Briefcase, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../main'
import Header from '../Permanent/Header';
import Footer from '../Permanent/Footer';
import { useRef } from 'react';

const PostJobs = () => {
  const server=import.meta.env.VITE_APP_SERVER
  const [company,setCompany]=useState('')
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [exp,setExp]=useState('')
  const [salary, setSalary] = useState("");
  const [requirements,setRequirements]=useState('')
  const [benefits,setBenefits]=useState('')
  const [contactEmail,setContactEmail]=useState('')
  const [applicationDeadline,setApplicationDeadline]=useState('')
  const navigate = useNavigate();
  const { isAuthorized, user } = useContext(Context);
  const [preview, setPreview] = useState(null)
  const [photo, setPhoto] = useState(null)
  const imageRef = useRef()
  const errorRef=useRef()

  if (!isAuthorized || (user && user.role !== "Job Manager")) {
      return navigate("/login");

  }

  const handleImage = () => {
    imageRef.current.click()
  }
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(photo+" "+company+ " " +title+ " " +description+ " " +category+ " " +location+ " " + exp+ " " +applicationDeadline+" " +requirements+ " " +contactEmail+ " " +benefits)
    if(!photo || !company || !title || !description|| !category || !location || !exp || !applicationDeadline || !requirements || !contactEmail || !benefits){
        errorRef.current.classList.replace("registeration-error-hidden","registeration-error")
        setTimeout(()=>errorRef.current.classList.replace("registeration-error","registeration-error-hidden"),5000)
        return
    }

    const formData = new FormData();
    formData.append("company", company);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("experience", exp);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("salary", salary);
    formData.append("logo", photo);
    formData.append("applicationDeadline" , applicationDeadline);
    formData.append("requirements",requirements)
    formData.append("contactEmail",contactEmail )
    formData.append("benefits",benefits)
  
    console.log(formData)
    await axios
      .post(
        `${server}/job/postJobs`,formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }

      )
      .then((res) => {
        toast.success(res.data.message);
        navigate("/allJobs")
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  


  return (
    <>
      <Header />
      <div className='container'>
      <span ref={errorRef} className='registeration-error-hidden'>Error in Posting</span>
      <header className='header'>
        <div className='headerContent'>
          <h1 className='headerTitle'>Create Job Posting</h1>
          <p className='headerSubtitle'>Post your job and find the perfect candidate</p>
        </div>
      </header>

      <div className='mainContent'>
        <form onSubmit={handleSubmit} className='form'>
          <div className='formSection companySectionHover'>
            <h2 className='sectionTitle'>
              <Briefcase size={20} className='icon' />
              Company Information
            </h2>
            
            <div className='formGrid'>
              <div className='logoUploadSection'>
                <label className='formLabel'>Company Logo</label>
                <div className='logoUploadContainer'>
                  <div className='logoUploadBox' onClick={handleImage}>
                    {preview ? (
                      <img
                        src={preview}
                        alt="Company Logo"
                        className='logoPreview'
                      />
                    ) : (
                      <Upload size={32} className='uploadIcon' />
                    )}
                    <input
                      type="file"
                      ref={imageRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className='hiddenInput'
                      id="logo-upload"
                    />
                  </div>
                  <div>
                    <p className='uploadText'>Upload your company logo</p>
                    <p className='uploadSubtext'>PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              <div className='formGroup'>
                <label className='formLabel'>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={company}
                  onChange={(e)=>setCompany(e.target.value)}
                  className='formInput'
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={contactEmail}
                  onChange={(e)=>setContactEmail(e.target.value)}
                  className='formInput'
                  placeholder="hr@company.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className='formSection jobDetailsSectionHover'>
            <h2 className='sectionTitle' >
              <Users size={20} className='iconPurple' />
              Job Details
            </h2>
            
            <div className='formGrid'>
              <div className='formGroup'>
                <label className='formLabel'>Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={title}
                  onChange={(e)=>setTitle(e.target.value)}
                  className='formInput'
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>
                  <MapPin size={16} className='smallIcon' />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={location}
                  onChange={(e)=>setLocation(e.target.value)}
                  className='formInput'
                  placeholder="e.g. San Francisco, CA"
                  required
                />
              </div>

            <div className='formGroup'>
                <label className='formLabel'>
                  <IndianRupee size={16} className='smallIcon' />
                  Salary 
                </label>
                <input
                  type="text"
                  name="salary"
                  value={salary}
                  onChange={(e)=>setSalary(e.target.value)}
                  className='formInput'
                  placeholder="e.g. $80,000 - $120,000"
                  required
                />
              </div>
              

              <div className='formGroup'>
                <label className='formLabel'>
                  <Clock size={16} className='smallIcon' />
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={category}
                  onChange={(e)=>setCategory(e.target.value)}
                  className='formInput'
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className='formGroup'>
                <label className='formLabel'>Experience Level</label>
                <input
                  type="text"
                  name="experience"
                  value={exp}
                  onChange={(e)=>setExp(e.target.value)}
                  className='formInput'
                  placeholder="e.g. 3-5 years"
                  required
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>
                  <Calendar size={16} className='smallIcon' />
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={applicationDeadline}
                  onChange={(e)=>setApplicationDeadline(e.target.value)}
                  className='formInput'
                  required
                />
              </div>
            </div>
          </div>

          <div className='formSection descriptionSectionHover'>
            <h2 className='sectionTitleGreen'>Job Description & Requirements</h2>
            
            <div className='descriptionContent'>
              <div className='formGroup'>
                <label className='formLabel'>Job Description</label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e)=>setDescription(e.target.value)}
                  rows="8"
                  className='formTextarea'
                  placeholder="Provide a detailed description of the role, responsibilities, and what the ideal candidate will be doing..."
                  required
                />
                <div className='characterCount'>
                  {description.length} characters
                </div>
              </div>

              <div className='formGroup'>
                <label className='formLabel'>Requirements & Qualifications</label>
                <textarea
                  name="requirements"
                  value={requirements}
                  onChange={(e)=>setRequirements(e.target.value)}
                  rows="6"
                  className='formTextarea'
                  placeholder="List the required skills, qualifications, education, and experience..."
                  required
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>Benefits & Perks</label>
                <textarea
                  name="benefits"
                  value={benefits}
                  onChange={(e)=>setBenefits(e.target.value)}
                  rows="4"
                  className='formTextarea'
                  placeholder="Describe the benefits, perks, and what makes your company a great place to work..."
                />
              </div>
            </div>
          </div>

          <div className='submitSection'>
            <button
              type="submit"
              className='submitBtn'
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.background = 'linear-gradient(135deg, #1d4ed8, #6d28d9)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'linear-gradient(135deg, #2563eb, #7c3aed)';
              }}
            >
              Post Job Opening
            </button>
          </div>
        </form>

      </div>
    </div>
      <Footer />
    </>
  )
}

export default PostJobs