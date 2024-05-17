import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL!,
            pass: process.env.EMAIL_PASSWORD!
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: text
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}