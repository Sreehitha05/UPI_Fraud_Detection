const Transaction = require("../models/Transaction");
const { isModelReady } = require("../utils/onnxPrediction");

const getAnalytics = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .select(
                "sender receiver amount fraudScore status riskBand blockReason processingMs createdAt"
            )
            .lean();

        const total = transactions.length;
        const success = transactions.filter(
            (txn) => txn.status === "SUCCESS"
        ).length;
        const mfa = transactions.filter((txn) => txn.status === "MFA").length;
        const blocked = transactions.filter(
            (txn) => txn.status === "BLOCKED"
        ).length;

        const fraudRate =
            total > 0
                ? Number(((blocked / total) * 100).toFixed(1))
                : 0;

        const flaggedRate =
            total > 0
                ? Number((((blocked + mfa) / total) * 100).toFixed(1))
                : 0;

        const avgRiskScore =
            total > 0
                ? Number(
                      (
                          transactions.reduce(
                              (sum, txn) => sum + (txn.fraudScore || 0),
                              0
                          ) / total
                      ).toFixed(3)
                  )
                : 0;

        const latencies = transactions
            .map((txn) => txn.processingMs)
            .filter((ms) => typeof ms === "number");

        const avgLatencyMs =
            latencies.length > 0
                ? Math.round(
                      latencies.reduce((a, b) => a + b, 0) / latencies.length
                  )
                : null;

        const senderMap = {};

        for (const txn of transactions) {
            if (!senderMap[txn.sender]) {
                senderMap[txn.sender] = {
                    sender: txn.sender,
                    count: 0,
                    blocked: 0,
                    totalScore: 0
                };
            }

            senderMap[txn.sender].count += 1;
            senderMap[txn.sender].totalScore += txn.fraudScore || 0;

            if (txn.status === "BLOCKED") {
                senderMap[txn.sender].blocked += 1;
            }
        }

        const topSuspiciousSenders = Object.values(senderMap)
            .map((entry) => ({
                sender: entry.sender,
                transactions: entry.count,
                blocked: entry.blocked,
                avgRiskScore: Number(
                    (entry.totalScore / entry.count).toFixed(2)
                )
            }))
            .sort((a, b) => b.avgRiskScore - a.avgRiskScore)
            .slice(0, 5);

        const riskTrend = [...transactions]
            .reverse()
            .slice(-20)
            .map((txn) => ({
                time: txn.createdAt,
                fraudScore: txn.fraudScore,
                status: txn.status
            }));

        res.status(200).json({
            summary: {
                total,
                success,
                mfa,
                blocked,
                fraudRate,
                flaggedRate,
                avgRiskScore,
                avgLatencyMs
            },
            decisionBreakdown: [
                { status: "SUCCESS", label: "Successful", count: success },
                { status: "MFA", label: "On hold", count: mfa },
                { status: "BLOCKED", label: "Declined", count: blocked }
            ],
            riskTrend,
            topSuspiciousSenders,
            modelReady: isModelReady()
        });
    } catch (error) {
        console.error("getAnalytics:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getAnalytics };
