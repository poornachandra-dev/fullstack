import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import nodemailer from 'nodemailer';


const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRECT);
}

//login user Function
const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await UserModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"User Does't Exists."})
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Enter Correct Password."})
        }

        const token = createToken(user._id);
        res.json({success:true,token,name:user.name});
    }
    catch(error){
        console.log(error);
        return res.json({success:false,message:"Error"});
    }
}



//register User Function
const registerUser = async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        // Checking if the user already exists
        const exists = await UserModel.findOne({email});
        if(exists){
            return res.json({success:false,message:"User already exists"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid Email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Please enter a strong password"})
        }

        // hashing the user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new UserModel({
            name : name,
            email : email,
            password : hashedPassword,
        })

        const user = await newUser.save();
        const token = createToken(user._id)

        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: 'no-reply@artspire.com', // Sender address
            to: email, // List of recipients (e.g., the new user's email)
            subject: 'Welcome to ArtSpire!', // Subject line
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                  .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                  h1 { color: #333333; }
                  p { color: #666666; line-height: 1.5; }
                  .button { display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px; }
                  .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888888; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Welcome to ArtSpire!</h1>
                  <p>Hi ${name},</p>
                  <p>Thank you for joining ArtSpire, the platform where creativity meets technology! We’re thrilled to have you as part of our community of artists and art lovers.</p>
                  <p>With your new account, you can now:</p>
                  <ul>
                    <li>Upload your own art and images to showcase your creativity</li>
                    <li>Explore and admire stunning artwork from our global community</li>
                    <li>Create AI-generated images to bring your imagination to life</li>
                  </ul>
                  <p>If you ever need help, don’t hesitate to contact us. We’re here to assist you on your creative journey!</p>
                  <a href="https://artspire.onrender.com" class="button">Go to Website</a>
                  <p>Happy creating!<br/>The ArtSpire Team</p>
                  <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} ArtSpire. All rights reserved.</p>
                    <p>If you didn’t create this account, please ignore this email.</p>
                  </div>
                </div>
              </body>
              </html>
            `
        };

        await transporter.sendMail(mailOptions).then(() => {
            console.log('Email sent successfully');
        }).catch((error) => {
            console.error('Error sending email:', error);
        });

        res.json({success:true,token,name:user.name});
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP and its expiry (10 minutes)
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;

        await user.save();
        
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: 'no-reply@artspire.com',
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}. This OTP will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to your email' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error sending OTP', error: err.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await UserModel.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() } // Ensure OTP hasn't expired
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid OTP or it has expired" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear OTP fields
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });

    } catch (err) {
        res.status(500).json({ message: 'Error resetting password', error: err.message });
    }
};

export {loginUser,registerUser,forgotPassword,resetPassword}