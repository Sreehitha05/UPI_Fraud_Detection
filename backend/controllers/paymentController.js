const Transaction = require("../models/Transaction");

const detectFraud = require("../utils/fraudDetection");

const {
    predictFraud
} = require("../utils/onnxPrediction");

const processPayment = async (req, res) => {

    try {

        const { sender, receiver, amount, otp } = req.body;

        // GET PREVIOUS TRANSACTIONS

        const previousTransactions =
            await Transaction.find({ sender })
            .sort({ createdAt: -1 })
            .limit(5);

        // RULE-BASED FRAUD SCORE

        const ruleScore =
            detectFraud(
                Number(amount),
                previousTransactions
            );

        // AI FEATURES

        const features =
            new Array(30).fill(0);

        features[0] = Number(amount);

        // AI PREDICTION

        const aiPrediction =
            await predictFraud(features);

        console.log(
            "AI Prediction:",
            aiPrediction
        );

        // FINAL FRAUD SCORE

        const fraudScore =
            Number(
                Math.min(
                    ruleScore + aiPrediction * 0.5,
                    1
                ).toFixed(2)
            );

        console.log(
            "Fraud Score:",
            fraudScore
        );

        // STATUS

        let status = "SUCCESS";

        if (fraudScore >= 0.7) {

            status = "BLOCKED";
        }

        // SAVE TRANSACTION

        const transaction =
            await Transaction.create({
                sender,
                receiver,
                amount,
                otp,
                fraudScore,
                status
            });

        // SOCKET.IO UPDATE

        const io = req.app.get("io");

        io.emit("newTransaction", {
            sender,
            receiver,
            amount,
            fraudScore,
            status
        });

        // RESPONSE

        res.status(200).json({

            message:
                status === "BLOCKED"
                    ? "Fraud Detected! Payment Blocked"
                    : "Payment Successful",

            fraudScore,
            aiPrediction,
            status,
            transaction
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    processPayment
};