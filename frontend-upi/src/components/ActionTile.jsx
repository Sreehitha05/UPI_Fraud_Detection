import { Link } from "react-router-dom";

function ActionTile({ to, icon, label, sublabel, accent = "blue" }) {
    const accents = {
        blue: "bg-[#0d1f30] border-[#1e3448] hover:border-blue-700/50",
        green: "bg-[#0d1f30] border-[#1e3448] hover:border-emerald-700/50",
        violet: "bg-[#0d1f30] border-[#1e3448] hover:border-violet-700/50",
        slate: "bg-[#0d1f30] border-[#1e3448] hover:border-slate-600"
    };

    const iconColors = {
        blue: "text-blue-400",
        green: "text-emerald-400",
        violet: "text-violet-400",
        slate: "text-slate-400"
    };

    return (
        <Link
            to={to}
            className={`block rounded-xl border p-4 transition-colors ${accents[accent]}`}
        >
            <div className={`mb-3 ${iconColors[accent]}`}>{icon}</div>
            <p className="font-semibold text-white text-[15px]">{label}</p>
            {sublabel && (
                <p className="text-slate-500 text-xs mt-0.5">{sublabel}</p>
            )}
        </Link>
    );
}

export default ActionTile;
