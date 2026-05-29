import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import AlertBox from "../components/AlertBox";

const socket = io("http://localhost:5000");

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

                if (data.status === "BLOCKED") {
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
            socket.off("newTransaction");
        };

    }, []);

    // STATS
    const totalTransactions =
        transactions.length;

    const blockedTransactions =
        transactions.filter(
            txn => txn.status === "BLOCKED"
        ).length;

    const successfulTransactions =
        transactions.filter(
            txn => txn.status === "SUCCESS"
        ).length;

    const fraudRate =
        totalTransactions > 0
            ? ((blockedTransactions / totalTransactions) * 100).toFixed(1)
            : "0.0";

    return (
        <div
            className="
                min-h-screen
                bg-[#060d17]
                text-white
                overflow-hidden
                relative
            "
        >
            {/* GLOW */}
            <div
                className="
                    absolute
                    top-0
                    left-1/2
                    -translate-x-1/2
                    w-[800px]
                    h-[300px]
                    bg-blue-900/15
                    blur-[120px]
                    rounded-full
                    pointer-events-none
                "
            />

            {/* ALERT */}
            {alert && <AlertBox message={alert} />}

            {/* TOP NAV */}
            <div
                className="
                    relative
                    border-b
                    border-[#1a2d42]
                    px-6
                    md:px-10
                    py-5
                    flex
                    items-center
                    justify-between
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >
                    <div
                        className="
                            w-9
                            h-9
                            rounded-xl
                            bg-[#0d2137]
                            border
                            border-blue-800/40
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <svg
                            className="w-5 h-5 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                            />
                        </svg>
                    </div>

                    <div>
                        <h1
                            className="
                                text-[15px]
                                font-600
                                text-white
                                tracking-tight
                            "
                        >
                            SecurePay
                        </h1>
                        <p
                            className="
                                text-[11px]
                                text-slate-500
                            "
                        >
                            Fraud Monitoring
                        </p>
                    </div>
                </div>

                {/* LIVE INDICATOR */}
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        bg-[#0b1623]
                        border
                        border-[#1a2d42]
                        rounded-full
                        px-4
                        py-2
                    "
                >
                    <div
                        className="
                            w-2
                            h-2
                            rounded-full
                            bg-green-400
                            animate-pulse
                        "
                    />
                    <span
                        className="
                            text-[12px]
                            text-green-400
                            font-500
                        "
                    >
                        Live
                    </span>
                </div>
            </div>

            {/* PAGE CONTENT */}
            <div
                className="
                    relative
                    px-6
                    md:px-10
                    py-8
                "
            >

                {/* PAGE TITLE */}
                <div className="mb-8">
                    <h2
                        className="
                            text-[28px]
                            font-700
                            text-white
                            tracking-tight
                        "
                    >
                        Transaction Monitor
                    </h2>
                    <p
                        className="
                            text-[13px]
                            text-slate-500
                            mt-1
                            font-400
                        "
                    >
                        All incoming transactions are scanned in real-time
                    </p>
                </div>

                {/* STAT CARDS */}
                <div
                    className="
                        grid
                        grid-cols-2
                        md:grid-cols-4
                        gap-4
                        mb-8
                    "
                >

                    {/* TOTAL */}
                    <div
                        className="
                            bg-[#0b1623]
                            border
                            border-[#1a2d42]
                            rounded-2xl
                            p-5
                            hover:border-blue-800/50
                            transition-colors
                            duration-200
                        "
                    >
                        <p
                            className="
                                text-[11px]
                                text-slate-500
                                font-500
                                uppercase
                                tracking-wide
                                mb-3
                            "
                        >
                            Total
                        </p>
                        <p
                            className="
                                text-[32px]
                                font-700
                                text-white
                                leading-none
                                tracking-tight
                            "
                        >
                            {totalTransactions}
                        </p>
                        <p
                            className="
                                text-[11px]
                                text-slate-600
                                mt-2
                            "
                        >
                            transactions
                        </p>
                    </div>

                    {/* SUCCESS */}
                    <div
                        className="
                            bg-[#0b1623]
                            border
                            border-[#1a2d42]
                            rounded-2xl
                            p-5
                            hover:border-green-900/50
                            transition-colors
                            duration-200
                        "
                    >
                        <p
                            className="
                                text-[11px]
                                text-slate-500
                                font-500
                                uppercase
                                tracking-wide
                                mb-3
                            "
                        >
                            Success
                        </p>
                        <p
                            className="
                                text-[32px]
                                font-700
                                text-green-400
                                leading-none
                                tracking-tight
                            "
                        >
                            {successfulTransactions}
                        </p>
                        <p
                            className="
                                text-[11px]
                                text-slate-600
                                mt-2
                            "
                        >
                            payments
                        </p>
                    </div>

                    {/* BLOCKED */}
                    <div
                        className="
                            bg-[#0b1623]
                            border
                            border-[#1a2d42]
                            rounded-2xl
                            p-5
                            hover:border-red-900/50
                            transition-colors
                            duration-200
                        "
                    >
                        <p
                            className="
                                text-[11px]
                                text-slate-500
                                font-500
                                uppercase
                                tracking-wide
                                mb-3
                            "
                        >
                            Blocked
                        </p>
                        <p
                            className="
                                text-[32px]
                                font-700
                                text-red-400
                                leading-none
                                tracking-tight
                            "
                        >
                            {blockedTransactions}
                        </p>
                        <p
                            className="
                                text-[11px]
                                text-slate-600
                                mt-2
                            "
                        >
                            fraud attempts
                        </p>
                    </div>

                    {/* FRAUD RATE */}
                    <div
                        className="
                            bg-[#0b1623]
                            border
                            border-[#1a2d42]
                            rounded-2xl
                            p-5
                            hover:border-yellow-900/50
                            transition-colors
                            duration-200
                        "
                    >
                        <p
                            className="
                                text-[11px]
                                text-slate-500
                                font-500
                                uppercase
                                tracking-wide
                                mb-3
                            "
                        >
                            Fraud Rate
                        </p>
                        <p
                            className="
                                text-[32px]
                                font-700
                                text-yellow-400
                                leading-none
                                tracking-tight
                            "
                        >
                            {fraudRate}%
                        </p>
                        <p
                            className="
                                text-[11px]
                                text-slate-600
                                mt-2
                            "
                        >
                            of all txns
                        </p>
                    </div>

                </div>

                {/* TABLE HEADER */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mb-4
                    "
                >
                    <h3
                        className="
                            text-[14px]
                            font-600
                            text-white
                            tracking-tight
                        "
                    >
                        Recent Transactions
                    </h3>

                    <span
                        className="
                            text-[12px]
                            text-slate-500
                            bg-[#0b1623]
                            border
                            border-[#1a2d42]
                            px-3
                            py-1
                            rounded-full
                        "
                    >
                        {totalTransactions} total
                    </span>
                </div>

                {/* COLUMN LABELS - desktop */}
                <div
                    className="
                        hidden
                        md:grid
                        grid-cols-5
                        px-5
                        pb-3
                        border-b
                        border-[#1a2d42]
                        mb-2
                    "
                >
                    {[
                        "Sender",
                        "Receiver",
                        "Amount",
                        "Fraud Score",
                        "Status"
                    ].map((col) => (
                        <span
                            key={col}
                            className="
                                text-[11px]
                                text-slate-600
                                font-500
                                uppercase
                                tracking-wide
                            "
                        >
                            {col}
                        </span>
                    ))}
                </div>

                {/* TRANSACTIONS */}
                <div className="space-y-2">

                    {transactions.map((txn, index) => (
                        <div
                            key={index}
                            className={`
                                bg-[#0b1623]
                                border
                                rounded-2xl
                                px-5
                                py-4
                                transition-all
                                duration-200
                                hover:scale-[1.005]
                                ${
                                    txn.status === "BLOCKED"
                                    ? "border-red-900/40 hover:border-red-800/60"
                                    : "border-[#1a2d42] hover:border-blue-900/50"
                                }
                            `}
                        >
                            {/* MOBILE LAYOUT */}
                            <div className="md:hidden space-y-3">
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <div>
                                        <p
                                            className="
                                                text-[11px]
                                                text-slate-500
                                                mb-0.5
                                            "
                                        >
                                            {txn.sender}
                                        </p>
                                        <p
                                            className="
                                                text-[11px]
                                                text-slate-600
                                            "
                                        >
                                            → {txn.receiver}
                                        </p>
                                    </div>
                                    <div
                                        className={`
                                            px-3
                                            py-1
                                            rounded-full
                                            border
                                            text-[11px]
                                            font-500
                                            ${
                                                txn.status === "BLOCKED"
                                                ? "bg-red-900/20 border-red-800/30 text-red-400"
                                                : "bg-green-900/20 border-green-800/30 text-green-400"
                                            }
                                        `}
                                    >
                                        {txn.status}
                                    </div>
                                </div>
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <p
                                        className="
                                            text-[20px]
                                            font-700
                                            text-white
                                            tracking-tight
                                        "
                                    >
                                        ₹{txn.amount}
                                    </p>
                                    <p
                                        className={`
                                            text-[13px]
                                            font-600
                                            ${
                                                txn.status === "BLOCKED"
                                                ? "text-red-400"
                                                : "text-green-400"
                                            }
                                        `}
                                    >
                                        Score: {txn.fraudScore}
                                    </p>
                                </div>
                            </div>

                            {/* DESKTOP TABLE ROW */}
                            <div
                                className="
                                    hidden
                                    md:grid
                                    grid-cols-5
                                    items-center
                                "
                            >
                                <p
                                    className="
                                        text-[13px]
                                        text-slate-300
                                        font-400
                                        truncate
                                        pr-4
                                    "
                                >
                                    {txn.sender}
                                </p>

                                <p
                                    className="
                                        text-[13px]
                                        text-slate-300
                                        font-400
                                        truncate
                                        pr-4
                                    "
                                >
                                    {txn.receiver}
                                </p>

                                <p
                                    className="
                                        text-[18px]
                                        font-700
                                        text-white
                                        tracking-tight
                                    "
                                >
                                    ₹{txn.amount}
                                </p>

                                <p
                                    className={`
                                        text-[15px]
                                        font-600
                                        ${
                                            txn.status === "BLOCKED"
                                            ? "text-red-400"
                                            : "text-green-400"
                                        }
                                    `}
                                >
                                    {txn.fraudScore}
                                </p>

                                <div>
                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            px-3
                                            py-1.5
                                            rounded-full
                                            border
                                            text-[11px]
                                            font-500
                                            ${
                                                txn.status === "BLOCKED"
                                                ? "bg-red-900/20 border-red-800/30 text-red-400"
                                                : "bg-green-900/20 border-green-800/30 text-green-400"
                                            }
                                        `}
                                    >
                                        <span
                                            className={`
                                                w-1.5
                                                h-1.5
                                                rounded-full
                                                ${
                                                    txn.status === "BLOCKED"
                                                    ? "bg-red-400"
                                                    : "bg-green-400"
                                                }
                                            `}
                                        />
                                        {txn.status}
                                    </span>
                                </div>
                            </div>

                        </div>
                    ))}

                    {/* EMPTY STATE */}
                    {transactions.length === 0 && (
                        <div
                            className="
                                flex
                                flex-col
                                items-center
                                justify-center
                                py-20
                                text-center
                            "
                        >
                            <div
                                className="
                                    w-16
                                    h-16
                                    rounded-2xl
                                    bg-[#0b1623]
                                    border
                                    border-[#1a2d42]
                                    flex
                                    items-center
                                    justify-center
                                    mb-5
                                "
                            >
                                <svg
                                    className="w-7 h-7 text-slate-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                                    />
                                </svg>
                            </div>
                            <p
                                className="
                                    text-[14px]
                                    font-500
                                    text-slate-500
                                "
                            >
                                Waiting for transactions
                            </p>
                            <p
                                className="
                                    text-[12px]
                                    text-slate-600
                                    mt-1
                                "
                            >
                                New transactions will appear here instantly
                            </p>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;