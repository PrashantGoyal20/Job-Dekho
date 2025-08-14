import React, { useEffect, useState } from 'react'
import Footer from '../Permanent/Footer';
import Header from '../Permanent/Header';
import './chat.css'
import { Send, MessageCircle } from 'lucide-react';
import axios from 'axios'
import { useRef } from 'react';


const Chat = () => {
  // const [question, setQuestion] = useState('')
  const [ans, setAns] = useState([]);
  const [load, setLoad] = useState(true)
  const keyRef = useRef(null)
  useEffect(() => {
    const handleStartConv = async () => {
      // await axios.post('http://localhost:3000/chat/start-chat', { start: "start" },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     withCredentials: true,
      //   }
      // )
    }
    setTimeout(() => {
      setAns(prev => [{ role: 'assistant', content: "Hello, How may I help you today....." }])

    }, 1000)

    handleStartConv()
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('chatMessages');
    if (saved) setAns(JSON.parse(saved));
  }, []);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleClearandSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMOuseClick = (e) => {
    e.preventDefault()
    handleClearandSubmit()
  }
  const handleClear = async () => {

    if (!keyRef.current.innerText.trim()) return;
    setAns(prev => [...prev, { role: 'user', content: `${keyRef.current.innerText}` }])
    localStorage.setItem('chatMessages', JSON.stringify(ans));
    console.log('messages saved')
    let ques = keyRef.current.innerText
    console.log(ques)
    return ques;

  }

  const handleClearandSubmit = async () => {
    let ques = await handleClear()
    if (ques.length == 0) return
    keyRef.current.innerText = ''
    console.log(ques)
    handleSubmit(ques)
  }
  const handleSubmit = async (ques) => {
    try {

      await axios.post("http://localhost:3000/chat/question",
        { "query": ques }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }).then((res) => {
        console.log(res)
        setAns(prev => [...prev, { role: 'assistant', content: `${res.data.ans}` }])
      })
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      <Header />
      <div className='chat-container' >
        <div className='ans-container'>
          {ans.map((msg, index) => (
            <div key={index}>
              {msg.role == 'assistant' ? <>
                <div className='assistant-msg'>
                  <span>{msg.content}</span>
                </div>
              </> : <>
                <div className='user-msg'>
                  <span>{msg.content}</span>
                </div>
              </>}
            </div>
          ))}
        </div>
        <div className='ques-container'>
          <div className="question" ref={keyRef} contentEditable="true" suppressContentEditableWarning="true" ></div>
          <button type='submit' onClick={handleMOuseClick}><Send color='white' /></button>
        </div>
      </div>


      <Footer />
    </>
  )
}

export default Chat