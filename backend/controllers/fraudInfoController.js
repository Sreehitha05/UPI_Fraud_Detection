const Transaction = require("../models/Transaction");
const { isModelReady } = require("../utils/onnxPrediction");
const {
    detectionRules,
    decisionSteps,
    thresholds
} = require("../utils/fraudRulesInfo");

const getFraudInfo = (req, res) => {
    res.status(200).json({
        thresholds,
        decisionSteps,
        detectionRules,
        modelReady: isModelReady()
    });
};

const getFraudReport = async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 50, 100);

        const declined = await Transaction.find({ status: "BLOCKED" })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select(
                "sender receiver amount fraudScore ruleScore aiPrediction blockReason createdAt status"
            )
            .lean();

        const onHold = await Transaction.find({ status: "MFA" })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select(
                "sender receiver amount fraudScore blockReason createdAt status"
            )
            .lean();

        res.status(200).json({
            declined,
            onHold,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("getFraudReport:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getFraudInfo, getFraudReport };
