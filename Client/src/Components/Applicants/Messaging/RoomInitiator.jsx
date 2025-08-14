import React from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import Header from '../../Permanent/Header'
import Footer from '../../Permanent/Footer'
import { useState } from 'react'
import axios from "axios"
import { useNavigate, useParams } from 'react-router-dom'
import { Star,User,ArrowRight } from 'lucide-react';
import Loader from '../../Permanent/Loader'
import './roominitiator.css'

const RoomInitiator = () => {
  const [room,setRoom] =useState('')
  const [name,setName]=useState('')
  const [tokenData, setTokenData] = useState(null);
  const [url,setUrl]=useState(null)
  const {id,prev}=useParams()
  const [load,setLoad]=useState(false)
  const navigate=useNavigate()

  const initiateRoom=async()=>{
    // if(!name || !room) return;
    setLoad(true)
    await axios.post(`http://localhost:3000/get-token/${id}`,{room,name,isApplicant:false}, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }).then((res)=>{
        setTokenData(res.data.token)
        setUrl(res.data.url)
        setLoad(false)
      })
  }

  const handleNavigation=async()=>{
    await axios.get(`http://localhost:3000/meet-finished/${id}`).then((res)=>{
            navigate(`/viewOurApplicant/${prev}`)

      })
  }
  
  return (
    <div>
    {load?<Loader/>:tokenData?<>
      <LiveKitRoom
      token={tokenData}
      serverUrl={url}
      connect
      onDisconnected={handleNavigation}
      style={{ height: '100vh', background: 'black', color: "white",overflow:"hidden" }}
    >
      <VideoConference />
    </LiveKitRoom>
    </>:<>
      <Header/>
      <div className='form-container-2'>
      <div className="form-card-2">
        <div className="form-header">
          <h2>Create Room</h2>
        </div>

        <div className="auth-form">
            <div className="input-group">
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  name="firstName"
                  value={room}
                  onChange={(e)=>setRoom(e.target.value)}
                  placeholder="Name"
                  className="form-input"
                  required
                />
              </div>
            </div>

          <div className="input-group">
            <div className="input-wrapper">
              <Star className="input-icon" />
              <input
                type="text"
                name="text"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder="Room Name"
                className="form-input"
                required
              />
            </div>
          </div>

          <button onClick={initiateRoom} className="submit-btn signup">
            <span>Start Interview</span>
            <ArrowRight className="btn-icon" />

          </button>
          

          
        </div>

      </div>
      </div>
      <Footer/>
      </>}
    
    </div>
  )
}

export default RoomInitiator