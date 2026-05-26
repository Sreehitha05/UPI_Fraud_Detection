import { useState } from "react";

import { useNavigate } from "react-router-dom";

function UpiEntryPage() {

    const navigate = useNavigate();

    const [upiId, setUpiId] =
        useState("");

    const handleContinue = () => {

        if (!upiId) return;

        localStorage.setItem(
            "upiId",
            upiId
        );

        navigate("/pay");
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

                    w-[500px]
                    h-[500px]

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

                {/* TOP ICON */}

                <div
                    className="

                        w-16
                        h-16

                        rounded-2xl

                        bg-blue-500/10

                        border
                        border-blue-400/20

                        flex
                        items-center
                        justify-center

                        mb-8
                    "
                >

                    <div
                        className="

                            w-7
                            h-7

                            rounded-full

                            bg-blue-400

                            shadow-lg
                            shadow-blue-400/40
                        "
                    />

                </div>

                {/* TITLE */}

                <h1
                    className="

                        text-4xl
                        font-bold

                        text-slate-100

                        mb-3
                    "
                >

                    Secure UPI

                </h1>

                <p
                    className="

                        text-slate-400

                        mb-10
                    "
                >

                    AI-powered fraud protected payments

                </p>

                {/* INPUT */}

                <input
                    type="text"

                    placeholder="Enter your UPI ID"

                    value={upiId}

                    onChange={(e) =>
                        setUpiId(
                            e.target.value
                        )
                    }

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

                {/* BUTTON */}

                <button

                    onClick={handleContinue}

                    className="

                        w-full

                        mt-8

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

                    Continue

                </button>

            </div>

        </div>
    );
}

export default UpiEntryPage;