import React, { useState, useRef,useContext, useEffect } from 'react'
import Header from '../Permanent/Header'
import Footer from '../Permanent/Footer'
import "./interview.css"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Context } from '../../main';


const Intreview = () => {

    const [topics, setTopics] = useState(['']);
    const error_ref = useRef()
    const navigate=useNavigate()
    const params=new useSearchParams()
    const {isAuthorized}=useContext(Context)

    const handleChange = (index, value) => {
        const update = [...topics]
        update[index] = value
        setTopics(update)

    }
    const addPair = () => {
        setTopics([...topics, ''])
        error_ref.current.className = 'interview-error-hidden'
    }
    const deleteTopic = () => {
        if (Object.keys(topics).length == 1 ) {
            error_ref.current.classList.replace('interview-error-hidden', 'interview-error-visible')
            return
        }
        else {
            error_ref.current.className = 'interview-error-hidden'
            setTopics(prev => prev.slice(0, -1))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (topics[0]=="" && Object.keys(topics).length == 1) {
            error_ref.current.classList.replace('interview-error-hidden', 'interview-error-visible')
            return
        }
        const query=topics.map(topic => `topics=${encodeURIComponent(topic)}`).join("&")
        navigate(`/proceed-interview?${query}`)
    }
    useEffect(()=>{
        // if(!isAuthorized) navigate('/login')
    },[])

    
    return (
        
        <><Header />
            <div className='interview-container'>
                <div className='interview-heading'>Welcome to <span style={{ color: "#38b6ff" }}>Job</span> <span style={{ color: "#ffbb1c" }}>Dekho</span> Technical Interviews</div>
                <div className='interview-heading-2'>
                    Please select the topics for your technical interview
                </div>
                {topics.map((topic, index) => (
                    <select   value={topic} onChange={(e) => handleChange(index, e.target.value)} >
                        <option></option>
                        <option>Data Structures</option>
                        <option>Algorithms</option>
                        <option>Operating Systems</option>
                        <option>Computer Networks</option>
                        <option>Database Management Systems (DBMS)</option>
                        <option>Object-Oriented Programming (OOP)</option>
                        <option>Software Engineering</option>
                        <option>Design Patterns</option>
                        <option>System Design</option>
                        <option>Compiler Design</option>
                        <option>Theory of Computation</option>
                        <option>Distributed Systems</option>
                        <option>Web Development</option>
                        <option>Frontend Development</option>
                        <option>Backend Development</option>
                        <option>Full Stack Development</option>
                        <option>Mobile App Development</option>
                        <option>Android Development</option>
                        <option>iOS Development</option>
                        <option>Game Development</option>
                        <option>Cross-platform Development</option>
                        <option>Desktop Application Development</option>
                        <option>Java</option>
                        <option>Python</option>
                        <option>JavaScript</option>
                        <option>C++</option>
                        <option>C</option>
                        <option>TypeScript</option>
                        <option>Go</option>
                        <option>Rust</option>
                        <option>Kotlin</option>
                        <option>Dart</option>
                        <option>Machine Learning</option>
                        <option>Deep Learning</option>
                        <option>Artificial Intelligence</option>
                        <option>Computer Vision</option>
                        <option>Natural Language Processing (NLP)</option>
                        <option>Data Science</option>
                        <option>Data Analysis</option>
                        <option>Data Engineering</option>
                        <option>Business Intelligence (BI)</option>
                        <option>Big Data</option>
                        <option>Time Series Analysis</option>
                        <option>DevOps</option>
                        <option>Cloud Computing</option>
                        <option>Amazon Web Services (AWS)</option>
                        <option>Microsoft Azure</option>
                        <option>Google Cloud Platform (GCP)</option>
                        <option>Docker</option>
                        <option>Kubernetes</option>
                        <option>CI/CD Pipelines</option>
                        <option>Infrastructure as Code (IaC)</option>
                        <option>Linux System Administration</option>
                        <option>Web Technologies</option>
                        <option>RESTful APIs</option>
                        <option>GraphQL</option>
                        <option>Web Security</option>
                        <option>HTTP/HTTPS Protocols</option>
                        <option>Progressive Web Apps (PWAs)</option>
                        <option>Cybersecurity</option>
                        <option>Ethical Hacking</option>
                        <option>Network Security</option>
                        <option>Information Security</option>
                        <option>Application Security</option>
                        <option>Cryptography</option>
                        <option>Manual Testing</option>
                        <option>Automation Testing</option>
                        <option>Unit Testing</option>
                        <option>Integration Testing</option>
                        <option>Selenium</option>
                        <option>Cypress</option>
                        <option>React.js</option>
                        <option>Angular</option>
                        <option>Vue.js</option>
                        <option>Node.js</option>
                        <option>Express.js</option>
                        <option>Django</option>
                        <option>Flask</option>
                        <option>Spring Boot</option>
                        <option>Laravel</option>
                        <option>.NET Core</option>
                        <option>Internet of Things (IoT)</option>
                        <option>Blockchain</option>
                        <option>AR/VR</option>
                        <option>Embedded Systems</option>
                        <option>Quantum Computing</option>
                        <option>Robotics</option>
                        <option>Low-Code/No-Code Platforms</option>
                        <option>API Development</option>
                        <option>Chatbot Development</option>
                        <option>SaaS Architecture</option>

                    </select>
                ))}
                <div className='interview-btn'>
                <button onClick={addPair}><AddCircleIcon style={{color:"greenyellow",fontSize:"30px"}}/></button>
                <button onClick={deleteTopic}><CancelIcon style={{color:"red",fontSize:"30px"}} /></button>
                </div>

                <div ref={error_ref} className='interview-error-hidden'>Select atleast one Topic for interview</div>

                <button className='apply-btn' type='submit' onClick={handleSubmit}> Preceed </button>

                <p>This Interview would be for around 30 min</p>
            </div>
            <Footer /></>
    )
}

export default Intreview