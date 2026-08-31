import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: function () { return this.role !== "recruiter"; }
    },
    companyName:{
        type: String,
        required: function () { return this.role === "recruiter"; }
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    phoneNumber:{
        type:String
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:String, 
        enum:["student","recruiter", "admin"],
        required: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    verificationToken:{
        type: String
    },
    verificationTokenExpiry:{
        type: Date
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpiry:{
        type: Date
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    profile:{
        type:{
            bio: {type:String},
            skills: [{type:String}],
            city: {type:String},
            qualification: {type:String},
            experience: {type:String},
            jobPreference: {type:String},
            salaryExpectation: {type:String},
            resume:{type:String},
            resumeOriginalname: {type:String},
            company:{type:mongoose.Schema.Types.ObjectId, ref: "Company"},
            profilePhoto:{
                type:String,
                default:""
            }
        },
        default:{}
    },
}, {timestamps: true});

export const user = mongoose.model("User", userSchema);