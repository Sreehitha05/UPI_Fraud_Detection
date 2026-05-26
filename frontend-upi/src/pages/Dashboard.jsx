import { useEffect, useState } from "react";

import { io } from "socket.io-client";

import AlertBox from "../components/AlertBox";

const socket =
    io("http://localhost:5000");

function Dashboard() {

    const [transactions, setTransactions] =
        useState([]);

    const [alert, setAlert] =
        useState("");

    useEffect(() => {

        socket.on(
            "newTransaction",
            (data) => {

                setTransactions((prev) => [
                    data,
                    ...prev
                ]);

                // FRAUD ALERT

                if (
                    data.status === "BLOCKED"
                ) {

                    setAlert(
                        `Suspicious transaction of ₹${data.amount} blocked`
                    );

                    setTimeout(() => {

                        setAlert("");

                    }, 4000);
                }
            }
        );

        return () => {

            socket.off(
                "newTransaction"
            );
        };

    }, []);

    // STATS

    const totalTransactions =
        transactions.length;

    const blockedTransactions =
        transactions.filter(
            txn =>
                txn.status === "BLOCKED"
        ).length;

    const successfulTransactions =
        transactions.filter(
            txn =>
                txn.status === "SUCCESS"
        ).length;

    return (

        <div
            className="

                min-h-screen

                bg-gradient-to-br
                from-[#020617]
                via-[#071224]
                to-[#020617]

                overflow-hidden
                relative

                text-slate-100

                p-6
                md:p-10
            "
        >

            {/* BACKGROUND GLOW */}

            <div
                className="

                    absolute

                    top-20
                    left-20

                    w-[500px]
                    h-[500px]

                    bg-blue-500/10

                    blur-3xl

                    rounded-full
                "
            />

            {/* ALERT */}

            {alert && (
                <AlertBox
                    message={alert}
                />
            )}

            {/* HEADER */}

            <div
                className="

                    relative

                    flex
                    flex-col
                    md:flex-row

                    justify-between
                    items-start
                    md:items-center

                    gap-5

                    mb-10
                "
            >

                <div>

                    <h1
                        className="

                            text-5xl
                            font-bold

                            text-slate-100
                        "
                    >

                        Fraud Dashboard

                    </h1>

                    <p
                        className="

                            text-slate-400

                            mt-3
                        "
                    >

                        Real-time AI transaction monitoring

                    </p>

                </div>

                {/* STATUS */}

                <div
                    className="

                        bg-[#0f172a]/80

                        backdrop-blur-xl

                        border
                        border-blue-400/10

                        rounded-2xl

                        px-6
                        py-4

                        shadow-lg
                        shadow-blue-500/10
                    "
                >

                    <p className="text-slate-500">

                        System Status

                    </p>

                    <h2
                        className="

                            text-green-300
                            font-semibold

                            mt-1
                        "
                    >

                        Active Monitoring

                    </h2>

                </div>

            </div>

            {/* STATS */}

            <div
                className="

                    relative

                    grid
                    grid-cols-1
                    md:grid-cols-3

                    gap-6

                    mb-10
                "
            >

                {/* TOTAL */}

                <div
                    className="

                        bg-[#0f172a]/80

                        backdrop-blur-2xl

                        border
                        border-blue-400/10

                        rounded-[28px]

                        p-6

                        shadow-xl
                        shadow-blue-500/10
                    "
                >

                    <p
                        className="

                            text-slate-500

                            mb-4
                        "
                    >

                        Total Transactions

                    </p>

                    <h2
                        className="

                            text-5xl
                            font-bold

                            text-slate-100
                        "
                    >

                        {
                            totalTransactions
                        }

                    </h2>

                </div>

                {/* SUCCESS */}

                <div
                    className="

                        bg-[#0f172a]/80

                        backdrop-blur-2xl

                        border
                        border-green-400/10

                        rounded-[28px]

                        p-6

                        shadow-xl
                        shadow-green-500/10
                    "
                >

                    <p
                        className="

                            text-slate-500

                            mb-4
                        "
                    >

                        Successful Payments

                    </p>

                    <h2
                        className="

                            text-5xl
                            font-bold

                            text-green-300
                        "
                    >

                        {
                            successfulTransactions
                        }

                    </h2>

                </div>

                {/* BLOCKED */}

                <div
                    className="

                        bg-[#0f172a]/80

                        backdrop-blur-2xl

                        border
                        border-red-400/10

                        rounded-[28px]

                        p-6

                        shadow-xl
                        shadow-red-500/10
                    "
                >

                    <p
                        className="

                            text-slate-500

                            mb-4
                        "
                    >

                        Fraud Blocked

                    </p>

                    <h2
                        className="

                            text-5xl
                            font-bold

                            text-red-300
                        "
                    >

                        {
                            blockedTransactions
                        }

                    </h2>

                </div>

            </div>

            {/* TRANSACTION LIST */}

            <div
                className="

                    relative

                    space-y-6
                "
            >

                {transactions.map(
                    (txn, index) => (

                    <div
                        key={index}

                        className={`

                            bg-[#0f172a]/80

                            backdrop-blur-2xl

                            border

                            rounded-[28px]

                            p-6

                            transition-all
                            duration-300

                            hover:scale-[1.01]

                            ${
                                txn.status ===
                                "BLOCKED"

                                ? `
                                    border-red-500/20
                                    shadow-xl
                                    shadow-red-500/10
                                  `

                                : `
                                    border-blue-400/10
                                    shadow-xl
                                    shadow-blue-500/10
                                  `
                            }
                        `}
                    >

                        <div
                            className="

                                flex
                                flex-col
                                md:flex-row

                                justify-between

                                gap-6
                            "
                        >

                            {/* LEFT */}

                            <div>

                                <p
                                    className="

                                        text-slate-500

                                        mb-2
                                    "
                                >

                                    Sender

                                </p>

                                <h2
                                    className="

                                        text-lg
                                        font-semibold

                                        text-slate-100

                                        mb-5
                                    "
                                >

                                    {txn.sender}

                                </h2>

                                <p
                                    className="

                                        text-slate-500

                                        mb-2
                                    "
                                >

                                    Receiver

                                </p>

                                <h2
                                    className="

                                        text-lg
                                        font-semibold

                                        text-slate-100
                                    "
                                >

                                    {txn.receiver}

                                </h2>

                            </div>

                            {/* CENTER */}

                            <div
                                className="

                                    flex
                                    flex-col
                                    justify-center
                                "
                            >

                                <p
                                    className="

                                        text-slate-500

                                        mb-2
                                    "
                                >

                                    Amount

                                </p>

                                <h1
                                    className="

                                        text-4xl
                                        font-bold

                                        text-slate-100
                                    "
                                >

                                    ₹{txn.amount}

                                </h1>

                            </div>

                            {/* RIGHT */}

                            <div
                                className="

                                    flex
                                    flex-col
                                    justify-between
                                    items-start
                                    md:items-end
                                "
                            >

                                <div>

                                    <p
                                        className="

                                            text-slate-500

                                            mb-2
                                        "
                                    >

                                        Fraud Score

                                    </p>

                                    <h2
                                        className={`

                                            text-2xl
                                            font-bold

                                            ${
                                                txn.status ===
                                                "BLOCKED"

                                                ? `
                                                    text-red-300
                                                  `

                                                : `
                                                    text-green-300
                                                  `
                                            }
                                        `}
                                    >

                                        {
                                            txn.fraudScore
                                        }

                                    </h2>

                                </div>

                                {/* STATUS */}

                                <div
                                    className={`

                                        mt-6

                                        px-5
                                        py-3

                                        rounded-2xl

                                        border

                                        font-semibold

                                        ${
                                            txn.status ===
                                            "BLOCKED"

                                            ? `
                                                bg-red-950/40
                                                border-red-500/20
                                                text-red-300
                                              `

                                            : `
                                                bg-green-500/10
                                                border-green-400/20
                                                text-green-300
                                              `
                                        }
                                    `}
                                >

                                    {txn.status}

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Dashboard;