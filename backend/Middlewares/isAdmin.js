import { user as User } from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
    try {
        const userId = req.id;
        const foundUser = await User.findById(userId);

        if (!foundUser || foundUser.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admins only.",
                success: false
            });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export default isAdmin;