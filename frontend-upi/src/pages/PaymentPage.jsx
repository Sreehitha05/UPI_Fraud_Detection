import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { generateOtp, processPayment } from "../services/api";
import AppLayout from "../components/AppLayout";
import { mapPaymentMessage } from "../utils/statusLabels";
import { deductBalance } from "../utils/account";

function PaymentPage() {
    const navigate = useNavigate();
    const loggedInUser = localStorage.getItem("upiId");

    const [mobile, setMobile] = useState(
        () => localStorage.getItem("mobile") || ""
    );
    const [receiver, setReceiver] = useState("");
    const [amount, setAmount] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        if (!loggedInUser) {
            navigate("/", { replace: true });
        }
    }, [loggedInUser, navigate]);

    const handleSendOtp = async () => {
        const digits = mobile.replace(/\D/g, "");

        if (digits.length !== 10) {
            setMessage("Enter your 10-digit mobile number first");
            setMessageType("error");
            return;
        }

        try {
            setOtpLoading(true);
            setMessage("");
            localStorage.setItem("mobile", digits);

            const { data } = await generateOtp({
                sender: loggedInUser,
                mobile: digits
            });

            setOtpSent(true);
            setMessage(data.message);
            setMessageType("info");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Could not send OTP"
            );
            setMessageType("error");
        } finally {
            setOtpLoading(false);
        }
    };

    const handlePay = async () => {
        const digits = mobile.replace(/\D/g, "");

        if (!receiver.trim() || !amount || !otp.trim() || digits.length !== 10) {
            setMessage("Fill receiver, amount, mobile, and OTP");
            setMessageType("error");
            return;
        }

        if (!otpSent) {
            setMessage("Tap Send OTP before paying");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const { data } = await processPayment({
                sender: loggedInUser,
                receiver: receiver.trim(),
                amount: Number(amount),
                otp: otp.trim(),
                mobile: digits
            });

            setMessage(mapPaymentMessage(data));
            setMessageType(
                data.status === "SUCCESS"
                    ? "success"
                    : data.status === "MFA"
                    ? "warning"
                    : "error"
            );

            if (data.status === "SUCCESS") {
                deductBalance(loggedInUser, Number(amount));
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Payment could not be completed"
            );
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    if (!loggedInUser) return null;

    const inputClass =
        "mt-2 w-full bg-[#0d1f30] border border-[#1e3448] rounded-xl px-4 py-3.5 text-white outline-none focus:border-blue-600";

    const bannerClass =
        messageType === "success"
            ? "bg-emerald-900/30 text-emerald-300 border-emerald-800/40"
            : messageType === "warning"
            ? "bg-amber-900/30 text-amber-200 border-amber-800/40"
            : messageType === "error"
            ? "bg-red-900/30 text-red-300 border-red-800/40"
            : "bg-blue-900/30 text-blue-200 border-blue-800/40";

    return (
        <AppLayout variant="dark" showBack onBack={() => navigate("/home")}>
            <div className="px-5 py-6">
                <h1 className="text-xl font-bold text-white mb-6">Send money</h1>

                <div className="bg-[#0b1623] rounded-2xl border border-[#1a2d42] p-4 mb-5 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-600/30 text-blue-300 font-bold flex items-center justify-center">
                        {loggedInUser.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-slate-500">From</p>
                        <p className="text-sm font-medium text-white truncate">{loggedInUser}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-slate-500 uppercase">Mobile number</label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="10-digit mobile"
                            value={mobile}
                            onChange={(e) => {
                                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                                setOtpSent(false);
                            }}
                            className={inputClass}
                        />
                        <p className="text-[11px] text-slate-600 mt-1">
                            OTP sent to this number — check backend terminal in demo
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-500 uppercase">To (UPI ID)</label>
                        <input
                            type="text"
                            placeholder="friend@paytm"
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-500 uppercase">Amount</label>
                        <div className="relative mt-2">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                            <input
                                type="number"
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={`${inputClass} pl-9 text-xl font-semibold`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-500 uppercase">OTP</label>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="4-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className={`flex-1 ${inputClass} mt-0 tracking-widest`}
                            />
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={otpLoading}
                                className="shrink-0 px-4 rounded-xl border border-blue-600 text-blue-400 font-medium text-sm disabled:opacity-50"
                            >
                                {otpLoading ? "…" : "Send OTP"}
                            </button>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className="mt-5 space-y-2">
                        <p className={`text-sm px-4 py-3 rounded-xl border ${bannerClass}`}>
                            {message}
                        </p>
                        {messageType === "success" && (
                            <Link
                                to="/history"
                                className="block text-center text-sm font-medium text-[#2563eb]"
                            >
                                View in payment history →
                            </Link>
                        )}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full mt-6 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold py-4 rounded-2xl"
                >
                    {loading ? "Processing…" : `Pay ₹${amount || "0"}`}
                </button>
            </div>
        </AppLayout>
    );
}

export default PaymentPage;
