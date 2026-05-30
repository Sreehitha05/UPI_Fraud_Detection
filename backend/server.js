const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const paymentRoutes = require("./routes/paymentRoutes");
const { loadModel, isModelReady } = require("./utils/onnxPrediction");

const PORT = Number(process.env.PORT) || 5000;

const getCorsOrigins = () => {
    if (process.env.CORS_ORIGIN) {
        return process.env.CORS_ORIGIN.split(",").map((o) => o.trim());
    }

    return [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ];
};

const corsOrigins = getCorsOrigins();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: corsOrigins,
        methods: ["GET", "POST"]
    }
});

app.locals.ready = false;
app.locals.mongoConnected = false;
app.locals.modelReady = false;

app.use(
    cors({
        origin: corsOrigins,
        methods: ["GET", "POST"]
    })
);
app.use(express.json({ limit: "10kb" }));

app.set("io", io);
app.use("/", paymentRoutes);

io.on("connection", () => {
    console.log("Dashboard connected");
});

const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not set in environment");
        }

        await mongoose.connect(process.env.MONGO_URI);
        app.locals.mongoConnected = true;
        console.log("MongoDB connected");

        await loadModel();
        app.locals.modelReady = isModelReady();

        if (!app.locals.modelReady) {
            console.warn(
                "ONNX model unavailable — rule-based detection only"
            );
        }

        app.locals.ready = true;

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`CORS allowed: ${corsOrigins.join(", ")}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
