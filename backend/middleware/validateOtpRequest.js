const UPI_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
const { normalizeMobile } = require("../utils/otpStore");

const validateOtpRequest = (req, res, next) => {
    const { sender, mobile } = req.body;

    if (!sender || !mobile) {
        return res.status(400).json({
            message: "UPI ID and mobile number are required"
        });
    }

    const senderId = String(sender).trim();

    if (!UPI_PATTERN.test(senderId)) {
        return res.status(400).json({
            message: "Check UPI ID format (name@bank)"
        });
    }

    const mobileDigits = normalizeMobile(mobile);

    if (!mobileDigits) {
        return res.status(400).json({
            message: "Enter a valid 10-digit mobile number"
        });
    }

    req.body.sender = senderId;
    req.body.mobile = mobileDigits;
    next();
};

module.exports = validateOtpRequest;
