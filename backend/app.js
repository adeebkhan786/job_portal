import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";


//Importing Files
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import jobRouter from './routes/jobRouter.js';
import applicationRouter from './routes/applicationRouter.js';
import { newsLetterCron } from "./automation/newLetterCron.js";


//setup
const app = express();
dotenv.config({ path: "./config/config.env" });


//Middlewares
app.use(cors(
  {
    origin: [process.env.FRONTENTD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
)
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//For uploading file like - resume
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/temp/",
}));


app.use('/api/v1/user', userRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/application', applicationRouter);



//Cron APIS
// newsLetterCron();

//Connection with database (mongoose)
connection();


// For Handling Errors 
app.use(errorMiddleware);

export default app;