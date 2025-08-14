import express from "express";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./Routes/user.js";
import jobRouter from "./Routes/job.js";
import appRouter from "./Routes/app.js";
import chatRouter from "./Routes/chat.js"
import mongoose from "mongoose";
import { errorMiddleware } from "./Middleware/error.js";
import { searchJobs } from "./Controller/job.js";
import { GoogleGenAI } from "@google/genai";
import { AccessToken } from "livekit-server-sdk";
import { upsertToQdrant, deleteFromQdrant, getEmbedding } from "./Controller/Chat.js";
import PQueue from "p-queue";
import { Job } from "./DB/job.js";
import { isAuthenticated } from "./Middleware/auth.js";
import { Applicant } from "./DB/applicant.js";
import passport from "passport";
import session from "express-session";

const app = express();
app.use(express.json())
dotenv.config();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);


app.use(session({ secret: 'secret', resave: false, saveUninitialized: true ,cookie:{secure:false,httpOnly: true,sameSite:'lax'}}));
app.use(passport.initialize())
app.use(passport.session())


export const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}))

app.post('/get-token/:id', async(req, res) => {
  const {room,name,isApplicant} = req.body;
  const {id}=req.params
  const applicant=await Applicant.findById(id)

  if(isApplicant){
    const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: applicant.applicantID.user,
      name: name,
    }
  );

   token.addGrant({ roomJoin: true, room: room,canPublish: true,canSubscribe: true, });
   const jwtToken=await token.toJwt()
    await Applicant.findByIdAndUpdate(id, { $set: { roomToken: room ,roomLink :process.env.LIVEKIT_URL } }, {
      new: true,
      runValidators: true
    })
 
  res.status(200).json({
     token: jwtToken,
     url: process.env.LIVEKIT_URL 
    });
  }
  else{
    const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: applicant.employerID.user,
      name: name,
    }
  );

   token.addGrant({ roomJoin: true, room: room,canPublish: true,canSubscribe: true, });
   const jwtToken=await token.toJwt()
    await Applicant.findByIdAndUpdate(id, { $set: { roomToken: room ,roomLink :process.env.LIVEKIT_URL } }, {
      new: true,
      runValidators: true
    })
 
  res.status(200).json({
     token: jwtToken,
     url: process.env.LIVEKIT_URL 
    });
  }
  
});


  app.get('/meet-finished/:id',async(req,res)=>{
    const  {id}=req.params
    await Applicant.findByIdAndUpdate(id, { $set: { roomToken: '',roomLink: "" } }, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      message:"meet Finished"
    })
  })  

  app.get('/join-meet/:id',async(req,res)=>{
    const {id}=req.params
    const application=await Applicant.findById(id)
    res.status(200).json({
      token:application.roomToken,
      url:application.roomLink
    })
  })

app.get('/search', searchJobs);

app.use("/user", userRouter);
app.use("/app", appRouter);
app.use("/job", jobRouter);
app.use('/chat', chatRouter)

app.use(errorMiddleware);

const PORT = process.env.PORT
const queue = new PQueue({ concurrency: 2 });


mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  replicaSet: process.env.MONGO_REPLICA_SET
})
  .then(app.listen(PORT, async () => {
    console.log("Mongoose Connected")
    const client = mongoose.connection.getClient();
    console.log("🔁 Replica Set:", client.options?.replicaSet || 'undefined');
    const changeStream = Job.watch([], {
      fullDocument: 'updateLookup',
    });


    if (typeof changeStream.on !== 'function') {
      console.error('❌ changeStream is not a valid ChangeStream');

      return;
    }


    console.log('🟢 Watching MongoDB for changes...');

    changeStream.on('change', async (change) => {
      try {
        console.log('Detected:', change);
        const { operationType } = change;
        let doc = change.fullDocument;
        const docId = change.documentKey._id.toString();

        if (operationType === 'insert') {
          
          let salary=''
          if(doc.fixedSalary){
            salary=doc.fixedSalary
          }else{
            salary=doc.salaryFrom + " " + doc.salaryTo
          }

          const text = `
          This job is provided by ${doc.company} fro title ${doc.title} requiring an experience of ${doc.experience} years under the category ${doc.category}.
          description of the job is also provided ${doc.description}.
          This location at which the employee would have to report after joining is ${doc.location} in ${doc.country} at a salary of INR ${salary}
            `;

          if (typeof text !== 'string' || text.trim() === '') {
            console.warn("⚠️ Invalid composed text, skipping...");
            return;
          }
          queue.add(async () => {
            try {
              const embedding = await getEmbedding(text);
              console.log("📐 Embedding length:", embedding.length);

              await upsertToQdrant(docId, embedding, doc);
              console.log(`✅ Synced ${operationType} to Qdrant → ID: ${docId}`);
            } catch (err) {
              console.error("❌ Error processing doc:", doc._id, err.message);
            }
          });


        }
        else if (operationType === 'update') {
          doc = change.fullDocument;
          console.log(doc)
          await deleteFromQdrant(docId);
          console.log(`🗑️ Deleted from Qdrant → ID: ${docId}`);
          console.log(doc)
          let salary=''
          if(doc.fixedSalary){
            salary=doc.fixedSalary
          }else{
            salary=doc.salaryFrom + " " + doc.salaryTo
          }
          const text = `
             This job is provided by ${doc.company} fro title ${doc.title} requiring an experience of ${doc.experience} years under the category ${doc.category}.
          description of the job is also provided ${doc.description}.
          This location at which the employee would have to report after joining is ${doc.location} in ${doc.country} at a salary of INR ${salary}
            `;

          if (typeof text !== 'string' || text.trim() === '') {
            console.warn("⚠️ Invalid composed text, skipping...");
            return;
          }

          queue.add(async () => {
            try {
              const embedding = await getEmbedding(text);
              console.log("📐 Embedding length:", embedding.length);

              await upsertToQdrant(docId, embedding, doc);
              console.log(`✅ Synced ${operationType} to Qdrant → ID: ${docId}`);
            } catch (err) {
              console.error("❌ Error processing doc:", doc._id, err.message);
            }
          });

        }

        else if (operationType === 'delete') {
          await deleteFromQdrant(docId);
          console.log(`🗑️ Deleted from Qdrant → ID: ${docId}`);
        }
      } catch (err) {
        console.error('❌ Error in ChangeStream handler:', err);
      }
    });

    changeStream.on('error', (error) => {
      console.error("Message:", error.message);
    });

  })).catch((err) =>
    console.log(err)
  )

