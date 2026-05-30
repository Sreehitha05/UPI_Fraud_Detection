import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function ReceivePage() {
    const navigate = useNavigate();
    const upiId = localStorage.getItem("upiId");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!upiId) navigate("/", { replace: true });
    }, [upiId, navigate]);

    const copyId = async () => {
        try {
            await navigator.clipboard.writeText(upiId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    if (!upiId) return null;

    return (
        <AppLayout variant="dark" showBack onBack={() => navigate("/home")}>
            <div className="px-5 py-8 text-center">
                <h1 className="text-xl font-bold text-white mb-2">Receive money</h1>
                <p className="text-sm text-slate-500 mb-8">
                    Share this UPI ID to receive payments
                </p>

                <div className="bg-[#0b1623] rounded-3xl border border-[#1a2d42] p-8 mx-auto max-w-sm">
                    <div className="w-40 h-40 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-900 rounded-lg mb-2 grid grid-cols-3 gap-0.5 p-2">
                                {[...Array(9)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`bg-white rounded-sm ${i % 2 ? "opacity-90" : ""}`}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-400">QR (demo)</p>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-1">Your UPI ID</p>
                    <p className="text-lg font-semibold text-white break-all mb-4">
                        {upiId}
                    </p>

                    <button
                        type="button"
                        onClick={copyId}
                        className="w-full py-3 rounded-xl bg-[#2563eb] text-white font-medium text-sm"
                    >
                        {copied ? "Copied!" : "Copy UPI ID"}
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}

export default ReceivePage;
