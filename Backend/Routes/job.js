import express from "express";
import { addFavourite, deleteFavourite, deleteJob, deleteSavedJob, getAllFav, getAllJobs, getAllSaved, getMyJobs, getSingleJob, postJobs, questionGen, saveJob, searchJobs } from "../Controller/job.js";
import { isAuthenticated } from "../Middleware/auth.js";
import { getAllApplicants } from "../Controller/applicant.js";

const router =express.Router();

router.get('/getAllJobs',getAllJobs);
router.get('/searchJob',searchJobs)
router.get('/getAllSaved',isAuthenticated,getAllSaved)
router.get('/saveJob/:id',isAuthenticated,saveJob)
router.get('/deleteSavedJob/:id',isAuthenticated,deleteSavedJob)
router.get('/getMyJobs',isAuthenticated,getMyJobs)
router.get('/jobDetails/:id',isAuthenticated,getSingleJob)
router.post('/postJobs',isAuthenticated,postJobs);
router.get('/deleteJob/:id',isAuthenticated,deleteJob);
router.get('/getQuestion',questionGen)
router.post('/addFav/:id',isAuthenticated,addFavourite)
router.post('/deleteFav/:id',isAuthenticated,deleteFavourite)
router.get('/getAllFavourites',isAuthenticated,getAllFav)

export default router;