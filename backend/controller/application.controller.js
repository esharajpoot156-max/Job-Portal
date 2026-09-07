import {Application} from "../models/application.model.js"
import {Job} from "../models/job.model.js"
import { Notification } from "../models/notification.model.js";
import { sendStatusUpdateEmail } from "../utils/sendEmail.js";

export const applyJob = async (req,res) =>{
    try{
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message :"Job Id is required...",
                success: false
            })
        };
        //check if the user already apply for job
        const existingApplication = await Application.findOne({job:jobId, applicant: userId});
        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this jobs",
                success: false
            });
        }
        //check if the jobexist

        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message: "Job not Found",
                success : false
            })
        }
        //create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });
        job.applications.push(newApplication._id);
        await job.save();

        // notification for employer
        await Notification.create({
            user: job.created_by,
            message: `New application received for "${job.title}".`,
            type: "application_received",
            relatedJob: job._id
        });

        return res.status(201).json({
            message: "job applied successfully",
            success : true
        })

    }catch (error){
        console.log(error);
        return res.status(500).json({
        message: "Server error",
        success: false
    });
    }
}

export const getAppliedJobs = async(req,res) =>{
    try{
        const userId = req.id;
        const application = await Application.find({applicant: userId}).sort({createdAt: -1}).populate({
            path: 'job',
            options:{sort:{createdAt: -1}}, //sorted mai show 
            populate:{
                path: 'company',
                options: {sort:{createdAt:-1}}
            }
        });
        if(!application){
            return res.status(404).json({
                message: "NO Applications",
                success: false 
            })
        };
        return res.status(200).json({
            applications: application,
            success: true
        })
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
        message: "Server error",
        success: false
    });
    }
}
//admin see how many users apply
export const getApplicants = async(req,res) =>{
    try{
        const {id} = req.params;
        const job = await Job.findById(id).populate({
            path: 'applications',
            options: {sort:{createdAt: -1}},
            populate:{
                path: "applicant"
            }
        });
        if(!job){
            return res.status(404).json({
                message: "Job not Found",
                success: false
            })
        };
        return res.status(200).json({
            job,
            success: true
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
        message: "Server error",
        success: false
    });
    }
}
//update status

export const updateStatus = async (req,res) =>{
    try{
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(404).json({
                message: "status is required",
                success: false
            })
        };

        const application = await Application.findOne({_id: applicationId})
            .populate("applicant")
            .populate("job");

        if(!application){
            return res.status(404).json({
                message: "application not Found",
                success: false
            })
        };

        application.status = status.toLowerCase();
        await application.save();

        //in-app notification
        await Notification.create({
            user: application.applicant._id,
            message: `Your application for "${application.job.title}" has been ${status.toLowerCase()}.`,
            type: "application_status",
            relatedApplication: application._id,
            relatedJob: application.job._id
        });

        //email notification
        await sendStatusUpdateEmail(
            application.applicant.email,
            application.applicant.fullname,
            application.job.title,
            status.toLowerCase()
        );

        return res.status(200).json({
            message: "status updated successfully",
            success: true
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}