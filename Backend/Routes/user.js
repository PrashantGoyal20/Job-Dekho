import express from "express";
import { register, login, logout, getUser, googleAuth } from "../Controller/auth.js";
import { isAuthenticated } from "../Middleware/auth.js"
import passport from "passport";
import ErrorHandler from "../Middleware/error.js"
import { Strategy } from "passport-google-oauth20";
import { User } from "../DB/user.js";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
dotenv.config()

const router = express.Router();

const getJwt = (id) => {
  return new Promise((resolve) => {
    const token = jwt.sign({ id: id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRY });

    resolve(token);
  });

}
passport.serializeUser((user, done) => done(null, user.emails?.[0]?.value));
passport.deserializeUser(async (email, done) => {
  console.log(email)
  const user = await User.findOne({email:email});
  done(null, user);
});

passport.use(new Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:3000/user/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  done(null, profile)

}))

router.post('/register', register);
router.post('/login', login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/register?error=error-in-registeration' }), async (req, res) => {
  const profile = req.user
  const existinguser = await User.findOne({ email: profile.emails?.[0]?.value })
  if (existinguser) {
    const token = await getJwt(existinguser._id)
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };      
      res.status(200).cookie("token", token, options)
      return res.redirect('http://localhost:5173')
    
  }
  else {
    const queryParams = new URLSearchParams({
      id: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0]?.value || '',
      avatar: profile.photos?.[0]?.value || ''
    });

    res.redirect(`http://localhost:5173/registeration/proceed?${queryParams.toString()}`)
  }
})

router.post('/googleAuth', googleAuth)
router.get('/logout', isAuthenticated, logout);
router.get('/getuser', isAuthenticated, getUser);

export default router;