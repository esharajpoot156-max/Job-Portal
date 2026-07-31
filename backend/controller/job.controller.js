import {Job} from "../models/job.model.js";


export const postJob = async (req,res) =>{
    try{
        const {title, Description, requirements, salary , location, jobType, experience ,position, companyId} = req.body;
        const userId = req.id;
        if(!title || !Description || !requirements || !salary || !location || !jobType || experience == undefined || position == undefined || !companyId)
        {
            return res.status(400).json({
                message : "something is missing.....!",
                success: false
            })
        };
        const job = await Job.create({
            title,
            Description,
            requirements: requirements.split(",").map(r => r.trim()),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New Job created Successfully.... ",
            job,
            success: true
        });

    }catch(error){
        console.log(error);
         return res.status(500).json({
        message: "Server error",
        success: false
    });
    }
}
//get job
export const getAllJob = async(req,res)=>{
    try{
        const keyword = req.query.keyword || "";
        const location = req.query.location || "";
        const jobType = req.query.jobType || "";
        const minSalary = req.query.minSalary;
        const maxSalary = req.query.maxSalary;
        const experience = req.query.experience;

        const query = {
            $or: [
                {title: {$regex:keyword, $options: "i"}},
                {Description: {$regex:keyword, $options: "i"}},
            ]
        };

        if(location){
            query.location = {$regex: location, $options: "i"};
        }

        if(jobType){
            query.jobType = {$regex: jobType, $options: "i"};
        }

        if(experience){
            query.experienceLevel = Number(experience);
        }

        if(minSalary || maxSalary){
            query.salary = {};
            if(minSalary) query.salary.$gte = Number(minSalary);
            if(maxSalary) query.salary.$lte = Number(maxSalary);
        }

        const jobs = await Job.find(query).populate({
            path:"company"
        }).sort({createdAt:-1});

        if(!jobs){
            return res.status(400).json({
                message : "Job not Found....",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
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
// find job by ID

export const getJobById = async (req,res) =>{
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message : "Job not Found.....",
                success : false
            })
        };
        return res.status(200).json({
            job,
            success: true
        });

    }catch(error){
        console.log(error);
         return res.status(500).json({
        message: "Server error",
        success: false
    });
    }
} 

//admin kitny job create kar raha hai 
export const getAdminJobs = async(req,res) =>{
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by: adminId});
        if(!jobs){

        return res.status(404).json({
                message: "Job not Found.....",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        });


    }catch(error){
        console.log(error);
         return res.status(500).json({
        message: "Server error",
        success: false
    });
    }
}