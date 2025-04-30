import { Resend } from 'resend';

// Inicializamos Resend con tu API Key desde el .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Función para enviar el email de recuperación de contraseña
export const sendResetPasswordEmail = async (to, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await resend.emails.send({
        from: `"Wallaclone Support" <${process.env.EMAIL_FROM || 'wallaclone@resend.dev'}>`, // Puedes personalizar esto en el .env
        to,
        subject: 'Password Recovery',
        html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `,
    });
};
