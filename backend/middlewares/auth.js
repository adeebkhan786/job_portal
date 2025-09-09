import jwt from 'jsonwebtoken';



//Importing files
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import { User } from '../models/userSchema.js';




export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(new ErrorHandler('User is not authenticated', 400));
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();

  } catch (error) {
    next(error);
  }
});



export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`${req.user.role} not allowed to access this resource.`, 400))
    }
    next();
  }
}