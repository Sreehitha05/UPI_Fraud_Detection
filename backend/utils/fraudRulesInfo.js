const { ALLOW_MAX, BLOCK_MIN } = require("./riskDecision");

const detectionRules = [
    {
        id: "high_amount",
        title: "Large payment",
        check: "Amount greater than ₹20,000",
        scoreImpact: "+0.50 to risk score",
        declineRole: "Can push score toward decline when combined with other signals"
    },
    {
        id: "escalation",
        title: "Amount spike (AER)",
        check: "Current amount is more than 10× your recent average",
        scoreImpact: "+0.50",
        declineRole: "Typical probe-then-steal pattern after small test payments"
    },
    {
        id: "velocity",
        title: "Too many payments quickly",
        check: "3 or more payments in the last 5 minutes",
        scoreImpact: "+0.30",
        declineRole: "Sudden burst activity before a large transfer"
    },
    {
        id: "probe_steal",
        title: "Small payments then large transfer",
        check: "At least 2 payments under ₹50, then a payment over ₹10,000",
        scoreImpact: "+0.50",
        declineRole: "Matches OTP bypass / account takeover behaviour"
    },
    {
        id: "same_receiver",
        title: "Repeated payee in short time",
        check: "2+ payments to same receiver in 5 minutes, amount over ₹5,000",
        scoreImpact: "+0.20",
        declineRole: "Unusual concentration to one receiver"
    },
    {
        id: "ml_model",
        title: "ML model (ONNX)",
        check: "Past payments, amounts, timing, and patterns as features",
        scoreImpact: "Adds up to 50% of model output to final score",
        declineRole: "Catches patterns not covered by rules alone"
    }
];

const decisionSteps = [
    {
        step: 1,
        title: "Validate OTP",
        detail: "OTP must match the mobile number used when it was requested. Wrong or expired OTP stops the payment before any risk check."
    },
    {
        step: 2,
        title: "Load payment history",
        detail: "Last 10 payments for this UPI ID are loaded from the database to analyse behaviour (not just this one payment)."
    },
    {
        step: 3,
        title: "Calculate risk score",
        detail: `Rule score (0–1) plus ML score × 0.5, capped at 1.0.`
    },
    {
        step: 4,
        title: "Apply decision",
        detail: `Score below ${ALLOW_MAX} → Successful. ${ALLOW_MAX} to ${BLOCK_MIN} → On hold (extra verification). ${BLOCK_MIN} or above → Declined; money is not sent.`
    }
];

const thresholds = {
    allowBelow: ALLOW_MAX,
    holdBelow: BLOCK_MIN,
    blockAtOrAbove: BLOCK_MIN
};

module.exports = {
    detectionRules,
    decisionSteps,
    thresholds
};
