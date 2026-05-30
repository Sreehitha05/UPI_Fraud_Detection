import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UPI_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

function UpiEntryPage() {
    const navigate = useNavigate();
    const [upiId, setUpiId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (localStorage.getItem("upiId")) {
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    const handleContinue = () => {
        const id = upiId.trim();

        if (!id) {
            setError("Enter your UPI ID");
            return;
        }

        if (!UPI_PATTERN.test(id)) {
            setError("Use format: yourname@bankname");
            return;
        }

        localStorage.setItem("upiId", id);
        navigate("/home");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center mb-8 shadow-2xl">
                    <span className="text-4xl">₹</span>
                </div>

                <h1 className="text-3xl font-bold text-white text-center mb-2">
                    UPI Pay
                </h1>
                <p className="text-blue-200 text-center text-sm mb-10 max-w-xs">
                    Pay anyone in seconds. Enter your UPI ID to get started.
                </p>

                <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Your UPI ID
                    </label>
                    <input
                        type="text"
                        autoFocus
                        placeholder="yourname@oksbi"
                        value={upiId}
                        onChange={(e) => {
                            setUpiId(e.target.value);
                            setError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                        className={`mt-2 w-full border rounded-2xl px-4 py-4 text-gray-900 text-base outline-none ${
                            error
                                ? "border-red-300 ring-2 ring-red-100"
                                : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }`}
                    />
                    {error && (
                        <p className="text-red-600 text-sm mt-2">{error}</p>
                    )}

                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={!upiId.trim()}
                        className="w-full mt-5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 text-white font-semibold py-4 rounded-2xl transition-all"
                    >
                        Get started
                    </button>
                </div>

                <p className="text-blue-300/60 text-xs mt-8 text-center">
                    By continuing you agree to secure UPI payments
                </p>
            </div>

            <div className="pb-8 flex justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/40" />
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="w-2 h-2 rounded-full bg-white/40" />
            </div>
        </div>
    );
}

export default UpiEntryPage;
