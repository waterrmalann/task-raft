import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import { getFutureDate } from "../utils/utils.js";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        verified: {
            type: Boolean,
            required: true,
            default: false
        },
        password: {
            type: String,
            required: true,
        },
        premium: {
            type: Boolean,
            default: false,
            required: true
        },
        preferences: {
            emailNotifications: {
                type: Boolean,
                default: false,
                required: true
            },
            mfa: {
                type: Boolean,
                default: false,
                required: true
            }
        },
        otpRequested: {
            type: Boolean,
            default: false,
            required: true
        },
        otp: {
            type: String,
        },
        otpExpiry: {
            type: Date,
        },
        verificationCodeRequested: {
            type: Boolean,
            default: false,
            required: true
        },
        verificationCode: {
            type: String,
        },
        verificationCodeExpiry: {
            type: Date
        },
        recentBoards: [
            {
                boardName: { type: String },
                createdBy: { type: String },
                boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ]
    },
    {
        timestamps: true,
    }
);

userSchema.methods.setOTP = async function (otp) {
    try {
        this.otpRequested = true;
        this.otp = otp;
        this.otpExpiry = getFutureDate(4 * 60 * 1000); // 4 minutes

        await this.save();
        return true;
    } catch (error) {
        console.error("Error generating OTP:", error);
        return false;
    }
}

userSchema.methods.matchOTP = async function (code) {
    return this.otpRequested && code === this.otp && this.otpExpiry > new Date();
}

userSchema.methods.clearOTP = async function () {
    try {
        this.otpRequested = false;
        this.otp = '';
        this.otpExpiry = new Date(0);

        await this.save();
        return true;
    } catch (error) {
        console.error("Error clearing OTP:", error);
        return false;
    }
}

userSchema.methods.setVerificationCode = async function (code) {
    try {
        this.verificationCodeRequested = true;
        this.verificationCode = code;
        this.verificationCodeExpiry = getFutureDate(2 * 60 * 60 * 1000); // 2 hours

        await this.save();
        return true;
    } catch (error) {
        console.error("Error generating code", error);
        return false;
    }
}

userSchema.methods.matchVerificationCode = async function (code) {
    return this.verificationCodeRequested && code === this.verificationCode && this.verificationCodeExpiry > new Date();
}

userSchema.methods.verify = async function () {
    try {
        this.verified = true;
        this.verificationCodeRequested = false;
        this.verificationCode = '';
        this.verificationCodeExpiry = new Date(0);

        await this.save();
        return true;
    } catch (error) {
        console.error("Error verifying user:", error);
        return false;
    }
}

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;