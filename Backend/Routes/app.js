import express from "express";
import { isAuthenticated } from "../Middleware/auth.js";
import {getAllApplicants,postApplication,viewOurApplication,deleteOurApplication,findEmployer, changeStatus, applicationDetails} from "../Controller/applicant.js"

const router =express.Router();

router.get('/employer/getAll/:id',isAuthenticated,getAllApplicants);
router.get('/employee/viewApplication',isAuthenticated,viewOurApplication);
router.post('/changeStatus/:id',changeStatus)
router.get('/findemployer/:id',isAuthenticated,findEmployer);
router.post('/postApplication',isAuthenticated,postApplication);
router.get('/applicationDetails/:id',isAuthenticated,applicationDetails)
router.delete('/deleteApplication/:id',isAuthenticated,deleteOurApplication);

export default router;