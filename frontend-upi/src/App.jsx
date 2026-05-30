import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import UpiEntryPage from "./pages/UpiEntryPage";

import PaymentPage from "./pages/PaymentPage";

import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import HomeHub from "./pages/HomeHub";
import ReceivePage from "./pages/ReceivePage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UpiEntryPage />} />
                <Route path="/home" element={<HomeHub />} />
                <Route path="/pay" element={<PaymentPage />} />
                <Route path="/receive" element={<ReceivePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;