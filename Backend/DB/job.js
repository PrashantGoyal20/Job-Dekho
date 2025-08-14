import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  company : {
    type:String,
    required:true
  },
  experience : {
    type:String,
    required:true
  },
  category: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required:true
  },
  requirements:{
    type:String,
    required:true
  },
  benefits:{
    type:String,
    required:true
  },
  contactEmail:{
    type:String,
    required:true
  },
  applicationDeadline:{
    type:String,
    required:true
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  favourite:{
    type:[ mongoose.Schema.ObjectId],
    ref:"Applicant",
  },
  applicants:{
    type:[ mongoose.Schema.ObjectId],
    ref: "User",
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  logo: {
    public_id: {
      type: String, 
      required: true,
    },
    url: {
      type: String, 
      required: true,
    },
  },
});

export const Job = mongoose.model("Job", jobSchema);