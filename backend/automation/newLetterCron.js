import cron from 'node-cron';




//Importing Files
import { Job } from '../models/jobSchema.js';
import { User } from '../models/userSchema.js';
import { sendEmail } from '../utils/sendEmail.js';

// 1. * - Minutes => */70 => har 70 minutes ke baad excute hoga
// 2. * - Hours => */12 => har 12 ghante baad excute hoga
// 3. * - Days => */4 => har 4 din ke baad excute hoga
// 4. * - Month => */10 => har October ko run hoga
// 5. * - Week Days => */5 => week days me 5wa din run hoga harr wednesday ko run hoga


export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running Cron Automation");
    const jobs = await Job.find({ newsLettersSent: false });
    for (const job of jobs) {
      try {

        //us user ko find krna hai jiska 1stNiche ya 2ndNiche ya 3rdNiche job ke niche ke barabar ho.
        // Basically - { user1stNiche === JobNiche || user2ndNiche === jobNiche || user3rdNiche === jobNiche }
        const filteredUsers = await User.find({
          $or: [
            { "niches.firstNiche": job.jobNiche },
            { "niches.secondNiche": job.jobNiche },
            { "niches.thirdNiche": job.jobNiche },
          ]
        });

        for (const user of filteredUsers) {
          const subject = `Hot Job Alert: ${job.title} in ${job.jobNiche} Available Now`;

          const message = `Hi ${user.name}, \n\nGreate news! A new job that fits your niche has just been
          posted. The position is for a ${job.title} with ${job.companyName}, and they are looking to hire
          immediately.\n\nJob Details:\n- **Position:** ${job.title}\n- **Company:** ${job.companyName}\n- 
          **Location:** ${job.location}\n- **Salary:** ${job.salary}\n\nDont wait too long! Job oepenings
          like these are filled quickly. \n\nWe are here to support you in your job search. Best of
          luck!\n\nBest Regards, \nNicheNest Team`;


          sendEmail({ email: user.email, subject, message });
        };

        job.newsLettersSent = true;
        await job.save();

      } catch (error) {
        console.log('ERROR IN NODE CRON CATCH BLOCK')
        return next(console.error(error || "Some error in cron."))
      }
    }
  });
}