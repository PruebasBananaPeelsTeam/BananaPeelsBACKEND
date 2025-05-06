import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // tuemail@gmail.com
        pass: process.env.EMAIL_PASS, // app password
    },
});

export const sendResetPasswordEmail = async (to, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;

    await transporter.sendMail({
        from: `"Wallaclone" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Reset your password',
        headers: {
            'X-Mailer': 'Nodemailer',
            'X-Priority': '3',
            'X-Company': 'Wallaclone',
        },
        html: `
      <p>Hola, has solicitado restablecer tu contraseña.<br>
Hello, you have requested to reset your password.</p>

<p>
Puedes hacerlo desde este enlace:<br>
You can do so using the following link:<br>
<a href="${resetUrl}">${resetUrl}</a>
</p>

<p>
Si no has sido tú, ignora este mensaje.<br>
If this wasn't you, please ignore this message.
</p>

    `,
    });
};
