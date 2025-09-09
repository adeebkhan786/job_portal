







//Importing Files
import { Job } from '../models/jobSchema.js';
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";



export const postJob = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, jobType, location, companyName, introduction, responsibilities, qualifications, offers, salary,
      hiringMultipleCandidates, personalWebsiteTitle, personalWebsiteUrl, jobNiche } = req.body;

    if (!title || !jobType || !location || !companyName || !introduction || !responsibilities || !qualifications || !salary || !jobNiche) {
      return next(new ErrorHandler('Please provide full job details.', 400));
    }

    if ((personalWebsiteTitle && !personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)) {
      return next(new ErrorHandler('Provide both the website url and title, or leave both blank', 400));
    };

    const postedBy = req.user._id;
    const job = await Job.create({
      title, jobType, location, companyName, introduction, responsibilities, qualifications, offers, salary,
      hiringMultipleCandidates, personalWebsite: { title: personalWebsiteTitle, url: personalWebsiteUrl }, jobNiche, postedBy
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully.',
      job
    })

  } catch (error) {
    next(error);
  }
});





// http://localhost:4000/job/getall?searchKeyword='12'&city='Mumbai'   ===> req.query  => ? ke baad jo aata hai wo query hota hai.
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  try {
    const { city, niche, searchKeyword } = req.query
    const query = {};

    if (city) {
      query.location = city;
    };

    if (niche) {
      query.jobNiche = niche;
    };

    if (searchKeyword) {
      query.$or = [
        { title: { $regex: searchKeyword, $options: "i" } },
        { companyName: { $regex: searchKeyword, $options: "i" } },
        { introduction: { $regex: searchKeyword, $options: "i" } }
      ]
    }

    const jobs = await Job.find(query);
    res.status(200).json({
      success: true,
      jobs,
      count: jobs.length
    })

  } catch (error) {
    next(error);
  }
});






export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user._id });   //underscore (_) lgaao ya na lgaao koi frk nhi pdta.
    res.status(200).json({
      success: true,
      myJobs
    })

  } catch (error) {
    next(error);
  }
});





export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler('Oops! Job not found.', 404));
    }

    await job.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Job deleted.'
    })

  } catch (error) {
    next(error);
  }
});




// http://localhost:4000/job/getall/h12321234   ===> req.params   => / ke bad jo aata hai wo params hota hai.
export const getASingleJob = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler('Job not found.', 404));
    };

    res.status(200).json({
      success: true,
      job
    })

  } catch (error) {
    next(error);
  }
});
