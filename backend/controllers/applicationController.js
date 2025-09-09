
import { v2 as cloudinary } from "cloudinary";






//Importing Files
import { Application } from "../models/applicationSchema.js";
import { Job } from '../models/jobSchema.js';
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";




export const postApplication = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, coverLetter } = req.body;
    if (!name || !email || !phone || !address || !coverLetter) {
      return next(new ErrorHandler('All fields are required.', 400));
    }

    //For JobSeeker Info
    const jobSeekerInfo = { id: req.user._id, name, email, phone, address, coverLetter, role: "Job Seeker" };

    //Fetch JobDetails with particular id
    const jobDetails = await Job.findById(id);    //Job ki saari details chli aayegi jaise ki job ko kisne post kiya tha aur salary sb kuch.
    if (!jobDetails) {
      return next(new ErrorHandler('Job not found.', 404));
    };

    const isAlreadyApplied = await Application.findOne({ "jobInfo.jobId": id, "jobSeekerInfo.id": req.user._id });
    if (isAlreadyApplied) {
      return next(new ErrorHandler('You have already applied for this job', 400));
    }

    if (req.files && req.files.resume) {
      const { resume } = req.files;
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "Job_Seekers_Resume" });
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return next(new ErrorHandler('Failed to upload resume to cloudinary', 500));
        };

        jobSeekerInfo.resume = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.url
        };

      } catch (error) {
        return next(new ErrorHandler('Failed to upload resume', 500));
      }
    } else {
      if (req.user && !req.user.resume.url) {
        return next(new ErrorHandler('Please upload your reume.', 400))
      }
      jobSeekerInfo.resume = {
        public_id: req.user && req.user.resume.public_id,
        url: req.user && req.user.resume.url,
      }
    };

    //For Employer Info
    const employerInfo = {
      id: jobDetails.postedBy,
      role: "Employer"
    };

    //FOr JobDetails Info
    const jobInfo = {
      jobId: id,
      jobTitle: jobDetails.title
    };


    const application = await Application.create({ jobSeekerInfo, employerInfo, jobInfo });
    res.status(201).json({
      success: true,
      message: 'Application submitted.',
      application
    })


  } catch (error) {
    next(error)
  }
});





export const employerGetAllApplication = catchAsyncErrors(async (req, res, next) => {
  try {
    const { _id } = req.user;
    const applications = await Application.find({
      "employerInfo.id": _id,
      "deletedBy.employer": false
    });

    res.status(200).json({
      success: true,
      applications
    })

  } catch (error) {
    next(error)
  }
});






export const jobSeekerGetAllApplication = catchAsyncErrors(async (req, res, next) => {
  try {
    const { _id } = req.user;
    const applications = await Application.find({
      "jobSeekerInfo.id": _id,
      "deletedBy.jobSeeker": false
    });

    res.status(200).json({
      success: true,
      applications
    })

  } catch (error) {
    next(error)
  }
});









export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler('Application not found.', 404));
    }

    const { role } = req.user;
    switch (role) {
      case "Job Seeker":
        application.deletedBy.jobSeeker = true;
        await application.save();
        break;


      case "Employer":
        application.deletedBy.employer = true;
        await application.save();
        break;

      default:
        console.log("Default case for application delete function");
        break;
    }

    if (application.deletedBy.employer === true && application.deletedBy.jobSeeker === true) {
      await application.deleteOne();
    }


    res.status(200).json({
      success: true,
      message: 'Application Deleted.'
    })


  } catch (error) {
    next(error)
  }
})