import { useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";

function AppLayout({
    children,
    showBack,
    onBack,
    variant = "light",
    wide = false,
    hideNav = false,
    hideHeader = false
}) {
    const navigate = useNavigate();
    const isDark = variant === "dark";

    const goBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    const shellClass = wide ? "app-shell-wide" : "app-shell";

    return (
        <div
            className={`min-h-screen flex flex-col pb-16 ${
                isDark ? "bg-[#060d17] text-white" : "bg-[#e8eef4] text-gray-900"
            }`}
        >
            {!hideHeader && (
                <header
                    className={`sticky top-0 z-10 border-b ${
                        isDark
                            ? "bg-[#0b1623] border-[#1a2d42]"
                            : "bg-white border-gray-200"
                    }`}
                >
                    <div
                        className={`${shellClass} px-4 h-14 flex items-center justify-between`}
                    >
                        {showBack ? (
                            <button
                                type="button"
                                onClick={goBack}
                                className={`w-10 h-10 -ml-2 flex items-center justify-center rounded-full ${
                                    isDark
                                        ? "hover:bg-white/5 text-slate-300"
                                        : "hover:bg-gray-100 text-gray-700"
                                }`}
                                aria-label="Back"
                            >
                                <svg
                                    className="w-5 h-5"
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
                        ) : (
                            <span className="w-10" />
                        )}

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center">
                                <span className="text-white text-xs font-bold">U</span>
                            </div>
                            <span
                                className={`font-semibold text-[15px] ${
                                    isDark ? "text-white" : "text-gray-900"
                                }`}
                            >
                                UPI Pay
                            </span>
                        </div>

                        <span className="w-10" />
                    </div>
                </header>
            )}

            <main className={`flex-1 w-full ${shellClass}`}>{children}</main>

            {!hideNav && <BottomNav />}
        </div>
    );
}

export default AppLayout;
