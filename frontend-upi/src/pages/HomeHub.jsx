import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ActionTile from "../components/ActionTile";
import MpinModal from "../components/MpinModal";
import {
    hasMpin,
    setMpin,
    verifyMpin,
    clearMpin,
    getBalance,
    formatBalance
} from "../utils/account";

const SendIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

const ReceiveIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
    </svg>
);

const HistoryIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ShieldIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
);

function HomeHub() {
    const navigate = useNavigate();
    const upiId = localStorage.getItem("upiId");

    const [balanceVisible, setBalanceVisible] = useState(false);
    const [mpinMode, setMpinMode] = useState(null);

    if (!upiId) {
        navigate("/", { replace: true });
        return null;
    }

    const initial = upiId.charAt(0).toUpperCase();
    const balance = getBalance(upiId);

    const requestBalance = () => {
        if (balanceVisible) {
            setBalanceVisible(false);
            return;
        }

        if (!hasMpin(upiId)) {
            setMpinMode("setup");
            return;
        }

        setMpinMode("verify");
    };

    const handleMpinSubmit = async (mpin) => {
        if (mpinMode === "setup") {
            await setMpin(upiId, mpin);
            setMpinMode(null);
            setBalanceVisible(true);
            return;
        }

        const ok = await verifyMpin(upiId, mpin);

        if (!ok) {
            throw new Error("Incorrect MPIN");
        }

        setMpinMode(null);
        setBalanceVisible(true);
    };

    const handleForgotMpin = () => {
        clearMpin(upiId);
        setMpinMode("setup");
    };

    const switchAccount = () => {
        localStorage.removeItem("upiId");
        localStorage.removeItem("mobile");
        navigate("/");
    };

    return (
        <AppLayout hideHeader variant="dark">
            {mpinMode && (
                <MpinModal
                    mode={mpinMode}
                    onSubmit={handleMpinSubmit}
                    onClose={() => setMpinMode(null)}
                    onForgot={handleForgotMpin}
                />
            )}

            <div className="pb-4 home-landscape">
                <div className="home-landscape-header bg-[#0b1623] border border-[#1a2d42] mx-4 mt-4 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold">
                                {initial}
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">Account</p>
                                <p className="text-white font-medium text-sm truncate max-w-[200px]">
                                    {upiId}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={switchAccount}
                            className="text-slate-400 text-xs hover:text-white"
                        >
                            Switch
                        </button>
                    </div>

                    <p className="text-slate-400 text-sm mb-1">Available balance</p>
                    <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-3xl font-bold text-white tracking-tight">
                            {balanceVisible
                                ? formatBalance(balance)
                                : "₹ ••••••"}
                        </p>
                        <button
                            type="button"
                            onClick={requestBalance}
                            className="text-sm font-medium px-3 py-1.5 rounded-lg bg-[#1e3448] text-blue-300 hover:bg-[#253a52]"
                        >
                            {balanceVisible ? "Hide" : "Show with MPIN"}
                        </button>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-2">
                        Demo balance · unique MPIN per UPI ID · stored on this device only
                    </p>
                </div>

                <div className="home-landscape-actions px-4 pt-2">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-3 px-1">
                        Quick actions
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <ActionTile
                            to="/pay"
                            accent="blue"
                            icon={<SendIcon />}
                            label="Send money"
                            sublabel="Transfer"
                        />
                        <ActionTile
                            to="/receive"
                            accent="green"
                            icon={<ReceiveIcon />}
                            label="Receive"
                            sublabel="Your UPI ID"
                        />
                        <ActionTile
                            to="/history"
                            accent="slate"
                            icon={<HistoryIcon />}
                            label="History"
                            sublabel="Your payments"
                        />
                        <ActionTile
                            to="/dashboard"
                            accent="violet"
                            icon={<ShieldIcon />}
                            label="Fraud detection"
                            sublabel="Rules & reports"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default HomeHub;
