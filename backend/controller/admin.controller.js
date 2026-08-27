import { user as User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// dashboard stats
export const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalRecruiters = await User.countDocuments({ role: "recruiter" });
        const totalJobs = await Job.countDocuments();
        const pendingJobs = await Job.countDocuments({ status: "pending" });
        const approvedJobs = await Job.countDocuments({ status: "approved" });
        const totalCompanies = await Company.countDocuments();
        const totalApplications = await Application.countDocuments();

        return res.status(200).json({
            success: true,
            stats: {
                totalStudents,
                totalRecruiters,
                totalJobs,
                pendingJobs,
                approvedJobs,
                totalCompanies,
                totalApplications
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// get all users (students + recruiters)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } })
            .select("-password -verificationToken -resetPasswordToken")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// delete a user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        if (targetUser.role === "admin") {
            return res.status(400).json({
                message: "Cannot delete an admin account",
                success: false
            });
        }

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            message: "User deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// get all companies
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find()
            .populate("userId", "companyName email")
            .sort({ createdAt: -1 })
            .lean();

        const companiesWithJobCount = await Promise.all(
            companies.map(async (c) => ({
                ...c,
                jobCount: await Job.countDocuments({ company: c._id })
            }))
        );

        return res.status(200).json({
            success: true,
            companies: companiesWithJobCount
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// delete a company
export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        await Company.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Company deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};