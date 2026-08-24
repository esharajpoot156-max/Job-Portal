import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const registerCompany = async (req, res) => {
    try {
        const {
            companyName,
            email,
            website,
            location,
            industry,
            companySize,
            foundedYear,
            description
        } = req.body;

        if (!companyName || !email || !location || !industry || !description) {
            return res.status(400).json({
                message: "Company name, email, location, industry, and description are required",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "Company Name is already registered.",
                success: false
            });
        }

        let logoUrl;
        const file = req.file;
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logoUrl = cloudResponse.secure_url;
        }

        company = await Company.create({
            name: companyName,
            email,
            website,
            location,
            industry,
            companySize,
            foundedYear,
            description,
            logo: logoUrl,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company Successfully Registered....",
            company,
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

//getCompany by user id
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }
        return res.status(200).json({
            companies,
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

//get Company by company ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not Found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
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

//updateCompany
export const updateCompany = async (req, res) => {
    try {
        const {
            name,
            email,
            description,
            website,
            location,
            industry,
            companySize,
            foundedYear
        } = req.body;
        const file = req.file;

        const updateData = {
            name,
            email,
            description,
            website,
            location,
            industry,
            companySize,
            foundedYear
        };
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
        }
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Company information is updated.",
            company,
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
