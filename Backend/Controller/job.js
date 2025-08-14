import { catchAsyncErrors } from "../Middleware/catchAsyncError.js";
import { Job } from "../DB/job.js";
import ErrorHandler from "../Middleware/error.js";
import { User } from "../DB/user.js";
import { ai } from "../server.js";
import cloudinary from "cloudinary"


//GET ALL JOBS
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const query = req.query.q;
  const data = await Job.find({ expired: false })

  if (!query) {
    return res.json({ succees: true, jobs: data });
  }
  const filteredData = data.filter((item) =>
    item.category.toLowerCase().includes(query.toLowerCase()) ||
    item.company.toLowerCase().includes(query.toLowerCase())
  );
  res.status(200).json({
    success: true,
    filteredData
  })
})

//POST JOBS
export const postJobs = catchAsyncErrors(async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role == "Job Seeker") {
      return next(new ErrorHandler("User with current role can't post jobs", 401));
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Logo is Required!", 400));
    }
    const { logo } = req.files;
    const { title, description, company, experience, category, location, salary, applicationDeadline, requirements, contactEmail, benefits } = req.body;

    if (!title || !description || !company || !experience || !category || !location || !applicationDeadline || !salary || !requirements || !contactEmail || !benefits) {
      return next(new ErrorHandler("Please provide full job details.", 400));
    }

    const fileFormats = ['image/png', 'image/jpeg', 'image/webp']
    if (!fileFormats.includes(logo.mimetype)) {
      return next(new ErrorHandler("Invalid File Format! Please upload in .png/.jpg/.webp format", 400));
    }

    const cloud = await cloudinary.uploader.upload(logo.tempFilePath);
    if (!cloud || cloud.error) {
      console.error("Clodinary Error: ", cloud.error || "Unknown cloud error");
      return next(new ErrorHandler("OOPS! Error file upload failed.", 500));
    }

    const postedBy = req.user._id;
    const employerDetails = await User.findById(req.user._id)
    if (!employerDetails) {
      return next(new ErrorHandler("No such User exist", 400))
    }
    const job = await Job.create({ logo: { public_id: cloud.public_id, url: cloud.secure_url, }, title, description, company, experience, category, location, salary, applicationDeadline, requirements, contactEmail, benefits, postedBy });
    res.status(200).json({
      success: true,
      message: "Job Posted Successfully!",
      job,
    });
  } catch (error) {
    console.log(error)
  }

});

//GET MY JOBS
export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const myJobs = await Job.find({ postedBy: req.user._id, expired: false });
  res.status(200).json({
    success: true,
    jobs: myJobs,
  });
});



//DELETE JOB
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Error 404 not found.", 404));
  }
  await cloudinary.uploader.destroy(job.logo.public_id)

  await Job.findByIdAndUpdate(id, { expired: true });
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
});

//VIEW SINGLE JOB
export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});

//Search Job
export const searchJobs = catchAsyncErrors(async (req, res, next) => {
  const query = req.query;

  const data = await Job.find({ expired: false })
  const q = []
  if (query.job) {
    const filteredData = data.filter((item) => {
      return (
        item.category.toLowerCase().includes(query.job.toLowerCase()) ||
        item.company.toLowerCase().includes(query.job.toLowerCase()) ||
        item.title.toLowerCase().includes(query.job.toLowerCase())
      )
    }
    );
    q.push(filteredData)
  }
  if (query.location) {
    const filteredData = data.filter((item) => {
      return (
        item.location.toLowerCase().includes(query.location.toLowerCase())
      )
    }
    );
    q.push(filteredData)
  }


  console.log(q)
  res.json({
    succees: true,
    search: q
  });
})

export const questionGen = async (req, res, next) => {
  const topic = req.query.topics
  console.log(topic)
  var topics = ""
  if (Array.isArray(topic)) { topics == topic.join(",") }
  else topics = topic

  const prompt = `You are an expert technical interviewer.
Based on the following topics: ${topics}, generate 15 to 20 multiple-choice questions. The questions should range from intermediate to advanced difficulty.\n

For each question:
- Provide exactly 4 options
- Include the correct answer from one of the 4 options
- Return the output as a JSON array of objects with the following example as structure:


[{
 "question Number":"1",
  "question": "Which of the following activation functions is most susceptible to the vanishing gradient problem in deep neural networks?",
  "option": ["Relu","Sigmoid","Tanh","Leaky Relu"],
  "correctAns": "Sigmoid",
  "correctIndex":"1"
  }]
Give about 2-3 questions in total
Make sure the questions are relevant to the given topics and formatted as valid JSON. Also strictly give your answer in this format.No need to add \n\ or any other sort of symbol
`;

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const data = response.text;

    const cleaned = data.trim()
      .replace('/^```json/', "")
      .replace('/^```/', "")
      .replace('/```$/', "").
      replace('```json', "").
      replace("\n", "").
      replace('```', "")

    const question = JSON.parse(cleaned)

    res.status(200).json({
      success: true,
      question
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate content" });
  }
}


export const addFavourite = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { appId } = req.body
    const { id } = req.params
    const existingJob = await Job.findById(id)
    if (!existingJob) {
      return next(
        new ErrorHandler("No Job found with given ID")
      )
    }
    const fav = await Job.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          favourite: appId,
        },
      },
      { new: true }
    );
    console.log("update completed")
    res.status(200).json({
      success: true,
      fav
    })
  } catch (error) {
    console.log(error)
  }


}

export const deleteFavourite = async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { appId } = req.body
  const { id } = req.params
  const existingJob = await Job.findById(id)
  if (!existingJob) {
    return next(
      new ErrorHandler("No Job found with given ID")
    )
  }
  const fav = await Job.findByIdAndUpdate(
    id,
    {
      $pull: {
        favourite: appId,
      },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    fav
  })

}

export const getAllFav = async (req, res, next) => {
  const { _id } = req.user

  const applicants = await Job.find({
    postedBy: _id, $expr: {
      $and: [
        { $gte: [{ $size: { $ifNull: ["$favourite", []] } }, 1] },
      ]
    },
  }).populate('favourite')
  const applicantlist = applicants.map((item) => (item.favourite))
  var employer = []
  
  var job
  let applicant=[]
  
  for (let i = 0; i < applicantlist.length; i++) {
    let length = Object.keys(applicantlist[i]).length
    for (let j = 0; j < length; j++) {
      job = await Job.findById(applicantlist[i][j].employerID.user)
      employer[i] = job
      applicant[i]=applicantlist[i][j]
    }
  }
  res.status(200).json({
    succees: true,
    applications: applicant,
    employer
  })
}

export const getAllSaved = async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const jobs = []
  for (var i = 0; i < user.savedJobs.length; i++) {
    var job = await Job.findById(user.savedJobs[i])
    jobs.push(job)
  }
  res.status(200).json({
    success: true,
    jobs
  })
}

export const saveJob = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: {
      savedJobs: id
    }
  }, { new: true, runValidators: true })
  res.status(200).json({
    succees: true
  })
}

export const deleteSavedJob = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: {
      savedJobs: id
    }
  })
  res.status(200).json({
    succees: true
  })


}


