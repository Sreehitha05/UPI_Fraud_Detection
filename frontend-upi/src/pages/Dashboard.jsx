import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import {
    fetchTransactions,
    fetchAnalytics,
    fetchFraudInfo,
    fetchFraudReport
} from "../services/api";
import { statusLabel, statusStyle } from "../utils/statusLabels";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Panel({ title, children, className = "" }) {
    return (
        <section
            className={`bg-[#0b1623] border border-[#1a2d42] rounded-xl p-5 ${className}`}
        >
            {title && (
                <h2 className="text-sm font-semibold text-white mb-4">{title}</h2>
            )}
            {children}
        </section>
    );
}

function Dashboard() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [fraudInfo, setFraudInfo] = useState(null);
    const [report, setReport] = useState(null);
    const [live, setLive] = useState(false);
    const [tab, setTab] = useState("overview");

    const refresh = useCallback(async () => {
        try {
            const [txnRes, analyticsRes, infoRes, reportRes] = await Promise.all([
                fetchTransactions(50),
                fetchAnalytics(),
                fetchFraudInfo(),
                fetchFraudReport()
            ]);
            setTransactions(txnRes.data.transactions || []);
            setAnalytics(analyticsRes.data);
            setFraudInfo(infoRes.data);
            setReport(reportRes.data);
        } catch {
            /* keep last data */
        }
    }, []);

    const onNewTxn = useCallback(
        (data) => {
            setTransactions((prev) => {
                const id = data._id?.toString();
                if (id && prev.some((t) => t._id?.toString() === id)) return prev;
                return [data, ...prev].slice(0, 100);
            });
            refresh();
        },
        [refresh]
    );

    useEffect(() => {
        refresh();
        const socket = io(API_URL);
        socket.on("connect", () => setLive(true));
        socket.on("disconnect", () => setLive(false));
        socket.on("newTransaction", onNewTxn);
        return () => {
            socket.off("newTransaction", onNewTxn);
            socket.disconnect();
        };
    }, [onNewTxn, refresh]);

    const s = analytics?.summary;
    const total = s?.total ?? 0;
    const declined = s?.blocked ?? 0;
    const declineRate = s?.fraudRate ?? "0";

    return (
        <AppLayout variant="dark" wide showBack onBack={() => navigate("/home")}>
            <div className="px-4 sm:px-6 py-5 pb-8">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            UPI fraud detection
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            How payments are checked, scored, and declined
                        </p>
                    </div>
                    <div className="flex gap-2 text-xs">
                        <span
                            className={`px-2.5 py-1 rounded-full border ${
                                live
                                    ? "border-emerald-800/50 text-emerald-400"
                                    : "border-slate-700 text-slate-500"
                            }`}
                        >
                            {live ? "Live" : "Offline"}
                        </span>
                        {fraudInfo?.modelReady && (
                            <span className="px-2.5 py-1 rounded-full border border-blue-800/40 text-blue-400">
                                ML on
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 mb-5 overflow-x-auto">
                    {[
                        ["overview", "Overview"],
                        ["how", "How it works"],
                        ["rules", "Detection rules"],
                        ["report", "Declined report"]
                    ].map(([id, label]) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setTab(id)}
                            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${
                                tab === id
                                    ? "bg-[#2563eb] text-white"
                                    : "bg-[#0b1623] text-slate-400 border border-[#1a2d42]"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {tab === "overview" && (
                    <div className="space-y-4 fraud-landscape-top">
                        <Panel title="">
                            <p className="text-4xl font-bold text-red-400">{declineRate}%</p>
                            <p className="text-slate-400 text-sm mt-1">
                                Decline rate — {declined} declined of {total} payments
                            </p>
                        </Panel>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <StatCard dark label="Total" value={total} accent="white" />
                            <StatCard
                                dark
                                label="Successful"
                                value={s?.success ?? 0}
                                accent="green"
                            />
                            <StatCard
                                dark
                                label="On hold"
                                value={s?.mfa ?? 0}
                                accent="amber"
                            />
                            <StatCard
                                dark
                                label="Declined"
                                value={declined}
                                accent="red"
                            />
                            <StatCard
                                dark
                                label="Flagged rate"
                                value={s?.flaggedRate ?? 0}
                                suffix="%"
                                accent="amber"
                            />
                            <StatCard
                                dark
                                label="Avg check"
                                value={s?.avgLatencyMs ?? "—"}
                                suffix={s?.avgLatencyMs != null ? "ms" : ""}
                                accent="blue"
                            />
                        </div>

                        <Panel title="All payments (live)">
                            <TxnList items={transactions} />
                        </Panel>
                    </div>
                )}

                {tab === "how" && fraudInfo && (
                    <div className="space-y-4 fraud-landscape-mid">
                        <Panel title="Payment check — 4 steps">
                            <ol className="space-y-4">
                                {fraudInfo.decisionSteps.map((step) => (
                                    <li key={step.step} className="flex gap-3">
                                        <span className="w-7 h-7 shrink-0 rounded-full bg-blue-600/30 text-blue-300 text-sm font-bold flex items-center justify-center">
                                            {step.step}
                                        </span>
                                        <div>
                                            <p className="text-white font-medium text-sm">
                                                {step.title}
                                            </p>
                                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                                {step.detail}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </Panel>

                        <Panel title="Final decision (risk score)">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-[#1a2d42]">
                                    <span className="text-emerald-400">Successful</span>
                                    <span className="text-slate-400">
                                        Score &lt; {fraudInfo.thresholds.allowBelow}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-[#1a2d42]">
                                    <span className="text-amber-400">On hold</span>
                                    <span className="text-slate-400">
                                        {fraudInfo.thresholds.allowBelow} –{" "}
                                        {fraudInfo.thresholds.holdBelow}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-red-400">Declined</span>
                                    <span className="text-slate-400">
                                        Score ≥ {fraudInfo.thresholds.blockAtOrAbove}
                                    </span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-xs mt-4">
                                Final score = rule score + (ML score × 0.5), maximum 1.0.
                                Declined payments are saved but money is not sent.
                            </p>
                        </Panel>
                    </div>
                )}

                {tab === "rules" && fraudInfo && (
                    <Panel title="What triggers a higher risk score">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-slate-500 border-b border-[#1a2d42]">
                                        <th className="pb-2 pr-4 font-medium">Rule</th>
                                        <th className="pb-2 pr-4 font-medium">When</th>
                                        <th className="pb-2 pr-4 font-medium">Impact</th>
                                        <th className="pb-2 font-medium">Why it matters</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fraudInfo.detectionRules.map((rule) => (
                                        <tr
                                            key={rule.id}
                                            className="border-b border-[#1a2d42]/60"
                                        >
                                            <td className="py-3 pr-4 text-white font-medium">
                                                {rule.title}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-400">
                                                {rule.check}
                                            </td>
                                            <td className="py-3 pr-4 text-blue-300 whitespace-nowrap">
                                                {rule.scoreImpact}
                                            </td>
                                            <td className="py-3 text-slate-400">
                                                {rule.declineRole}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Panel>
                )}

                {tab === "report" && (
                    <div className="space-y-4">
                        <Panel
                            title={`Declined payments (${report?.declined?.length ?? 0})`}
                        >
                            {report?.declined?.length ? (
                                <TxnList items={report.declined} showWhy />
                            ) : (
                                <p className="text-slate-500 text-sm">No declined payments yet.</p>
                            )}
                        </Panel>

                        <Panel title={`On hold (${report?.onHold?.length ?? 0})`}>
                            {report?.onHold?.length ? (
                                <TxnList items={report.onHold} showWhy />
                            ) : (
                                <p className="text-slate-500 text-sm">None on hold.</p>
                            )}
                        </Panel>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function TxnList({ items, showWhy }) {
    if (!items?.length) {
        return (
            <p className="text-slate-500 text-sm py-4 text-center">
                No payments to show.
            </p>
        );
    }

    return (
        <ul className="divide-y divide-[#1a2d42] max-h-[360px] overflow-y-auto">
            {items.map((txn) => (
                <li key={txn._id} className="py-3 first:pt-0">
                    <div className="flex flex-wrap justify-between gap-2">
                        <div>
                            <p className="text-sm text-slate-300">
                                {txn.sender}{" "}
                                <span className="text-slate-600">→</span> {txn.receiver}
                            </p>
                            <p className="text-lg font-bold text-white">₹{txn.amount}</p>
                            <p className="text-[11px] text-slate-600">
                                {txn.createdAt
                                    ? new Date(txn.createdAt).toLocaleString("en-IN")
                                    : ""}
                            </p>
                        </div>
                        <div className="text-right">
                            <span
                                className={`text-xs px-2 py-1 rounded-full border ${statusStyle(txn.status, true)}`}
                            >
                                {statusLabel(txn.status)}
                            </span>
                            <p className="text-xs text-blue-400 mt-1">
                                Risk {txn.fraudScore}
                                {txn.ruleScore != null && ` · Rules ${txn.ruleScore}`}
                                {txn.aiPrediction != null && ` · ML ${txn.aiPrediction}`}
                            </p>
                        </div>
                    </div>
                    {showWhy && txn.blockReason && (
                        <p className="text-xs text-amber-200/80 mt-2 bg-amber-900/20 rounded-lg px-3 py-2 border border-amber-900/30">
                            <span className="font-medium text-amber-400">Why: </span>
                            {txn.blockReason}
                        </p>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default Dashboard;
