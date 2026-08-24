import { user as User } from "../models/user.model.js"; 
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import crypto from "crypto"; 
import { sendVerificationEmail, sendResetPasswordEmail } from "../utils/sendEmail.js"; 
import cloudinary from "../utils/cloudinary.js"; 
import getDataUri from "../utils/datauri.js"; 
 
//Register 
export const register = async (req,res) =>{ 
    try{ 
        const {fullname, companyName, email, password, role} = req.body; 
        const isEmployer = role === "recruiter"; 
        const nameValue = isEmployer ? companyName : fullname; 
 
        if(!nameValue || !email || !password || !role) 
        { 
            return res.status(400).json({ 
                message: "Something is missing ", 
                success: false 
            }); 
        }; 

        // Only allow student or recruiter to self-register; admin is set manually in DB
        if(role !== "student" && role !== "recruiter"){
            return res.status(400).json({
                message: "Invalid role.",
                success: false
            });
        }

        const existingUser = await User.findOne({email}); 
        if(existingUser){ 
            return res.status(400).json({ 
                message : "User already Exist with this email.", 
                success : false 
            }) 
        } 
        const hashedPassword  = await bcrypt.hash(password, 10); 
 
        const verificationToken = crypto.randomBytes(32).toString("hex"); 
        const verificationTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour 
 
        await User.create({ 
            fullname: isEmployer ? undefined : fullname, 
            companyName: isEmployer ? companyName : undefined, 
            email, 
            password : hashedPassword, 
            role, 
            verificationToken, 
            verificationTokenExpiry 
        }); 
 
        await sendVerificationEmail(email, verificationToken); 
 
        return res.status(201).json({ 
            message: "Account created successfully. Please check your email to verify your account.", 
            success: true 
        }); 
    } catch(error){ 
        console.log(error); 
        return res.status(500).json({ 
            message: "Server error", 
            success: false 
        }); 
    } 
} 
 
