import asyncHandler from "express-async-handler";
import User from '../models/userModel.js';
import Board from '../models/boardModel.js';
import generateToken from "../utils/generateTokens.js";
import { getVerificationLink, sendOTPEmail, sendVerificationEmail } from "../utils/mailer.js";
import { generateOTP, generateVerificationCode } from "../utils/utils.js";

// @desc    Auth user/set token
// route    POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const {username, password, otp} = req.body;

    // Grab the user from the database
    const user = await User.findOne({email: username}) || await User.findOne({username});
    if (user && (await user.matchPassword(password))) {

        if (!user.verified) {
            res.status(400);
            throw new Error("Unverified email address.");
        }

        if (user.preferences.mfa) {
            // If an OTP was passed alongside the request body.
            if (otp) {
                if (await user.matchOTP(otp)) {
                    console.log("Matched");
                    const success = await user.clearOTP();
                    if (!success) {
                        throw new Error("Could not invalidate OTP.");
                    }
                } else {
                    console.log("Unmatched");
                    throw new Error("Invalid credentials.");
                }
            } else {
                // If the user has multi-factor authentication enabled, we give them a partial user data.
                // And mail them an OTP to login.
                const otp = generateOTP();
                sendOTPEmail(user.email, otp);
                await user.setOTP(otp.toString());
    
                res.status(201).json({
                    success: true,
                    user: {
                        _id: user._id,
                        name: '',
                        username: user.username,
                        email: user.email,
                        premium: false,
                        preferences: {
                            emailNotifications: false,
                            mfa: user.preferences.mfa
                        },
                        boards: []
                    }
                })
                return;
            }

        }

        const boards = await Board.find({createdBy: user._id})
        .select('_id title')
        .sort({ modifiedAt: -1 }) // latest first
        .lean();
    console.log("Boards: " + boards);
        generateToken(res, user._id);
        res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                name: user?.name,
                username: user.username,
                email: user.email,
                premium: user.premium,
                preferences: {
                    emailNotifications: user.preferences.emailNotifications,
                    mfa: user.preferences.mfa
                },
                boards: [...boards]
            }
        })
        console.log(`🔰 [login] @${user.username} has logged in.`);
    } else {
        res.status(401);
        throw new Error("Invalid email or password.");
    }
})

// @desc    Register a new user
// route    POST /api/user
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({email}) || await User.findOne({username});
    if (existingUser) {
        // If a pre-existing account with matching credentials was found to be unverified,
        // We can simply remove the account.
        if (existingUser.verified) {
            res.status(400);
            throw new Error("User already exists.");
        } else {
            // todo: Check if the existingUser.verificationExpiry < new Date();
            // This is so that someone who just created an account will get a window of time to verify their email.
            //? But should it be done?
            await existingUser.deleteOne();
        }
    }

    const user = await User.create({username, email, password});
    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            success: true,
            message: "Account has been registered successfully."
        });
        console.log(`✨ [register] @${user.username} has registered an account.`);
        const code = generateVerificationCode();
        const success = await user.setVerificationCode(code);
        if (!success) {
            throw new Error("Unable to set verification code.");
        }
        const link = getVerificationLink(user._id, code);

        sendVerificationEmail(user.email, link);
    } else {
        res.status(400);
        throw new Error("Invalid user data.");
    }
})

// @desc    Logs out user
// route    POST /api/user/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ success: true, message: "User logged out." })
})

// @desc    Verify an account with code.
// route    GET /api/user/verify/:code
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const verificationCode = req.params.code;
    const uid = req.query.uid;
    if (!uid) {
        res.status(400);
        throw new Error("Invalid verification link.")
    }
    const user = await User.findById(uid);
    if (user && await user.matchVerificationCode(verificationCode)) {
        const result = await user.verify();
        if (!result) {
            throw new Error("Couldn't verify.");
        }
        res.json({success: true, message: "Verified successfully."})
        console.log(`✨ [register] @${user.username} has verified their mail.`);
    } else {
        throw new Error("Invalid verification token.");
    }
});

// @desc    Retrieve information about the authenticated user.
// route    GET /api/user
// @access  Private
const getUserData = asyncHandler(async (req, res) => {
    const boards = await Board.find({createdBy: req.user._id})
        .select('_id title')
        .sort({ modifiedAt: -1 }) // latest first
        .lean();

    const userData = {
        _id: req.user._id,
        name: req.user?.name,
        username: req.user.username,
        email: req.user.email,
        premium: req.user.premium,
        preferences: {
            ...req.user.preferences
        },
        boards: [
            ...boards
        ]
    }
    res.status(200).json(userData);
});

// @desc    Update information of the authenticated user.
// route    PATCH /api/user/profile
// @access  Private
const updateUserData = asyncHandler(async (req, res) => {
    const newData = req.body;
    const user = await User.findById(req.user.id);
    if (newData?.name) {
        user.name = newData.name;
    }

    if (newData?.username && newData.username !== user.username) {
        const hasUser = await User.find({username: newData.username});
        if (hasUser) {
            return res.json({success: false, message: "Username is not available."})
        }
        user.username = newData.username;
    }
    if (newData?.email && newData.email !== user.email) {
        const hasUser = await User.find({email: newData.email});
        if (hasUser) {
            return res.json({success: false, message: "Email address is not available."})
        }
        user.email = newData.email;
    }

    if (newData?.preferences) {
        user.preferences = newData.preferences;
    }
    const updated = await user.save();
    res.json({success: true, message: "Account details have been updated."})
});

export default {
    loginUser,
    registerUser,
    logoutUser,
    verifyEmail,
    getUserData,
    updateUserData,
}