function StatCard({ label, value, suffix, accent = "white", dark = false }) {
    const light = {
        white: "text-gray-900",
        green: "text-emerald-600",
        amber: "text-amber-600",
        red: "text-red-600",
        blue: "text-[#2563eb]"
    };

    const darkColors = {
        white: "text-white",
        green: "text-emerald-400",
        amber: "text-amber-400",
        red: "text-red-400",
        blue: "text-blue-400"
    };

    const colors = dark ? darkColors : light;

    return (
        <div
            className={
                dark
                    ? "bg-[#0b1623] border border-[#1a2d42] rounded-xl p-4"
                    : "bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            }
        >
            <p
                className={`text-[11px] font-medium uppercase tracking-wide mb-1 ${
                    dark ? "text-slate-500" : "text-gray-500"
                }`}
            >
                {label}
            </p>
            <p className={`text-2xl font-bold ${colors[accent] || colors.white}`}>
                {value}
                {suffix && <span className="text-base font-semibold">{suffix}</span>}
            </p>
        </div>
    );
}

export default StatCard;
