import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaymentPage() {

    const navigate = useNavigate();

    const loggedInUser =
        localStorage.getItem("upiId");

    if (!loggedInUser) {
        navigate("/");
    }

    const [formData, setFormData] =
        useState({
            receiver: "",
            amount: "",
            otp: ""
        });

    const [generatedOtp, setGeneratedOtp] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const generateOtp = () => {
        const otp =
            Math.floor(
                1000 + Math.random() * 9000
            ).toString();
        setGeneratedOtp(otp);
        setMessage(`OTP Generated: ${otp}`);
    };

    const handlePayment = async () => {
        if (formData.otp !== generatedOtp) {
            setMessage("Invalid OTP");
            return;
        }

        try {
            setLoading(true);

            const response =
                await axios.post(
                    "http://localhost:5000/pay",
                    {
                        sender: loggedInUser,
                        ...formData
                    }
                );

            setMessage(response.data.message);

        } catch (error) {
            setMessage("Payment Failed");
        } finally {
            setLoading(false);
        }
    };

    const isSuccess =
        message.includes("Successful");

    const isError =
        message.includes("Fraud") ||
        message.includes("Failed") ||
        message.includes("Invalid");

    const isOtp =
        message.includes("OTP");

    return (
        <div
            className="
                min-h-screen
                bg-[#060d17]
                flex
                flex-col
                items-center
                justify-center
                p-6
                relative
                overflow-hidden
            "
        >
            {/* GLOW */}
            <div
                className="
                    absolute
                    top-[-100px]
                    left-1/2
                    -translate-x-1/2
                    w-[600px]
                    h-[400px]
                    bg-blue-900/20
                    blur-[120px]
                    rounded-full
                    pointer-events-none
                "
            />

            {/* BACK + HEADER */}
            <div
                className="
                    w-full
                    max-w-[420px]
                    mb-5
                    flex
                    items-center
                    gap-3
                "
            >
                <button
                    onClick={() => navigate("/")}
                    className="
                        w-9
                        h-9
                        rounded-xl
                        bg-[#0b1623]
                        border
                        border-[#1a2d42]
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        hover:text-white
                        transition-colors
                        duration-200
                    "
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>

                <div>
                    <h1
                        className="
                            text-[16px]
                            font-600
                            text-white
                            tracking-tight
                        "
                    >
                        Send Money
                    </h1>
                    <p
                        className="
                            text-[12px]
                            text-slate-500
                        "
                    >
                        via UPI
                    </p>
                </div>
            </div>

            {/* MAIN CARD */}
            <div
                className="
                    w-full
                    max-w-[420px]
                    bg-[#0b1623]
                    border
                    border-[#1a2d42]
                    rounded-3xl
                    overflow-hidden
                    shadow-2xl
                    shadow-black/50
                "
            >
                {/* SENDER STRIP */}
                <div
                    className="
                        px-6
                        py-5
                        border-b
                        border-[#1a2d42]
                        flex
                        items-center
                        gap-3
                    "
                >
                    <div
                        className="
                            w-10
                            h-10
                            rounded-full
                            bg-blue-900/50
                            border
                            border-blue-800/50
                            flex
                            items-center
                            justify-center
                            text-blue-300
                            text-[14px]
                            font-700
                            shrink-0
                        "
                    >
                        {loggedInUser?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <p
                            className="
                                text-[11px]
                                text-slate-500
                                font-400
                            "
                        >
                            Paying from
                        </p>
                        <p
                            className="
                                text-[14px]
                                text-blue-300
                                font-500
                                mt-0.5
                            "
                        >
                            {loggedInUser}
                        </p>
                    </div>

                    <div
                        className="
                            ml-auto
                            flex
                            items-center
                            gap-1.5
                            bg-green-900/20
                            border
                            border-green-800/30
                            rounded-full
                            px-3
                            py-1
                        "
                    >
                        <div
                            className="
                                w-1.5
                                h-1.5
                                rounded-full
                                bg-green-400
                            "
                        />
                        <span
                            className="
                                text-[11px]
                                text-green-400
                                font-500
                            "
                        >
                            Verified
                        </span>
                    </div>
                </div>

                {/* FORM AREA */}
                <div className="px-6 py-6 space-y-5">

                    {/* RECEIVER */}
                    <div>
                        <label
                            className="
                                block
                                text-[12px]
                                font-500
                                text-slate-400
                                mb-2
                                uppercase
                                tracking-wide
                            "
                        >
                            Receiver UPI ID
                        </label>
                        <input
                            type="text"
                            name="receiver"
                            placeholder="receiver@bank"
                            value={formData.receiver}
                            onChange={handleChange}
                            className="
                                w-full
                                bg-[#0d1f30]
                                border
                                border-[#1e3448]
                                focus:border-blue-600
                                text-white
                                text-[15px]
                                font-400
                                placeholder-slate-600
                                rounded-2xl
                                px-4
                                py-3.5
                                outline-none
                                transition-all
                                duration-200
                            "
                        />
                    </div>

                    {/* AMOUNT */}
                    <div>
                        <label
                            className="
                                block
                                text-[12px]
                                font-500
                                text-slate-400
                                mb-2
                                uppercase
                                tracking-wide
                            "
                        >
                            Amount
                        </label>
                        <div className="relative">
                            <span
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                    text-[18px]
                                    font-500
                                "
                            >
                                ₹
                            </span>
                            <input
                                type="number"
                                name="amount"
                                placeholder="0"
                                value={formData.amount}
                                onChange={handleChange}
                                className="
                                    w-full
                                    bg-[#0d1f30]
                                    border
                                    border-[#1e3448]
                                    focus:border-blue-600
                                    text-white
                                    text-[22px]
                                    font-600
                                    placeholder-slate-700
                                    rounded-2xl
                                    pl-9
                                    pr-4
                                    py-3.5
                                    outline-none
                                    transition-all
                                    duration-200
                                    tracking-tight
                                "
                            />
                        </div>
                    </div>

                    {/* OTP ROW */}
                    <div>
                        <label
                            className="
                                block
                                text-[12px]
                                font-500
                                text-slate-400
                                mb-2
                                uppercase
                                tracking-wide
                            "
                        >
                            UPI PIN / OTP
                        </label>
                        <div
                            className="
                                flex
                                gap-3
                            "
                        >
                            <input
                                type="password"
                                name="otp"
                                placeholder="● ● ● ●"
                                value={formData.otp}
                                onChange={handleChange}
                                className="
                                    flex-1
                                    bg-[#0d1f30]
                                    border
                                    border-[#1e3448]
                                    focus:border-blue-600
                                    text-white
                                    text-[18px]
                                    font-500
                                    placeholder-slate-700
                                    rounded-2xl
                                    px-4
                                    py-3.5
                                    outline-none
                                    transition-all
                                    duration-200
                                    tracking-widest
                                "
                            />
                            <button
                                onClick={generateOtp}
                                className="
                                    bg-[#0d1f30]
                                    border
                                    border-[#1e3448]
                                    hover:border-blue-700
                                    hover:bg-[#0f2540]
                                    text-blue-400
                                    text-[13px]
                                    font-500
                                    px-4
                                    rounded-2xl
                                    transition-all
                                    duration-200
                                    whitespace-nowrap
                                "
                            >
                                Get OTP
                            </button>
                        </div>
                    </div>

                </div>

                {/* MESSAGE */}
                {message && (
                    <div
                        className="
                            mx-6
                            mb-4
                        "
                    >
                        <div
                            className={`
                                flex
                                items-center
                                gap-2.5
                                px-4
                                py-3
                                rounded-xl
                                text-[13px]
                                font-500
                                ${
                                    isSuccess
                                    ? "bg-green-900/20 border border-green-800/30 text-green-400"
                                    : isError
                                    ? "bg-red-900/20 border border-red-800/30 text-red-400"
                                    : "bg-blue-900/20 border border-blue-800/30 text-blue-400"
                                }
                            `}
                        >
                            <span>
                                {isSuccess ? "✓" : isError ? "✕" : "○"}
                            </span>
                            {message}
                        </div>
                    </div>
                )}

                {/* PAY BUTTON */}
                <div className="px-6 pb-6">
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="
                            w-full
                            bg-blue-600
                            hover:bg-blue-500
                            active:bg-blue-700
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            text-white
                            text-[15px]
                            font-600
                            py-4
                            rounded-2xl
                            transition-all
                            duration-200
                            tracking-tight
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="w-4 h-4 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    />
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                Pay Now
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </>
                        )}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default PaymentPage;