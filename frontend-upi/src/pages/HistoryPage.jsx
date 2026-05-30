import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { fetchTransactions } from "../services/api";
import { statusLabel, statusStyle } from "../utils/statusLabels";

function HistoryPage() {
    const navigate = useNavigate();
    const upiId = localStorage.getItem("upiId");
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!upiId) {
            navigate("/", { replace: true });
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const { data } = await fetchTransactions(50, upiId);
                if (!cancelled) setList(data.transactions || []);
            } catch {
                if (!cancelled) setList([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [upiId, navigate]);

    if (!upiId) return null;

    return (
        <AppLayout variant="dark" showBack onBack={() => navigate("/home")}>
            <div className="px-5 py-6">
                <h1 className="text-xl font-bold text-white mb-1">Transaction history</h1>
                <p className="text-sm text-slate-500 mb-6">{upiId}</p>

                {loading && (
                    <p className="text-sm text-gray-500 text-center py-10">Loading…</p>
                )}

                {!loading && list.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                        <p className="text-gray-600 font-medium">No payments yet</p>
                        <Link to="/pay" className="inline-block mt-3 text-[#2563eb] text-sm font-medium">
                            Send money
                        </Link>
                    </div>
                )}

                <ul className="space-y-3">
                    {list.map((txn) => (
                        <li
                            key={txn._id || `${txn.receiver}-${txn.createdAt}`}
                            className="bg-[#0b1623] rounded-xl border border-[#1a2d42] p-4"
                        >
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <p className="text-sm text-slate-400">To {txn.receiver}</p>
                                    <p className="text-xl font-bold text-white">₹{txn.amount}</p>
                                    <p className="text-xs text-slate-600 mt-1">
                                        {txn.createdAt
                                            ? new Date(txn.createdAt).toLocaleString("en-IN")
                                            : ""}
                                    </p>
                                </div>
                                <span
                                    className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyle(txn.status, true)}`}
                                >
                                    {statusLabel(txn.status)}
                                </span>
                            </div>
                            {txn.status !== "SUCCESS" && txn.blockReason && (
                                <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-[#1a2d42]">
                                    {txn.blockReason}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </AppLayout>
    );
}

export default HistoryPage;
