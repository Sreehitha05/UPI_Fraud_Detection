function AlertBox({ message }) {
    return (
        <div
            className="
                fixed
                top-4
                right-4
                z-50
                flex
                items-start
                gap-3
                bg-[#0f1923]
                border
                border-red-500/30
                text-white
                px-5
                py-4
                rounded-2xl
                shadow-2xl
                shadow-black/40
                max-w-sm
                animate-bounce
            "
        >
            <div
                className="
                    w-9
                    h-9
                    rounded-xl
                    bg-red-500/15
                    flex
                    items-center
                    justify-center
                    shrink-0
                    mt-0.5
                "
            >
                <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                </svg>
            </div>

            <div>
                <p
                    className="
                        text-sm
                        font-600
                        text-white
                        leading-tight
                    "
                >
                    Transaction Blocked
                </p>
                <p
                    className="
                        text-xs
                        text-slate-400
                        mt-1
                        leading-relaxed
                    "
                >
                    {message}
                </p>
            </div>
        </div>
    );
}

export default AlertBox;