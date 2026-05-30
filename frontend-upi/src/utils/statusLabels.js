export const statusLabel = (status) => {
    switch (status) {
        case "SUCCESS":
            return "Successful";
        case "MFA":
            return "On hold";
        case "BLOCKED":
            return "Declined";
        default:
            return status || "—";
    }
};

export const statusStyle = (status, dark = false) => {
    if (dark) {
        switch (status) {
            case "SUCCESS":
                return "bg-emerald-900/30 text-emerald-400 border-emerald-800/40";
            case "MFA":
                return "bg-amber-900/30 text-amber-400 border-amber-800/40";
            case "BLOCKED":
                return "bg-red-900/30 text-red-400 border-red-800/40";
            default:
                return "bg-slate-800 text-slate-400 border-slate-700";
        }
    }

    switch (status) {
        case "SUCCESS":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "MFA":
            return "bg-amber-50 text-amber-800 border-amber-200";
        case "BLOCKED":
            return "bg-red-50 text-red-700 border-red-200";
        default:
            return "bg-gray-50 text-gray-600 border-gray-200";
    }
};

export const mapPaymentMessage = (data) => {
    if (!data) return "";

    switch (data.status) {
        case "SUCCESS":
            return `Paid ₹${data.transaction?.amount ?? ""} successfully`;
        case "MFA":
            return "Payment on hold. Complete verification in your bank app to finish.";
        case "BLOCKED":
            return "Payment failed. Money was not sent.";
        default:
            return data.message || "";
    }
};
