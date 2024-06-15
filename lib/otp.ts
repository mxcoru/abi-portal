const VALID_OTP_CHARS = "0123456789";
const VALID_OTP_LENGTH = 6;

export function generateOTP(): string {
    let otp = "";

    for (let i = 0; i < VALID_OTP_LENGTH; i++) {
        otp += VALID_OTP_CHARS.charAt(Math.floor(Math.random() * VALID_OTP_CHARS.length));
    }

    return otp;
}