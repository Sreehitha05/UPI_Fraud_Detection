const detectFraud = (
    amount,
    previousTransactions
) => {

    let fraudScore = 0;

    // RULE 1 — LARGE AMOUNT

    if (amount > 20000) {

        fraudScore += 0.5;
    }

    // RULE 2 — ESCALATION RATIO

    if (previousTransactions.length > 0) {

        const avg =
            previousTransactions.reduce(
                (sum, txn) =>
                    sum + txn.amount,
                0
            ) / previousTransactions.length;

        const ratio = amount / avg;

        console.log("Average:", avg);

        console.log("Ratio:", ratio);

        if (ratio > 10) {

            fraudScore += 0.5;
        }
    }

    // RULE 3 — RAPID TRANSACTIONS

    if (previousTransactions.length >= 3) {

        fraudScore += 0.2;
    }

    // RULE 4 — OTP BYPASS STYLE

    if (
        previousTransactions.length >= 2
    ) {

        const smallPayments =
            previousTransactions.filter(
                txn => txn.amount < 50
            );

        if (
            smallPayments.length >= 2 &&
            amount > 10000
        ) {

            fraudScore += 0.5;
        }
    }

    return Math.min(fraudScore, 1);
};

module.exports = detectFraud;