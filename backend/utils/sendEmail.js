const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const sendBrevoEmail = async ({ toEmail, toName, subject, html }) => {
    const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: { name: "Job Portal", email: process.env.SENDER_EMAIL },
            to: [{ email: toEmail, name: toName || toEmail }],
            subject,
            htmlContent: html
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.log("Brevo API error:", errorData);
        throw new Error("Failed to send email");
    }

    return response.json();
};

export const sendVerificationEmail = async (toEmail, token) => {
    const verifyUrl = `${process.env.CLIENT_URL}/verify/${token}`;

    await sendBrevoEmail({
        toEmail,
        subject: "Verify your email",
        html: `
            <h2>Email Verification</h2>
            <p>Click the link below to verify your account:</p>
            <a href="${verifyUrl}">${verifyUrl}</a>
            <p>This link will expire in 1 hour.</p>
        `
    });
};

export const sendStatusUpdateEmail = async (toEmail, applicantName, jobTitle, status) => {
    await sendBrevoEmail({
        toEmail,
        toName: applicantName,
        subject: `Application Status Update - ${jobTitle}`,
        html: `
            <h2>Hi ${applicantName},</h2>
            <p>Your application for <b>${jobTitle}</b> has been <b>${status}</b>.</p>
            <p>Login to your account to see more details.</p>
        `
    });
};

export const sendResetPasswordEmail = async (toEmail, token) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendBrevoEmail({
        toEmail,
        subject: "Reset your password",
        html: `
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link will expire in 15 minutes. If you didn't request this, ignore this email.</p>
        `
    });
};