import { useState } from "react";

function MpinModal({ mode, onSubmit, onClose, onForgot }) {
    const [mpin, setMpin] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");

    const isSetup = mode === "setup";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!/^\d{4,6}$/.test(mpin)) {
            setError("MPIN must be 4–6 digits");
            return;
        }

        if (isSetup && mpin !== confirm) {
            setError("MPINs do not match");
            return;
        }

        try {
            await onSubmit(mpin);
        } catch (err) {
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm bg-[#0b1623] border border-[#1a2d42] rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-white mb-1">
                    {isSetup ? "Set MPIN" : "Enter MPIN"}
                </h2>
                <p className="text-sm text-slate-400 mb-5">
                    {isSetup
                        ? "Create a unique MPIN for this UPI ID. Required to view balance."
                        : "Enter your MPIN to view account balance."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        autoFocus
                        placeholder="MPIN"
                        value={mpin}
                        onChange={(e) =>
                            setMpin(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        className="w-full bg-[#0d1f30] border border-[#1e3448] rounded-xl px-4 py-3 text-white text-center tracking-[0.4em] outline-none focus:border-blue-600"
                    />

                    {isSetup && (
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Confirm MPIN"
                            value={confirm}
                            onChange={(e) =>
                                setConfirm(
                                    e.target.value.replace(/\D/g, "").slice(0, 6)
                                )
                            }
                            className="w-full bg-[#0d1f30] border border-[#1e3448] rounded-xl px-4 py-3 text-white text-center tracking-[0.4em] outline-none focus:border-blue-600"
                        />
                    )}

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold"
                    >
                        {isSetup ? "Save MPIN" : "Confirm"}
                    </button>

                    {!isSetup && onForgot && (
                        <button
                            type="button"
                            onClick={onForgot}
                            className="w-full py-2 text-blue-300 text-sm"
                        >
                            Forgot MPIN?
                        </button>
                    )}
                    {!isSetup && onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-2 text-slate-500 text-sm"
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default MpinModal;
