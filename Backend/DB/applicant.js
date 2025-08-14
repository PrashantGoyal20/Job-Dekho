import mongoose from "mongoose";
import validator from "validator";

const applicantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  coverLetter: {
    type: String,
    required: [true, "Please provide a cover letter!"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  address: {
    type: String,
    required: [true, "Please enter your Address!"],
  },
  city:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  pincode:{
    type:String,
    required:true
  },
  experience:{
    type:[{
      company:{
        type:String,
      },
      period:{
        type:String,
      },
      details:{
        type:String
      }

    }],
    default:"N/A"
  },
  whyInterested:{
    type:String,
    required:true
  },
  availableStartDate:{
    type:String,
    required:true
  },
  expectedSalary:{
    type:String,
    required:true
  },
  portfolioUrl:{
    type:String,
    required:true
  },
  linkedinUrl:{
    type:String,
    required:true
  },
  roomToken:{
    type:String,
  },
  roomLink:{
    type:String,
  },
  resume: {
    public_id: {
      type: String, 
      required: true,
    },
    url: {
      type: String, 
      required: true,
    },
  },
  profile: {
    public_id: {
      type: String, 
      required: true,
    },
    url: {
      type: String, 
      required: true,
    },
  },
  applicantID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Job Seeker"],
      required: true,
    },
  },
  exp:{
      type:String,
      default:"N/A"
    },
    status:{
      type:String,
      enum:["Pending","Submitted","Shortlisted","Rejected"],
      default:"Submitted",
      required:true
    },
    projects:{
      type:[
        {
          projectName:{
            type:String,
            required:"true"
          },
          projectDetails:{
            type:String,
            required:"true"
          },
          projectTime:{
            type:String,
            required:"true"
          }
        }
      ]
    },
  employerID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
      required: true,
    },
    role: {
      type: String,
      enum: ["Job Manager"],
      required: true,
    },
    employerName:{
      type: String,
      required: true,
    },
    
    
  },
  postedOn:{
      type:Date,
      default:Date.now()
    }
});

export const Applicant = mongoose.model("Applicant", applicantSchema);

