import nodemailer from 'nodemailer';
import { ResetPasswordOptions } from '../types/auth';

const sendEmail = (options: ResetPasswordOptions) => {
  const transport = nodemailer.createTransport({
    //@ts-ignore
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT!,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  transport.sendMail({
    from:process.env.SMTP_FROM_EMAIL,
    to:options.email,
    subject:options.subject,
    text:options.message
  }).then((messageId)=>{
    console.log(`Email sent - ${messageId}`)
  })
};

export default sendEmail;
