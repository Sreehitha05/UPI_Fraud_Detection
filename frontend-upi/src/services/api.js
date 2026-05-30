import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    }
});

export const generateOtp = (body) =>
    api.post("/otp/generate", body);

export const processPayment = (payload) =>
    api.post("/pay", payload);

export const fetchTransactions = (limit = 50, sender) =>
    api.get("/transactions", {
        params: { limit, ...(sender ? { sender } : {}) }
    });

export const fetchAnalytics = () => api.get("/analytics");

export const fetchFraudInfo = () => api.get("/fraud/info");

export const fetchFraudReport = () => api.get("/fraud/report");

export default api;
