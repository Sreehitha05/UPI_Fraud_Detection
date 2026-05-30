const ALLOW_MAX = Number(process.env.ALLOW_THRESHOLD) || 0.5;
const BLOCK_MIN = Number(process.env.BLOCK_THRESHOLD) || 0.85;

const decideRisk = (fraudScore) => {
    const score = Number(fraudScore) || 0;

    if (score < ALLOW_MAX) {
        return {
            status: "SUCCESS",
            riskBand: "LOW",
            message: "Payment successful"
        };
    }

    if (score < BLOCK_MIN) {
        return {
            status: "MFA",
            riskBand: "MEDIUM",
            message:
                "Payment on hold. Complete verification in your bank app to finish."
        };
    }

    return {
        status: "BLOCKED",
        riskBand: "HIGH",
        message: "Payment failed. Money was not sent."
    };
};

module.exports = {
    decideRisk,
    ALLOW_MAX,
    BLOCK_MIN
};
