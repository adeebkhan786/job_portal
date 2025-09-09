import mongoose from "mongoose";
import validator from "validator";

//There are 4 objects - for jobSeeker, Employer, Jobs and DeletedBy(Employer and JobSeeker).
const applicationSchema = new mongoose.Schema({
  jobSeekerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "user",
      required: true,
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please provide a valid email."]
    },

    phone: {
      type: Number,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    resume: {
      public_id: String,
      url: String
    },

    coverLetter: {
      type: String,
      required: true
    },

    role: {
      type: String,
      required: true,
      enum: ["Job Seeker"]
    },
  },

  employerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    role: {
      type: String,
      enum: ["Employer"],
      required: true
    }
  },

  jobInfo: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref:"job",
      required: true
    },

    jobTitle: {
      type: String,
      required: true
    }
  },

  deletedBy: {
    jobSeeker: {
      type: Boolean,
      default: false
    },

    employer: {
      type: Boolean,
      default: false
    }
  }
})



export const Application = mongoose.model('Application', applicationSchema);