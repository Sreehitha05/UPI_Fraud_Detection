const Transaction = require("../models/Transaction");
const detectFraud = require("../utils/fraudDetection");
const buildFeatures = require("../utils/featureBuilder");
const buildFraudReason = require("../utils/fraudReason");
const { decideRisk } = require("../utils/riskDecision");
const { verifyOtp } = require("../utils/otpStore");
const {
    predictFraud,
    isModelReady
} = require("../utils/onnxPrediction");

const ML_WEIGHT = Number(process.env.ML_WEIGHT) || 0.5;

const processPayment = async (req, res) => {
    const startedAt = performance.now();

    try {
        const { sender, receiver, amount, otp } = req.body;

        if (!verifyOtp(sender, otp, req.body.mobile)) {
            return res.status(401).json({
                message: "Wrong OTP, expired OTP, or mobile does not match"
            });
        }

        const previousTransactions = await Transaction.find({ sender })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("amount receiver status createdAt")
            .lean();

        const ruleScore = detectFraud(amount, previousTransactions);

        let aiPrediction = 0;

        if (isModelReady()) {
            const features = buildFeatures(
                amount,
                previousTransactions
            );

            aiPrediction = await predictFraud(features);
        }

        const fraudScore = Number(
            Math.min(ruleScore + aiPrediction * ML_WEIGHT, 1).toFixed(2)
        );

        const { status, riskBand, message } = decideRisk(fraudScore);
        const blockReason = buildFraudReason(
            amount,
            previousTransactions,
            fraudScore
        );

        const processingMs = Math.round(performance.now() - startedAt);

        const transaction = await Transaction.create({
            sender,
            receiver,
            amount,
            fraudScore,
            ruleScore,
            aiPrediction,
            status,
            riskBand,
            blockReason,
            processingMs
        });

        const io = req.app.get("io");
        const eventPayload = {
            _id: transaction._id,
            sender,
            receiver,
            amount,
            fraudScore,
            ruleScore,
            aiPrediction,
            status,
            riskBand,
            blockReason,
            processingMs,
            createdAt: transaction.createdAt
        };

        io.emit("newTransaction", eventPayload);

        res.status(200).json({
            message,
            fraudScore,
            ruleScore,
            aiPrediction,
            status,
            riskBand,
            blockReason,
            processingMs,
            transaction: {
                _id: transaction._id,
                sender: transaction.sender,
                receiver: transaction.receiver,
                amount: transaction.amount,
                fraudScore: transaction.fraudScore,
                status: transaction.status,
                riskBand: transaction.riskBand,
                blockReason: transaction.blockReason,
                processingMs: transaction.processingMs,
                createdAt: transaction.createdAt
            }
        });
    } catch (error) {
        console.error("processPayment:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { processPayment };
