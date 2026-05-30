const styles = {
    LOW: "bg-emerald-900/30 border-emerald-700/40 text-emerald-400",
    MEDIUM: "bg-amber-900/30 border-amber-700/40 text-amber-400",
    HIGH: "bg-red-900/30 border-red-700/40 text-red-400",
    SUCCESS: "bg-emerald-900/30 border-emerald-700/40 text-emerald-400",
    MFA: "bg-amber-900/30 border-amber-700/40 text-amber-400",
    BLOCKED: "bg-red-900/30 border-red-700/40 text-red-400"
};

const labels = {
    LOW: "Low Risk",
    MEDIUM: "Medium — MFA",
    HIGH: "High — Blocked",
    SUCCESS: "Allow",
    MFA: "MFA Required",
    BLOCKED: "Blocked"
};

function RiskBadge({ band, status, score }) {
    const key = band || status || "LOW";
    const label = labels[key] || key;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${styles[key] || styles.LOW}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${key === "BLOCKED" || key === "HIGH" ? "bg-red-400" : key === "MFA" || key === "MEDIUM" ? "bg-amber-400" : "bg-emerald-400"}`} />
            {label}
            {typeof score === "number" && (
                <span className="opacity-80">({score})</span>
            )}
        </span>
    );
}

export default RiskBadge;
