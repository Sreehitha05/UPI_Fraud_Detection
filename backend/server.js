const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

app.set("io", io);

app.use("/", paymentRoutes);
server.listen(5000, () => {
    console.log("Server running on port 5000");
});
const {
    loadModel
} = require("./utils/onnxPrediction");


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});
loadModel();

io.on("connection", (socket) => {
    console.log("User Connected");
});
