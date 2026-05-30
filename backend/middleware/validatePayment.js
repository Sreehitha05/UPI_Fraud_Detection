const UPI_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
const { normalizeMobile } = require("../utils/otpStore");

const validatePayment = (req, res, next) => {
    const { sender, receiver, amount, otp, mobile } = req.body;

    if (!sender || !receiver || amount == null || !otp || !mobile) {
        return res.status(400).json({
            message: "Fill in UPI ID, receiver, amount, mobile, and OTP"
        });
    }

    const senderId = String(sender).trim();
    const receiverId = String(receiver).trim();
    const numericAmount = Number(amount);
    const mobileDigits = normalizeMobile(mobile);

    if (!UPI_PATTERN.test(senderId) || !UPI_PATTERN.test(receiverId)) {
        return res.status(400).json({
            message: "Check UPI ID format (name@bank)"
        });
    }

    if (!mobileDigits) {
        return res.status(400).json({
            message: "Enter the same 10-digit mobile used for OTP"
        });
    }

    if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0 ||
        numericAmount > 1_000_000
    ) {
        return res.status(400).json({
            message: "Amount must be between 1 and 1000000"
        });
    }

    if (!/^\d{4}$/.test(String(otp).trim())) {
        return res.status(400).json({
            message: "OTP must be 4 digits"
        });
    }

    req.body = {
        sender: senderId,
        receiver: receiverId,
        amount: numericAmount,
        otp: String(otp).trim(),
        mobile: mobileDigits
    };

    next();
};

module.exports = validatePayment;
