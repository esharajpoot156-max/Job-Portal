import express from "express";
import cookieParser from "cookie-parser"; 
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js"
import companyRoute from "./routes/company.routes.js"
import jobRoute from "./routes/Job.routes.js"
import applicationRoute from "./routes/application.route.js"
import messageRoute from "./routes/message.routes.js"
import { app, server } from "./utils/socket.js";
import notificationRoute from "./routes/notification.routes.js";

dotenv.config({});

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}

app.use(cors(corsOptions)); 

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute); 
app.use("/api/v1/application",applicationRoute); 
app.use("/api/v1/message",messageRoute);
app.use("/api/v1/notification", notificationRoute);

connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log(`Server running at port ${PORT}`);
    });
});