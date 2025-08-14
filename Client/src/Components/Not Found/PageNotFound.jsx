import React from 'react'
import { Link } from 'react-router-dom'
import "./pageNotFound.css"

const PageNotFound = () => {
  return (
    <div className='wrapper'>
      <div className='errCont'>
        <div className='logoCont'>
          <Link to='/'><img className='logoCont-img1' src="./JOb DEKHO -white_without_heading.png" alt='LOGO' /><img src='./job dekho title.png'/></Link>
        </div>
        <div className='errBag'>
          <div className='errName'><img src='https://static.naukimg.com/ServerErrors/web/images/resErrCnt.png'/></div>
          <div className='errDes'>
          Error <span>404!</span> Page Not Found...
          </div>
          <div className='errDetail'>
          Sorry, it appears the page you were looking for doesn't exist anymore or might have been moved.
          The site administrator has been notified.
          </div>
        </div>
        <div className='home'>
          <Link to='/'><img className="homeImg" src='https://static.naukimg.com/ServerErrors/web/images/errIc.png'/> <span>HOME</span></Link>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound