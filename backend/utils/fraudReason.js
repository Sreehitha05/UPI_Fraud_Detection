const buildFraudReason = (amount, previousTransactions, fraudScore) => {
    const reasons = [];
    const txns = previousTransactions || [];

    if (amount > 20000) {
        reasons.push("Unusually large amount");
    }

    if (txns.length > 0) {
        const avg =
            txns.reduce((sum, txn) => sum + txn.amount, 0) / txns.length;

        if (avg > 0 && amount / avg > 10) {
            reasons.push("Much higher than your usual payments");
        }
    }

    const recent5min = txns.filter(
        (txn) =>
            Date.now() - new Date(txn.createdAt).getTime() < 5 * 60 * 1000
    ).length;

    if (recent5min >= 3) {
        reasons.push("Too many payments in a short time");
    }

    const smallPayments = txns.filter((txn) => txn.amount < 50);

    if (smallPayments.length >= 2 && amount > 10000) {
        reasons.push("Small payments followed by a large transfer");
    }

    if (fraudScore >= 0.85 && reasons.length === 0) {
        reasons.push("Flagged by security check");
    }

    if (reasons.length === 0) {
        return "";
    }

    return reasons.join(" · ");
};

module.exports = buildFraudReason;
