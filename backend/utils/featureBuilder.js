const buildFeatures = (amount, previousTransactions) => {
    const features = new Array(30).fill(0);
    const value = Number(amount) || 0;

    features[0] = value;

    const txns = previousTransactions || [];
    const count = txns.length;

    features[1] = count;

    if (count === 0) {
        return features;
    }

    const amounts = txns.map((txn) => Number(txn.amount) || 0);
    const avg =
        amounts.reduce((sum, n) => sum + n, 0) / count;

    features[2] = avg;
    features[3] = avg > 0 ? value / avg : 0;
    features[4] = amounts.filter((n) => n < 50).length;
    features[5] = Math.max(...amounts);
    features[6] = Math.min(...amounts);

    const lastTxn = txns[0];

    if (lastTxn?.createdAt) {
        const minutesSinceLast =
            (Date.now() - new Date(lastTxn.createdAt).getTime()) /
            60000;

        features[7] = Math.min(minutesSinceLast, 1440);
    }

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    features[8] = txns.filter(
        (txn) => new Date(txn.createdAt).getTime() >= fiveMinutesAgo
    ).length;

    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    features[9] = txns.filter(
        (txn) => new Date(txn.createdAt).getTime() >= oneHourAgo
    ).length;

    const uniqueReceivers = new Set(
        txns.map((txn) => String(txn.receiver || "").toLowerCase())
    ).size;

    features[10] = uniqueReceivers;

    const blockedCount = txns.filter(
        (txn) => txn.status === "BLOCKED"
    ).length;

    features[11] = blockedCount;

    return features;
};

module.exports = buildFeatures;
