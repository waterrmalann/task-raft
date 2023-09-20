import nodemailer from 'nodemailer';

var domain;
var transporter;
export default function setupMailer() {
    transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT || 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    domain = process.env.DOMAIN || 'http://localhost:3000';
}

export function getVerificationLink(userId, code) {
    return `${domain}/verify/${code}?uid=${userId}`;
}

export function getInviteLink(boardId) {
    return `${domain}/dash/boards/${boardId}/invite`;
}

// Function to send OTP email
export function sendOTPEmail(emailAddress, otp) {
    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: emailAddress,
        subject: 'TaskRaft 2FA Password',
        html: `
      <h1>Multi-Factor Authentication</h1>
      <p>You just requested to log in, here is your OTP.</p>
      <h2 style="font-size: 24px;">${otp}</h2>
      <p>Please use this OTP to log in to your account.</p>
      <p>If you didn't request this OTP, ignore this email.</p>
      <p>~ TaskRaft</p>
    `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending OTP email:', error);
        } else {
            console.log(`📧 [mail] Mail sent to ${emailAddress} for 2FA [${info.response}]`);
        }
    });
}

export function sendVerificationEmail(emailAddress, verificationLink) {
    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: emailAddress,
        subject: 'TaskRaft Email Verification',
        html: `
      <h1>Email Verification</h1>
      <p>Thank you for signing up! Please click the button below to verify your email:</p><br />
      <a href="${verificationLink}">Verify Email</a><br />
      <p>If you did not request this verification, you can ignore this email.</p>
      <p>~ TaskRaft</p>
    `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending verification email:', error);
        } else {
            console.log(`📧 [mail] Mail sent to ${emailAddress} for Verification [${info.response}]`);
        }
    });
}

export function sendBoardInvite(emailAddress, boardName, inviteLink) {
    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: emailAddress,
        subject: 'TaskRaft Board Invite',
        html: `
      <h1>You have been invited to collaborate on "${boardName}" board.</h1>
      <a href="${inviteLink}">Accept Invitation</a><br />
      <p>If you do not wish to accept, you can ignore this email.</p>
      <p>~ TaskRaft</p>
    `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending collaboration invite email:', error);
        } else {
            console.log(`📧 [mail] Mail sent to ${emailAddress} for Collaboration [${info.response}]`);
        }
    });
}