import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import UpiEntryPage from "./pages/UpiEntryPage";

import PaymentPage from "./pages/PaymentPage";

import Dashboard from "./pages/Dashboard";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<UpiEntryPage />}
                />

                <Route
                    path="/pay"
                    element={<PaymentPage />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;