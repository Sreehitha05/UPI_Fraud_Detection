import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UpiEntryPage() {

    const navigate = useNavigate();

    const [upiId, setUpiId] = useState("");

    const handleContinue = () => {
        if (!upiId) return;
        localStorage.setItem("upiId", upiId);
        navigate("/pay");
    };

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

            {/* SUBTLE GLOW */}
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

            {/* LOGO AREA */}
            <div
                className="
                    flex
                    flex-col
                    items-center
                    mb-12
                "
            >
                <div
                    className="
                        w-16
                        h-16
                        rounded-2xl
                        bg-[#0d2137]
                        border
                        border-blue-800/40
                        flex
                        items-center
                        justify-center
                        mb-5
                        shadow-lg
                        shadow-blue-900/30
                    "
                >
                    <svg
                        className="w-8 h-8 text-blue-400"
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

                <h1
                    className="
                        text-[22px]
                        font-700
                        text-white
                        tracking-tight
                    "
                >
                    SecurePay
                </h1>

                <p
                    className="
                        text-[13px]
                        text-slate-500
                        mt-1
                        font-400
                    "
                >
                    Fast · Secure · Reliable
                </p>
            </div>

            {/* CARD */}
            <div
                className="
                    w-full
                    max-w-[380px]
                    bg-[#0b1623]
                    border
                    border-[#1a2d42]
                    rounded-3xl
                    p-7
                    shadow-2xl
                    shadow-black/50
                "
            >
                <h2
                    className="
                        text-[20px]
                        font-700
                        text-white
                        mb-1
                        tracking-tight
                    "
                >
                    Enter your UPI ID
                </h2>

                <p
                    className="
                        text-[13px]
                        text-slate-500
                        mb-7
                        font-400
                    "
                >
                    Use the UPI ID linked to your bank account
                </p>

                {/* INPUT */}
                <div className="relative mb-5">
                    <input
                        type="text"
                        placeholder="yourname@bank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleContinue()
                        }
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
                            py-4
                            outline-none
                            transition-all
                            duration-200
                        "
                    />
                </div>

                {/* CONTINUE BUTTON */}
                <button
                    onClick={handleContinue}
                    disabled={!upiId}
                    className="
                        w-full
                        bg-blue-600
                        hover:bg-blue-500
                        active:bg-blue-700
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        text-white
                        text-[15px]
                        font-600
                        py-4
                        rounded-2xl
                        transition-all
                        duration-200
                        tracking-tight
                    "
                >
                    Continue
                </button>

            </div>

        </div>
    );
}

export default UpiEntryPage;