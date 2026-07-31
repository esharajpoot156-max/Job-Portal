import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    phoneNumber:{
        type:Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:String, 
        enum:["student","recruiter"],
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
    type: String},
    resetPasswordExpiry:{
    type: Date},
    profile:{
        bio: {type:String},
        skills: [{type:String}],
        resume:{type:String},
        resumeOriginalname: {type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref: "Company"},
        profilePhoto:{
            type:String,
            default:""
        }
    },

}, {timestamps: true});

export const user = mongoose.model("User", userSchema);