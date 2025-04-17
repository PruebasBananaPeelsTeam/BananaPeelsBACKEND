import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export const sendResetPasswordEmail = async (to, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
        from: `"Wallaclone Support" <${process.env.EMAIL_USER}>`, // 👈 así se pone nombre + email correctamente
        to,
        subject: "Password Recovery",
        html: `
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
        `,
    });
};
