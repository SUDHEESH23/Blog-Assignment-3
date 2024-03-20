const mongoose = require("mongoose");
const User = require("../models/user");
const multer = require("multer");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
require("dotenv").config();

// Configure multer for file upload
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: 'http://localhost:4000',
  service: "gmail",
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

exports.deliverOtp = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);

        // Find the user's email
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userEmail = user.email;

        // Generate OTP
        const otpToken = generateOTP();

        // Send order confirmation email with OTP
        await sendOrderConfirmationEmail(userEmail, otpToken);

        res.json({ success: true, message: "OTP delivered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

async function sendOrderConfirmationEmail(email, otpToken) {
    try {
        // Define email options 
        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: "Email Verification and OTP",
            html: `<p>Dear customer,</p><p>Your OTP for rmail confirmation is: <strong>${otpToken}</strong></p><p>Thank you for joining with us!</p>`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

exports.verifyOtp = async (req, res) => {
    try {
      const { otp } = req.params;
  
      // Optionally, you can handle the response accordingly
      res.json({ success: true, message: `Welcome User` });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  


const generateOTP = () => {
    return speakeasy.totp({
        secret: speakeasy.generateSecret({ length: 20 }).base32,
        encoding: "base32",
    });
};