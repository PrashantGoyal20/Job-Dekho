import React ,{useEffect} from 'react'
import "./homepage.css"
import { Context } from '../../main';

import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const JobCompany = () => {
    

  return (
     <section class="stats-section">
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-number">50K+</div>
                <div class="stat-label">Active Jobs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">10K+</div>
                <div class="stat-label">Companies</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">1M+</div>
                <div class="stat-label">Job Seekers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">95%</div>
                <div class="stat-label">Success Rate</div>
            </div>
        </div>
    </section>

  )
}

export default JobCompany