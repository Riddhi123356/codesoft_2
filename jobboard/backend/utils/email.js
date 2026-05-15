const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: {
    rejectUnauthorized: false  
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: `"JobBoard" <${process.env.EMAIL_USER}>`, to, subject, html });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

const applicationReceivedEmail = (candidateName, jobTitle, company) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a56db; padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">Application Received!</h1>
  </div>
  <div style="padding: 30px; background: #f9fafb;">
    <p>Hi <strong>${candidateName}</strong>,</p>
    <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been successfully received.</p>
    <p>We'll notify you when the employer reviews your application.</p>
    <p style="color: #6b7280;">Best of luck!</p>
    <p>The JobBoard Team</p>
  </div>
</div>`;

const applicationStatusEmail = (candidateName, jobTitle, company, status) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a56db; padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">Application Update</h1>
  </div>
  <div style="padding: 30px; background: #f9fafb;">
    <p>Hi <strong>${candidateName}</strong>,</p>
    <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been updated to: <strong style="text-transform: capitalize;">${status}</strong>.</p>
    <p>Log in to your dashboard to view more details.</p>
    <p>The JobBoard Team</p>
  </div>
</div>`;

const newApplicationEmail = (employerName, candidateName, jobTitle) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a56db; padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">New Application!</h1>
  </div>
  <div style="padding: 30px; background: #f9fafb;">
    <p>Hi <strong>${employerName}</strong>,</p>
    <p><strong>${candidateName}</strong> has applied for your job posting: <strong>${jobTitle}</strong>.</p>
    <p>Log in to your employer dashboard to review the application.</p>
    <p>The JobBoard Team</p>
  </div>
</div>`;

module.exports = { sendEmail, applicationReceivedEmail, applicationStatusEmail, newApplicationEmail };
