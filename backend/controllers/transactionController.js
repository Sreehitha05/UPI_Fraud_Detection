const Transaction = require("../models/Transaction");

const listTransactions = async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 50, 100);
        const filter = {};

        if (req.query.sender) {
            filter.sender = String(req.query.sender).trim().toLowerCase();
        }

        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .select(
                "sender receiver amount fraudScore ruleScore aiPrediction status riskBand blockReason processingMs createdAt"
            )
            .lean();

        res.status(200).json({ transactions });
    } catch (error) {
        console.error("listTransactions:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { listTransactions };
