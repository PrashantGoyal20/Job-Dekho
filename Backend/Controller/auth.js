import { catchAsyncErrors } from "../Middleware/catchAsyncError.js";
import ErrorHandler from "../Middleware/error.js"
import { User } from "../DB/user.js";

//REGISTER
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role, city } = req.body;
  if (!name || !email || !phone || !password || !role || !city) {
    return next(new ErrorHandler("Please fill out all credentials"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("User already registered!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
    city
  });
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    user,
    message: "User Registeration and Token generated successfully",
    token,
  });

});



//LOGIN
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please enter correct credentials"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.matchPassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    user,
    message: "User Login and Token generated successfully",
    token,
  });
});


//LOGOUT
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true
  });
  res.status(200).json({
    sucsess: true,
    message: 'Logged out successfully'
  });
})


//GET USER
export const getUser = async (req, res, next) => {
  const user = req.user;
  
  res.status(200).json({
    success: true,
    user,
  })
}


export const googleAuth=async(req,res,next)=>{
  const { name, email, phone, password, role, city } = req.body;
  if (!name || !email || !phone || !password || !role || !city) {
    return next(new ErrorHandler("Please fill out all credentials"));
  }
  
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
    city
  });
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    user,
    message: "User Registeration and Token generated successfully",
    token,
  });
}




