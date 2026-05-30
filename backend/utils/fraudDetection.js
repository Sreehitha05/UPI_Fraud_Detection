const FIVE_MINUTES_MS = 5 * 60 * 1000;

const detectFraud = (amount, previousTransactions) => {
    let fraudScore = 0;
    const txns = previousTransactions || [];

    if (amount > 20000) {
        fraudScore += 0.5;
    }

    if (txns.length > 0) {
        const avg =
            txns.reduce((sum, txn) => sum + txn.amount, 0) /
            txns.length;

        const ratio = amount / avg;

        if (ratio > 10) {
            fraudScore += 0.5;
        }
    }

    const recentCount = txns.filter(
        (txn) =>
            Date.now() - new Date(txn.createdAt).getTime() <
            FIVE_MINUTES_MS
    ).length;

    if (recentCount >= 3) {
        fraudScore += 0.3;
    }

    if (txns.length >= 2) {
        const smallPayments = txns.filter((txn) => txn.amount < 50);

        if (smallPayments.length >= 2 && amount > 10000) {
            fraudScore += 0.5;
        }
    }

    const sameReceiverBurst = txns.filter(
        (txn) =>
            txn.receiver === txns[0]?.receiver &&
            Date.now() - new Date(txn.createdAt).getTime() <
                FIVE_MINUTES_MS
    ).length;

    if (sameReceiverBurst >= 2 && amount > 5000) {
        fraudScore += 0.2;
    }

    return Math.min(fraudScore, 1);
};

module.exports = detectFraud;