//verify email 
export const verifyEmail = async (req,res) =>{ 
    try{ 
        const { token } = req.params; 
 
        const foundUser = await User.findOne({ 
            verificationToken: token, 
            verificationTokenExpiry: { $gt: Date.now() } 
        }); 
 
        if(!foundUser){ 
            return res.status(400).json({ 
                message: "Invalid or expired verification link.", 
                success: false 
            }); 
        } 
 
        foundUser.isVerified = true; 
        foundUser.verificationToken = undefined; 
        foundUser.verificationTokenExpiry = undefined; 
        await foundUser.save(); 
 
        return res.status(200).json({ 
            message: "Email verified successfully. You can now login.", 
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
 
//resend verification email 
export const resendVerification = async (req,res) =>{ 
    try{ 
        const { email } = req.body; 
        if(!email){ 
            return res.status(400).json({ 
                message: "Email is required", 
                success: false 
            }); 
        } 
 
        const foundUser = await User.findOne({email}); 
        if(!foundUser){ 
            return res.status(404).json({ 
                message: "User not found", 
                success: false 
            }); 
        } 
 
        if(foundUser.isVerified){ 
            return res.status(400).json({ 
                message: "Email is already verified", 
                success: false 
            }); 
        } 
 
        const verificationToken = crypto.randomBytes(32).toString("hex"); 
        const verificationTokenExpiry = Date.now() + 60 * 60 * 1000; 
 
        foundUser.verificationToken = verificationToken; 
        foundUser.verificationTokenExpiry = verificationTokenExpiry; 
        await foundUser.save(); 
 
        await sendVerificationEmail(email, verificationToken); 
 
        return res.status(200).json({ 
            message: "Verification email resent successfully.", 
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
 
//login 
export const login = async (req,res) =>{ 
    try { 
        const {email, password , role} = req.body; 
        if(!email || !password || !role) 
        { 
            return res.status(400).json({ 
                message: "Something is missing ", 
                success: false 
            }); 
        }; 
        let existingUser = await User.findOne({email}); 
        if(!existingUser){ 
            return res.status(400).json({ 
                message: "Incorrect Email or Password", 
                success: false 
            }) 
        } 
 
        if(!existingUser.isVerified){ 
            return res.status(403).json({ 
                message: "Please verify your email before logging in.", 
                success: false 
            }) 
        } 
 
        const passwordMatch = await bcrypt.compare(password, existingUser.password); 
        if(!passwordMatch){ 
            return res.status(400).json({ 
                message: "Incorrect Email or Password", 
                success: false 
            }) 
        }; 
        if (role !== existingUser.role) 
        { 
            return res.status(400).json({ 
                message:"Account does'nt exist with current role." , 
                success : false 
            }) 
        }; 
        const tokendata = { 
            userId : existingUser._id, 
        } 
        const token = await jwt.sign(tokendata,process.env.SECRET_KEY,{expiresIn: '1d'}); 
 
        const userData = { 
            _id : existingUser._id, 
            fullname: existingUser.role === "recruiter" ? existingUser.companyName : existingUser.fullname, 
            email:existingUser.email, 
            phoneNumber:existingUser.phoneNumber, 
            role: existingUser.role, 
            profile:existingUser.profile, 
            savedJobs: existingUser.savedJobs 
        } 
 
        return res.status(200).cookie("token",token, {maxAge: 1*24*60*60*1000, httpOnly: true, sameSite: 'strict'}) .json ({ 
            message: `Welcome back ${userData.fullname}`,  
            user: userData, 
            success: true 
        }) 
 
    } catch (error){ 
        console.log(error); 
        return res.status(500).json({ 
            message: "Server error", 
            success: false 
        }); 
    } 
} 
 
//Logout  
export const logout = async (req,res) => { 
    try{ 
        return res.status(200).cookie("token","",{maxAge:0 }).json({ 
            message: "Logged out successfully.", 
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
//forgot password
export const forgotPassword = async (req,res) =>{ 
    try{ 
        const { email } = req.body; 
        if(!email){ 
            return res.status(400).json({ 
                message: "Email is required", 
                success: false 
            }); 
        } 
 
        const foundUser = await User.findOne({email}); 
        if(!foundUser){ 
            return res.status(404).json({ 
                message: "No account found with this email", 
                success: false 
            }); 
        } 
 
        const resetToken = crypto.randomBytes(32).toString("hex"); 
        const resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 min 
 
        foundUser.resetPasswordToken = resetToken; 
        foundUser.resetPasswordExpiry = resetPasswordExpiry; 
        await foundUser.save(); 
 
        await sendResetPasswordEmail(email, resetToken); 
 
        return res.status(200).json({ 
            message: "Password reset link sent to your email", 
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
 
//reset password
export const resetPassword = async (req,res) =>{ 
    try{ 
        const { token } = req.params; 
        const { newPassword } = req.body; 
 
        if(!newPassword){ 
            return res.status(400).json({ 
                message: "New password is required", 
                success: false 
            }); 
        } 
 
        const foundUser = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpiry: { $gt: Date.now() } 
        }); 
 
        if(!foundUser){ 
            return res.status(400).json({ 
                message: "Invalid or expired reset link", 
                success: false 
            }); 
        } 
 
        const hashedPassword = await bcrypt.hash(newPassword, 10); 
        foundUser.password = hashedPassword; 
        foundUser.resetPasswordToken = undefined; 
        foundUser.resetPasswordExpiry = undefined; 
        await foundUser.save(); 
 
        return res.status(200).json({ 
            message: "Password reset successfully. You can now login.", 
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
//update profile 
export const updateProfile = async (req,res) =>{ 
    try{ 
        const {fullname,email, phoneNumber,bio,skills,city,qualification,experience,jobPreference } = req.body; 
        const file = req.file; 
 
        let skillsArray; 
        if(skills){ 
            skillsArray = skills.split(",").map((skill) => skill.trim()); 
        } 
        
        const userId = req.id; 
        let user = await User.findById(userId); 
 
        if(!user){ 
            return res.status(400).json({ 
                message: "User not found.", 
                success: false 
            }) 
        } 

        if(!user.profile){
            user.profile = {};
        }

        if(fullname !== undefined){ 
            if(user.role === "recruiter") user.companyName = fullname; 
            else user.fullname = fullname; 
        } 
        if(email !== undefined) user.email= email 
        if(phoneNumber !== undefined) user.phoneNumber= phoneNumber 
        if(bio !== undefined) user.profile.bio = bio 
        if(skills !== undefined) user.profile.skills = skillsArray || [] 
        if(city !== undefined) user.profile.city = city 
        if(qualification !== undefined) user.profile.qualification = qualification 
        if(experience !== undefined) user.profile.experience = experience 
        if(jobPreference !== undefined) user.profile.jobPreference = jobPreference 
 
        // resume upload 
        if(file){ 
            const fileUri = getDataUri(file); 
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { 
                resource_type: "raw" 
            }); 
            user.profile.resume = cloudResponse.secure_url; 
            user.profile.resumeOriginalname = file.originalname; 
        } 
 
        await user.save(); 
        user= { 
            _id : user._id, 
            fullname: user.role === "recruiter" ? user.companyName : user.fullname, 
            email:user.email, 
            phoneNumber:user.phoneNumber, 
            role: user.role, 
            profile:user.profile, 
            savedJobs: user.savedJobs 
        } 
        return res.status(200).json({ 
            message:"profile updated successfully.", 
            user, 
            success: true 
        }) 
 
    } 
    catch(error){ 
        console.log(error); 
        return res.status(500).json({ 
            message: "Server error", 
            success: false 
        }); 
    } 
} 
 
//save jobs 
export const toggleSaveJob = async (req,res) =>{ 
    try{ 
        const userId = req.id; 
        const jobId = req.params.id; 
 
        const foundUser = await User.findById(userId); 
        if(!foundUser){ 
            return res.status(404).json({ 
                message: "User not found", 
                success: false 
            }); 
        } 
 
        if(!foundUser.savedJobs) foundUser.savedJobs = []; 
 
        const alreadySaved = foundUser.savedJobs.includes(jobId); 
 
        if(alreadySaved){ 
            foundUser.savedJobs = foundUser.savedJobs.filter((id) => id.toString() !== jobId); 
        } else { 
            foundUser.savedJobs.push(jobId); 
        } 
 
        await foundUser.save(); 
 
        return res.status(200).json({ 
            message: alreadySaved ? "Job unsaved" : "Job saved", 
            success: true, 
            savedJobs: foundUser.savedJobs 
        }); 
 
    }catch(error){ 
        console.log(error); 
        return res.status(500).json({ 
            message: "Server error", 
            success: false 
        }); 
    } 
} 
 
//saved jobs 
export const getSavedJobs = async (req,res) =>{ 
    try{ 
        const userId = req.id; 
        const foundUser = await User.findById(userId).populate({ 
            path: "savedJobs", 
            populate: { path: "company" } 
        }); 
 
        if(!foundUser){ 
            return res.status(404).json({ 
                message: "User not found", 
                success: false 
            }); 
        } 
        return res.status(200).json({ 
            savedJobs: foundUser.savedJobs, 
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