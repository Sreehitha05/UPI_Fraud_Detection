import { useState } from "react";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";

function PaymentPage() {

    const navigate =
        useNavigate();

    const loggedInUser =
        localStorage.getItem(
            "upiId"
        );

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

            [e.target.name]:
                e.target.value
        });
    };

    const generateOtp = () => {

        const otp =
            Math.floor(
                1000 + Math.random() * 9000
            ).toString();

        setGeneratedOtp(otp);

        setMessage(
            `OTP Generated: ${otp}`
        );
    };

    const handlePayment = async () => {

        if (
            formData.otp !== generatedOtp
        ) {

            setMessage(
                "Invalid OTP"
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await axios.post(

                    "http://localhost:5000/pay",

                    {
                        sender:
                            loggedInUser,

                        ...formData
                    }
                );

            setMessage(
                response.data.message
            );

        } catch (error) {

            setMessage(
                "Payment Failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div
            className="

                min-h-screen

                bg-gradient-to-br
                from-[#020617]
                via-[#071224]
                to-[#020617]

                flex
                items-center
                justify-center

                overflow-hidden
                relative

                p-5
            "
        >

            {/* BACKGROUND GLOW */}

            <div
                className="

                    absolute

                    w-[600px]
                    h-[600px]

                    bg-blue-500/10

                    blur-3xl

                    rounded-full
                "
            />

            {/* CARD */}

            <div
                className="

                    relative

                    w-full
                    max-w-md

                    bg-[#0f172a]/80

                    backdrop-blur-2xl

                    border
                    border-blue-400/10

                    rounded-[32px]

                    shadow-2xl
                    shadow-blue-500/10

                    p-8
                "
            >

                {/* HEADER */}

                <div className="mb-8">

                    <h1
                        className="

                            text-4xl
                            font-bold

                            text-slate-100
                        "
                    >

                        Pay Securely

                    </h1>

                    <p
                        className="

                            text-slate-400

                            mt-2
                        "
                    >

                        Real-time fraud monitoring enabled

                    </p>

                </div>

                {/* ACTIVE USER */}

                <div
                    className="

                        bg-black/20

                        border
                        border-blue-400/10

                        rounded-2xl

                        p-4

                        mb-6
                    "
                >

                    <p className="text-slate-500">

                        Active UPI ID

                    </p>

                    <h2
                        className="

                            text-blue-300
                            font-semibold

                            mt-1
                        "
                    >

                        {loggedInUser}

                    </h2>

                </div>

                {/* INPUTS */}

                <div className="space-y-5">

                    <input
                        type="text"

                        name="receiver"

                        placeholder="Receiver UPI ID"

                        value={formData.receiver}

                        onChange={handleChange}

                        className="

                            w-full

                            bg-black/20

                            border
                            border-blue-400/10

                            focus:border-blue-400

                            text-slate-100

                            placeholder-slate-500

                            rounded-2xl

                            p-4

                            outline-none

                            transition-all
                            duration-300
                        "
                    />

                    <input
                        type="number"

                        name="amount"

                        placeholder="Amount"

                        value={formData.amount}

                        onChange={handleChange}

                        className="

                            w-full

                            bg-black/20

                            border
                            border-blue-400/10

                            focus:border-blue-400

                            text-slate-100

                            placeholder-slate-500

                            rounded-2xl

                            p-4

                            outline-none

                            transition-all
                            duration-300
                        "
                    />

                    <input
                        type="password"

                        name="otp"

                        placeholder="Enter OTP"

                        value={formData.otp}

                        onChange={handleChange}

                        className="

                            w-full

                            bg-black/20

                            border
                            border-blue-400/10

                            focus:border-blue-400

                            text-slate-100

                            placeholder-slate-500

                            rounded-2xl

                            p-4

                            outline-none

                            transition-all
                            duration-300
                        "
                    />

                </div>

                {/* OTP BUTTON */}

                <button

                    onClick={generateOtp}

                    className="

                        w-full

                        mt-6

                        bg-slate-800

                        hover:bg-slate-700

                        border
                        border-blue-400/10

                        text-blue-300

                        py-4

                        rounded-2xl

                        transition-all
                        duration-300
                    "
                >

                    Generate OTP

                </button>

                {/* PAY BUTTON */}

                <button

                    onClick={handlePayment}

                    disabled={loading}

                    className="

                        w-full

                        mt-4

                        bg-blue-500

                        hover:bg-blue-400

                        text-white

                        font-semibold

                        py-4

                        rounded-2xl

                        transition-all
                        duration-300

                        shadow-lg
                        shadow-blue-500/20

                        hover:scale-[1.02]
                    "
                >

                    {
                        loading

                        ? "Processing..."

                        : "Pay Now"
                    }

                </button>

                {/* MESSAGE */}

                {message && (

                    <div
                        className={`

                            mt-6

                            p-4

                            rounded-2xl

                            border

                            backdrop-blur-xl

                            text-center

                            font-medium

                            transition-all
                            duration-300

                            ${
                                message.includes("Successful")

                                ? `
                                    bg-green-500/10
                                    border-green-400/20
                                    text-green-300
                                    shadow-lg
                                    shadow-green-500/10
                                  `

                                : message.includes("Fraud") ||
                                  message.includes("Failed") ||
                                  message.includes("Invalid")

                                ? `
                                    bg-red-950/40
                                    border-red-500/20
                                    text-red-300
                                    shadow-lg
                                    shadow-red-500/10
                                  `

                                : `
                                    bg-blue-500/10
                                    border-blue-400/20
                                    text-blue-300
                                  `
                            }
                        `}
                    >

                        {message}

                    </div>
                )}

            </div>

        </div>
    );
}

export default PaymentPage;