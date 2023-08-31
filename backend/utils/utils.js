import crypto from 'crypto';

/**
 * Get a future date by adding a specified time to the current time.
 * @param {number} time - The time in milliseconds to add to the current time.
 * @returns {Date} - The future date.
 */
export function getFutureDate(time) {
    const currentTime = new Date();
    return new Date(currentTime.getTime() + time);
}

/**
 * Generate random bytes and return them as a Base64-encoded string.
 * @param {number} length - The number of random bytes to generate.
 * @returns {string} - Base64-encoded random bytes.
 */
function generateRandomBase64Bytes(length) {
    const buffer = crypto.randomBytes(length);
    return buffer.toString('base64url');
}

/**
 * Generate a random 5-digit OTP (One-Time Password).
 * @returns {number} - The generated OTP.
 */
export function generateOTP() {
    const min = 10000;
    const max = 99999;
    const randomNumber = Math.floor(min + Math.random() * (max - min + 1));
    return randomNumber;
}

/**
 * Generate a random verification code using Base64 encoding.
 * @returns {string} - The generated verification code.
 */
export function generateVerificationCode() {
    const code = generateRandomBase64Bytes(32);
    return code;
}