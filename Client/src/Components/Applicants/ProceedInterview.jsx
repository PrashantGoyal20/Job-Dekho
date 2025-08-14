import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Loader from '../Permanent/Loader'
import "./proceedInterview.css"
import { Link } from 'react-router-dom'

const ProceedInterview = () => {
  const location = useLocation()
  const [ques, setQues] = useState([])
  const [index, setIndex] = useState(0)
  const [timer, setTimer] = useState(60)
  const [load, setLoad] = useState(true)
  const [selected, setSelected] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [ans, setAns] = useState(0);


  const optionRef = useRef()


  useEffect(() => {
    const handleQuestion = async () => {
      await axios.get(`http://localhost:3000/job/getQuestion${location.search}`

      ).then(ques=>{
      setQues(ques.data.question)

      setLoad(false)
      }
      ).catch(err => console.error(err));

    }
    handleQuestion()


  }, [])

  const handleClick = (optionText) => {
    if (selected) return;

    setSelected(optionText);
    const correct = ques[index].correctAns;
    setIsCorrect(optionText === correct);
    if (optionText === correct) setAns(prev => prev + 1)
    setTimeout(() => goToNextQuestion(), 5000)

  }


  useEffect(() => {
    if (ques.length === 0) return;
    if (index === ques.length) return (
      <>
        <div>
          {ans}/{ques.length}
        </div>
      </>
    );
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          goToNextQuestion();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);

  }, [ques, index])

  const goToNextQuestion = () => {
    setSelected(null);
    setIsCorrect(null);
    setIndex(prev => (prev + 1));
    setTimer(60);
  };


  return (
    <>
      {load ? <Loader />
        :
        <>
          {index < ques.length ? <><div className='proceed-interview-container'>
            <div className='interview-time'>
              <span>{timer}</span>
            </div>
            <div className='interview-ques-container'>
              <div className='interview-ques'>

                {ques[index].question}
              </div>
              <div className='option-container'>
                {ques[index].option.map((opt, i) => {


                  const isSelected = selected === opt;
                  const isCorrectAns = opt === ques[index].correctAns;

                  let bgColor = "#f0f0f0";
                  let span = "4px solid rgb(37, 136, 7)"
                  let color = "rgb(24, 160, 3)"
                  if (selected) {
                    if (isSelected && isCorrectAns) {
                      bgColor = "#c8f7c5"
                      span = "4px solid rgb(37, 136, 7)"
                      color = "rgb(46, 132, 6)"
                    } 
                    else if (isSelected && !isCorrectAns) {
                      bgColor = "#f7c5c5"
                      span = "4px solid rgb(239, 9, 7)"
                      color = "rgb(239, 6, 6)"

                    } 
                    else if (isCorrectAns) {
                      bgColor = "#c8f7c5"
                      span = "4px solid rgb(37, 136, 7)"
                      color = "rgb(6, 141, 29)"
                    }
                  }

                  return (
                    <div key={i} className='interview-option' ref={optionRef} onClick={() => handleClick(opt)} style={{ backgroundColor: bgColor, cursor: selected ? "not-allowed" : "pointer" }}>
                      <span style={{ border: span, color: color }}>{i + 1}</span>
                      {opt}
                    </div>
                  )
                })}

              </div>
            </div>
          </div></> : <>
            <div className='interview-ans-container'>
              <span>{ans} answers correct out of {ques.length}</span>
              {ans==ques.length?<p>Excellent!! You are ready for your Interviews 🥳🥳</p>:<>
                {ans>.75*ques.length?<p>Good !!! But can still do better 😉😉</p>:<p>Please go through your concepts again before interview 😟😟</p>}
              </>}
              <Link to='/'> Back To Home</Link>
            </div>
          </>}
        </>}

    </>

  )
}

export default ProceedInterview

