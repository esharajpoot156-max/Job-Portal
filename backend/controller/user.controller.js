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
        const {fullname,email, phoneNumber, password, role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role)
        {
            return res.status(400).json({
                message: "Something is missing ",
                success: false
            });
        };
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
            fullname,
            email,
            phoneNumber,
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
            fullname:existingUser.fullname,
            email:existingUser.email,
            phoneNumber:existingUser.phoneNumber,
            role: existingUser.role,
            profile:existingUser.profile
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
//forgot password - request reset link
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

//reset password - set new password
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
        const {fullname,email, phoneNumber,bio,skills } = req.body;
        const file = req.file;

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
       
        const userId = req.id;
        let user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        if(fullname) user.fullname = fullname
        if(email) user.email= email
        if(phoneNumber) user.phoneNumber= phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray

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
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role: user.role,
            profile:user.profile
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