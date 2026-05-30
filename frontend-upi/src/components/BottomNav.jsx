import { NavLink, useNavigate } from "react-router-dom";

const tabs = [
    { to: "/home", label: "Home", end: true, needsLogin: true },
    { to: "/pay", label: "Pay", needsLogin: true },
    { to: "/history", label: "History", needsLogin: true },
    { to: "/dashboard", label: "Fraud", end: false }
];

function BottomNav() {
    const navigate = useNavigate();
    const upiId = localStorage.getItem("upiId");

    const handleClick = (e, tab) => {
        if (tab.needsLogin && !upiId) {
            e.preventDefault();
            navigate("/");
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0b1623] border-t border-[#1a2d42]">
            <div className="app-shell flex">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.to}
                        to={tab.to}
                        end={tab.end}
                        onClick={(e) => handleClick(e, tab)}
                        className={({ isActive }) =>
                            `flex-1 py-3 text-center text-[11px] font-medium border-t-2 transition-colors ${
                                isActive
                                    ? "text-blue-400 border-blue-500"
                                    : "text-slate-500 border-transparent"
                            }`
                        }
                    >
                        {tab.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

export default BottomNav;
