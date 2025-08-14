import { catchAsyncErrors } from "../Middleware/catchAsyncError.js";
import ErrorHandler from "../Middleware/error.js";
import { Applicant } from "../DB/applicant.js";
import { Job } from "../DB/job.js";
import { User } from "../DB/user.js";
import cloudinary from "cloudinary"


//GET APPLICATIONS
export const getAllApplicants =async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const employer=await Job.findById(id)
    const applications = await Applicant.find({ "employerID.user": id});
    
    res.status(200).json({
      success: true,
      applications,
      employer
    });
  } catch (error) {
    console.log(error)
  }
    
};

export const changeStatus=async(req,res,next)=>{
  const {status}=req.body;
  const {id}=req.params;
  await Applicant.findByIdAndUpdate(id,{status:status},{new:true,runValidators:true})
  res.status(200).json({
    success:true
  })
}


//VIEW OUR APPLICATION
export const viewOurApplication = catchAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Manager") {
      return next(
        new ErrorHandler("Job Manager not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Applicant.find({ "applicantID.user": _id });

    var employer=[]
    let job
    for(let i=0;i<applications.length;i++){
      job=await Job.findById(applications[i].employerID.user)
      employer[i]=job
    }
    res.status(200).json({
      success: true,
      applications,
      employer
    });
});


//DELETE APPLICATION
export const deleteOurApplication = catchAsyncErrors(  async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Manager") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const application = await Applicant.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application not found!", 404));
  }
  await application.deleteOne();
  res.status(200).json({
    success: true,
    message: "Application Deleted!",
  });
});


//POST APPLICATION
export const postApplication=async (req,res,next)=>{
    const { role } = req.user;
    if (role === "Job Manager") {
      return next(
        new ErrorHandler("Job Manager not allowed to access this resource.", 400)
      );
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Resume File Required!", 400));
      }
    const {resume,profile}=req.files;
    const {name,email,coverLetter,phone,address,city,state,pincode,exp,experience,linkedinUrl,portfolioUrl,expectedSalary,availableStartDate,whyInterested,project,jobId,employerName,}=req.body;
    
    const fileFormats=['image/png', 'image/jpeg', 'image/webp']
    if(!fileFormats.includes(resume.mimetype)) {
        return next(new ErrorHandler("Invalid File Format! Please upload in .png/.jpg/.webp format", 400));
    }

    const cloud=await cloudinary.uploader.upload(resume.tempFilePath);
    if (!cloud || cloud.error){
        console.error("Clodinary Error: " , cloud.error || "Unknown cloud error");
        return next(new ErrorHandler("OOPS! Error file upload failed.", 500));
    }

    if(!fileFormats.includes(profile.mimetype)) {
        return next(new ErrorHandler("Invalid File Format! Please upload in .png/.jpg/.webp format", 400));
    }

    const profileCloud=await cloudinary.uploader.upload(profile.tempFilePath);
    if (!profileCloud || profileCloud.error){
        console.error("Clodinary Error: " , profileCloud.error || "Unknown cloud error");
        return next(new ErrorHandler("OOPS! Error file upload failed.", 500));
    }

    const applicantID = {
        user: req.user._id,
        role: "Job Seeker",
      };
      if (!jobId) {
        return next(new ErrorHandler("Job not found!", 404));
      }

      const jobDetails = await Job.findById(jobId);
     if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  const employerID = {
    user: jobId,
    role: "Job Manager",
    employerName:employerName,
  };

  if (!name || !email || !coverLetter ||!phone ||!address ||!applicantID ||!employerID ||!resume || !city || !state || !pincode || !exp || !experience || !linkedinUrl || !portfolioUrl || !expectedSalary || !availableStartDate|| !whyInterested) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  const application = await Applicant.create({
    name,email, coverLetter,phone,address,city,state,pincode,experience:JSON.parse(experience),whyInterested,availableStartDate,expectedSalary,portfolioUrl,linkedinUrl,applicantID,employerID,resume: {public_id: cloud.public_id, url: cloud.secure_url,},profile: {public_id: profileCloud.public_id, url: profileCloud.secure_url,},projects:JSON.parse(project)
  });

  const job=await Job.findByIdAndUpdate(jobId,{$addToSet:{
    applicants:req.user._id
  }}
,
    {new:true})
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });


};

//FIND EMPLOYER
export const findEmployer = catchAsyncErrors(async (req, res, next) => {
 
  const { id } = req.params;
  const job = await Job.findById(id);
  res.status(200).json({
    success: true,
    job,
  });
});

export const applicationDetails=async(req,res,next)=>{
  const {role}=req.user
  const {id}=req.params
  const application=await Applicant.findById(id)
  const employer=await Job.findById(application.employerID.user)
  res.status(200).json({
    application,
    employer

  })
}