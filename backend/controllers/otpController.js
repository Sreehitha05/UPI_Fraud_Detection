const { setOtp } = require("../utils/otpStore");

const requestOtp = (req, res) => {
    const { sender, mobile } = req.body;
    const result = setOtp(sender, mobile);

    if (result.error) {
        return res.status(400).json({ message: result.error });
    }

    if (process.env.NODE_ENV !== "production") {
        console.log(
            `[OTP] ${sender} · mobile ${result.masked} · code ${result.otp} (server log only — not sent to browser)`
        );
    }

    res.status(200).json({
        message: `OTP sent to ${result.masked}`,
        maskedMobile: result.masked,
        expiresInSeconds: 300
    });
};

module.exports = { requestOtp };
