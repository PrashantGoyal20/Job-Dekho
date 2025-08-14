
import './App.css'
import { useContext,useEffect } from 'react'
import { Context } from './main'
import Header from './Components/Permanent/Header.jsx'
import Footer from './Components/Permanent/Footer.jsx'
import Login from './Components/Forms/Login.jsx'
import Register from './Components/Forms/Register.jsx'
import JobDetails from './Components/Jobs/JobDetails.jsx'
import Jobs from './Components/Jobs/Jobs.jsx'
import Homepage from './Components/Home/Homepage.jsx'
import PageNotFound from './Components/Not Found/PageNotFound.jsx'
import {Toaster} from 'react-hot-toast'
import axios from 'axios'
import {Routes,Route,BrowserRouter} from 'react-router-dom'
import Applicant from './Components/Applicants/Applicant.jsx'
import PostJobs from './Components/Jobs/PostJobs.jsx'
import MyJobs from './Components/Jobs/MyJobs.jsx'
import ViewApplication from './Components/Applicants/ViewApplication.jsx'
import Company from './Components/Permanent/Company.jsx'
import Services from './Components/Permanent/Services.jsx'
import Intreview from './Components/Applicants/Intreview.jsx'
import ProceedInterview from './Components/Applicants/ProceedInterview.jsx'
import Chat from './Components/Chat/Chat.jsx'
import MyJobDetails from './Components/Jobs/MyJobDetails.jsx'
import Application from './Components/Applicants/Application.jsx'
import ViewOurApplicants from './Components/Jobs/ViewOurApplicants.jsx'
import RoomInitiator from './Components/Applicants/Messaging/RoomInitiator.jsx'
import FurtherQuery from './Components/Forms/FurtherQuery.jsx'
import Favourites from './Components/Applicants/Favourites.jsx'
import SavedJobs from './Components/Jobs/SavedJobs.jsx'
import ApplicationDetails from './Components/Applicants/ApplicationDetails.jsx'

function App() {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/getuser`,{
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);


  return (
    <div className='body'>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<Homepage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/registeration/proceed' element={<FurtherQuery/>}/>
          <Route path='/applyApplicants/:id' element={<Applicant/>}/>
          <Route path='/viewApplication' element={<ViewApplication/>}/>    
          <Route path='/viewApplication/:index' element={<Application/>}/> 
          <Route path='/viewOurApplicant/:id' element={<ViewOurApplicants/>}/>
          <Route path='/start-interview/:prev/:id' element={<RoomInitiator/>}/>
          <Route path='/applicationDetails/:id' element={<ApplicationDetails/>}/>
          <Route path='/allJobs' element={<Jobs/>}/>
          <Route path='/myJobs' element={<MyJobs/>}/>
          <Route path='/myJobDetails/:id' element={<MyJobDetails/>}/>
          <Route path='/jobDetails/:id' element={<JobDetails/>}/>
          <Route path='/savedJobs' element={<SavedJobs/>}/>
          <Route path='/chat' element={<Chat/>}/>
          <Route path='/favourites' element={<Favourites/>}/>
          <Route path='/postJobs' element={<PostJobs/>}/>
          <Route path='/company' element={<Company/>}/>
          <Route path='/services' element={<Services/>}/>
          <Route path='/interview' element={<Intreview/>}/>
          <Route path='/proceed-interview' element={<ProceedInterview/>}/>

          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
        <Toaster/>
      </BrowserRouter> 
    </div>
  )
}

export default App
