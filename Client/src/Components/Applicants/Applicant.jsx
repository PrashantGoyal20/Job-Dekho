import React, { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "./applicant.css"
import { Upload, User, Mail, Phone, MapPin, Calendar, FileText, Link, Award, Briefcase ,Plus} from 'lucide-react';
import { Context } from '../../main';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../Permanent/Header';
import Footer from '../Permanent/Footer';
import Loader from '../Permanent/Loader';

const Applicant = () => {
  const google=import.meta.env.VITE_APP_GOOGLE
  const server=import.meta.env.VITE_APP_SERVER
  const { user, isAuthorized } = useContext(Context)
  const [profile,setProfile]=useState('')
  const profileRef=useRef(null)
  const [profilepreview,setProfilepreview]=useState(null)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city,setCity]=useState('')
  const [pincode,setPincode]=useState('')
  const [state,setState]=useState('')
  const [employer, setEmployer] = useState([]);
  const [resume, setResume] = useState(null);
  const [linkedinUrl,setLinkedinUrl]=useState('')
  const [portfolioUrl,setPortfolioUrl]=useState('')
  const [expectedSalary,setExpectedSalary]=useState('')
  const [availableStartDate,setAvailableStartDate]=useState('')
  const [exp,setExp]=useState('')
  const [whyInterested,setWhyInterested]=useState('')
  const [experience,setExperience]=useState([{company:"",period:"",details:""}])
  const [project,setProject]=useState([{projectName:"",projectDetails:"",projectTime:""}])
  const navigate = useNavigate();
  const { id } = useParams()
  const resumeRef = useRef()
  const [preview, setPreview] = useState(null)
  const [load, setLoad] = useState(true)

  const profileChange=()=>{
  profileRef.current.click()
  }

  const addProject=(index,name,value)=>{
      const update=[...project]    
      update[index][name]=value
      setProject(update)
  }

  const addNewProject=()=>{
    setProject([...project,{projectName:"",projectDetails:"",projectTime:""}])
  }

  const addExp=(index,name,value)=>{
      const update=[...experience]
      update[index][name]=value
      setExperience(update)
  }

  const addNewExp=()=>{
    setExperience([...experience,{company:"",period:"",details:""}])
  }

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilepreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  const handleResumeChange=()=>{
    resumeRef.current.click()
  }

  const handleFileChange = (e) => {

    const file = e.target.files[0];
    if (file) {
      setResume(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      console.log(preview)
      reader.readAsDataURL(file);
    }
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(project),JSON.stringify(experience))
    const formData = new FormData();
    formData.append('profile',profile)
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append('state',state);
    formData.append('city',city);
    formData.append('experience',JSON.stringify(experience));
    formData.append('linkedinUrl',linkedinUrl);
    formData.append('portfolioUrl',portfolioUrl);
    formData.append('expectedSalary',expectedSalary);
    formData.append('exp',exp)
    formData.append('projects',JSON.stringify(project))
    formData.append('availableStartDate',availableStartDate)
    formData.append('whyInterested',whyInterested);
    formData.append("coverLetter", coverLetter);
    formData.append('pincode',pincode)
    formData.append("resume", resume);
    formData.append("jobId", id);
    formData.append("employerName", employer.company);

    try {
      const stringexp=JSON.stringify(experience)
      const stringproject=JSON.stringify(project)
      const { data } = await axios.post(`${server}/app/postApplication`,
        {profile,name,email,phone ,address,state,city,experience:stringexp,linkedinUrl,portfolioUrl,expectedSalary,exp,project:stringproject,availableStartDate,whyInterested,coverLetter,pincode,resume,jobId: id,employerName: employer.company},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume("");
      toast.success(data.message);
      navigate("/allJobs");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthorized || (user && user.role === "Job Manager")) {
    navigate("/login");
  }
  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        await axios.get(`${server}/app/findemployer/${id}`, {
          withCredentials: true,
        }).then((res) => {
          setEmployer(res.data.job);
          setLoad(false)
        })
      } catch (error) {
        console.log(error);
      }
    }
    fetchEmployer();
  }, []);



  return (
    <div>
      {load ? <Loader /> : <>
        <Header />

        <div className='container'>
      <header className='header'>
        <div className='headerContent'>
          <h1 className='headerTitle'>Job Application</h1>
          <p className='headerSubtitle'>Apply for your dream position</p>
        </div>
      </header>

      <div className='mainContent'>
        <div className='jobBanner'>
          <div className='jobInfo'>
            <h2 className='jobTitle'>{employer.title}</h2>
            <p className='companyName'>{employer.company}</p>
            <div className='jobDetails'>
              <span className='jobDetail'>
                <MapPin size={16} />
                {employer.location}
              </span>
              <span className='jobDetail'>
                <Briefcase size={16} />
                {employer.category}
              </span>
              <span className='jobBadge'>{employer.salary}</span>
            </div>
          </div>
        </div>

        <div className='form'>
          <div className='formSection personalSectionHover'>
            <h2 className='sectionTitle'>
              <User size={20} className='iconBlue' />
              Personal Information
            </h2>
            
            <div className='formGrid'>
              <div className='photoUploadSection'>
                <label className='formLabel'>Profile Photo (Optional)</label>
                <div className='photoUploadContainer' >
                  <div className='photoUploadBox' onClick={profileChange} >
                    {profilepreview ? (
                      <img
                        src={profilepreview}
                        alt="Profile"
                        className='photoPreview'
                      />
                    ) : (
                      <User size={32} className='uploadIcon' />
                    )}
                    <input
                    ref={profileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className='hiddenInput'
                      id="photo-upload"
                    />
                  </div>
                  <div>
                    <p className='uploadText'>Upload your profile photo</p>
                    <p className='uploadSubtext'>PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              <div className='formGroup'>
                <label className='formLabel'>Full Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className='formInput'
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>
                  <Mail size={16} className='smallIcon' />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className='formInput'
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>
                  <Phone size={16} className='smallIcon' />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(e)=>setPhone(e.target.value)}
                  className='formInput'
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>Address</label>
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={(e)=>setAddress(e.target.value)}
                  className='formInput'
                  placeholder="Street address"
                  required
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>City</label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e)=>setCity(e.target.value)}
                  className='formInput'
                  placeholder="City"
                  required
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>State</label>
                <input
                  type="text"
                  name="state"
                  value={state}
                  onChange={(e)=>setState(e.target.value)}
                  className='formInput'
                  placeholder="State"
                  required
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>PIN Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={pincode}
                  onChange={(e)=>setPincode(e.target.value)}
                  className='formInput'
                  placeholder="12345"
                  required
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>Years of Experience in Current Field</label>
                <input
                  type="text"
                  name="zipCode"
                  value={exp}
                  onChange={(e)=>setExp(e.target.value)}
                  className='formInput'
                  placeholder="12345"
                  required
                />
              </div>
            </div>
          </div>

          <div className='formSection professionalSectionHover'>
            <h2 className='sectionTitle'>
              <Award size={20} className='iconPurple' />
              Professional Information
            </h2>
            
            <div className='formGrid'>
              <div className='resumeUploadSection'>
                <label className='formLabel'>
                  <FileText size={16} className='smallIcon' />
                  Resume/CV
                </label>
                <div className='resumeUploadContainer'>
                  <div className='resumeUploadBox' onClick={handleResumeChange}>
                    {preview ? (
                      <div className='resumePreview'>
                        <FileText size={24} className='fileIcon' />
                        <span className='fileName'>{resume.name}</span>
                      </div>
                    ) : (
                      <div className='uploadPlaceholder'>
                        <Upload size={32} className='uploadIcon' />
                        <span className='uploadText'>Click to upload resume</span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={resumeRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className='hiddenInput'
                      id="resume-upload"
                    />
                  </div>
                  <p className='uploadSubtext'>PNG,JPG,WEBRP up to 10MB</p>
                </div>
              </div>

              <div className='formGroup'>
                <label className='formLabel'>
                  <Link size={16} className='smallIcon' />
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={linkedinUrl}
                  onChange={(e)=>setLinkedinUrl(e.target.value)}
                  className='formInput'
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>
                  <Link size={16} className='smallIcon' />
                  Portfolio/Website
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={portfolioUrl}
                  onChange={(e)=>setPortfolioUrl(e.target.value)}
                  className='formInput'
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>Expected Salary</label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={expectedSalary}
                  onChange={(e)=>setExpectedSalary(e.target.value)}
                  className='formInput'
                  placeholder="e.g. $120,000"
                />
              </div>

              <div className='formGroup'>
                <label className='formLabel'>
                  <Calendar size={16} className='smallIcon' />
                  Available Start Date
                </label>
                <input
                  type="date"
                  name="availableStartDate"
                  value={availableStartDate}
                  onChange={(e)=>setAvailableStartDate(e.target.value)}
                  className='formInput'
                  required
                />
              </div>


              
            </div>
          </div>

          
          <div className='formSection essaySectionHover'>
            <h2 className='sectionTitleGreen'>Application Essays</h2>
            
            <div className='essayContent'>
              <div className='formGroup'>
                <label className='formLabel'>Cover Letter</label>
                <div className="formTextarea" contentEditable="true" suppressContentEditableWarning="true" onInput={(e) => setCoverLetter(e.target.innerText)}></div>
                <div className='characterCount'>
                  {coverLetter.length} characters
                </div>
              </div>

              <div className='formGroup'>
                <label className='formLabel'>Why are you interested in this position?</label>
                <div className="formTextarea" contentEditable="true" suppressContentEditableWarning="true" onInput={(e) => setWhyInterested(e.target.innerText)}></div>

              </div>

              <div className='formGroup'>
                <label className='formLabel'>Relevant Experience</label>
                {experience.map((data,index)=>(
                  <div key={index}>
                  
                  <div className='formGroup' style={{marginTop:"20px"}}>
                <label className='formLabel'>Company Name</label>
                    <input type="text" className='formInput' value={data.company} onChange={(e)=>addExp(index,"company",e.target.value)} placeholder='eg : Microsoft / Google'/>
                    </div>
                    <div className='formGroup'>
                <label className='formLabel'>Years of Exp</label>
                    <input type='text' className='formInput' value={data.period} onChange={(e)=>addExp(index,"period",e.target.value)} placeholder='eg : Nov 2024- Dec 2024'/>
                    </div>
                    <div className='formGroup'>
                <label className='formLabel'>Details</label>
                    <textarea rows="5"  className="formTextarea" value={data.details} onChange={(e)=>addExp(index,"details",e.target.value)} placeholder='Write details of your experience in this company'/>
                    </div>
                  </div>

                ))}
                <button className='add-exp'  onClick={addNewExp}><Plus size={20} color='white'/></button>

              </div>

              
            </div>
            
          </div>

          <div className='formSection essaySectionHover'>
            <h2 className='sectionTitleGreen'>Personal Projects</h2>
            
            <div className='essayContent'>
              
              <div className='formGroup'>
                {project.map((data,index)=>(
                  <div key={index}>
                  
                  <div className='formGroup' style={{marginTop:"20px"}}>
                <label className='formLabel'>Project Name</label>
                    <input type='text' className='formInput' value={data.projectName} onChange={(e)=>addProject(index,"projectName",e.target.value)} placeholder='A suitable name that defines your project'/>
                    </div>
                    <div className='formGroup'>
                <label className='formLabel'>Project Timeline</label>
                    <input type='text' className='formInput' value={data.projectTime} onChange={(e)=>addProject(index,"projectTime",e.target.value)} placeholder='eg : Nov 2024- Dec 2024'/>
                    </div>
                    <div className='formGroup'>
                <label className='formLabel'>Details</label>
                    <textarea rows="5"  className="formTextarea" value={data.projectDetails} onChange={(e)=>addProject(index,"projectDetails",e.target.value)} placeholder='Write details of your project'/>
                    </div>
                  </div>

                ))}
                <button className='add-exp'  onClick={addNewProject}><Plus size={20} color='white'/></button>

              </div>

              
            </div>
            
          </div>

          <div className='submitSection'>
            <button
              type="button"
              onClick={handleApplication}
              className='applicant-submitBtn'
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.background = 'linear-gradient(135deg, #059669, #047857)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'linear-gradient(135deg, #10b981, #059669)';
              }}
            >
              Submit Application
            </button>
          </div>
        </div>

       
      </div>
    </div>
        <Footer />

      </>}

    </div>
  )
}

export default Applicant