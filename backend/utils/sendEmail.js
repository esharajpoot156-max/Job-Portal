import nodemailer from "nodemailer";

export const sendVerificationEmail = async (toEmail, token) => {
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_SMTP_USER,
            pass: process.env.BREVO_SMTP_PASS
        }
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify/${token}`;

    await transporter.sendMail({
        from: `"Job Portal" <${process.env.SENDER_EMAIL}>`,
        to: toEmail,
        subject: "Verify your email",
        html: `
            <h2>Email Verification</h2>
            <p>Click the link below to verify your account:</p>
            <a href="${verifyUrl}">${verifyUrl}</a>
            <p>This link will expire in 1 hour.</p>
        `
    });
};
// notification 
export const sendStatusUpdateEmail = async (toEmail, applicantName, jobTitle, status) => {
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_SMTP_USER,
            pass: process.env.BREVO_SMTP_PASS
        }
    });

    await transporter.sendMail({
        from: `"Job Portal" <${process.env.SENDER_EMAIL}>`,
        to: toEmail,
        subject: `Application Status Update - ${jobTitle}`,
        html: `
            <h2>Hi ${applicantName},</h2>
            <p>Your application for <b>${jobTitle}</b> has been <b>${status}</b>.</p>
            <p>Login to your account to see more details.</p>
        `
    });
};
//reset password
export const sendResetPasswordEmail = async (toEmail, token) => {
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_SMTP_USER,
            pass: process.env.BREVO_SMTP_PASS
        }
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await transporter.sendMail({
        from: `"Job Portal" <${process.env.SENDER_EMAIL}>`,
        to: toEmail,
        subject: "Reset your password",
        html: `
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link will expire in 15 minutes. If you didn't request this, ignore this email.</p>
        `
    });
};

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
    }
});

export default transporter;