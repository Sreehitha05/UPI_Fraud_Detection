const express = require("express");
const { processPayment } = require("../controllers/paymentController");
const { requestOtp } = require("../controllers/otpController");
const { listTransactions } = require("../controllers/transactionController");
const { getAnalytics } = require("../controllers/analyticsController");
const {
    getFraudInfo,
    getFraudReport
} = require("../controllers/fraudInfoController");
const readyMiddleware = require("../middleware/ready");
const validatePayment = require("../middleware/validatePayment");
const validateOtpRequest = require("../middleware/validateOtpRequest");
const createRateLimit = require("../middleware/rateLimit");

const router = express.Router();

const paymentLimit = createRateLimit({
    windowMs: 60_000,
    max: 20,
    keyGenerator: (req) =>
        `pay:${req.ip}:${req.body?.sender || "unknown"}`
});

const otpLimit = createRateLimit({
    windowMs: 60_000,
    max: 10,
    keyGenerator: (req) =>
        `otp:${req.ip}:${req.body?.sender || "unknown"}`
});

router.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        ready: Boolean(req.app.locals.ready),
        mongo: Boolean(req.app.locals.mongoConnected),
        model: Boolean(req.app.locals.modelReady)
    });
});

router.get("/transactions", readyMiddleware, listTransactions);
router.get("/analytics", readyMiddleware, getAnalytics);
router.get("/fraud/info", readyMiddleware, getFraudInfo);
router.get("/fraud/report", readyMiddleware, getFraudReport);

router.post(
    "/otp/generate",
    readyMiddleware,
    otpLimit,
    validateOtpRequest,
    requestOtp
);

router.post(
    "/pay",
    readyMiddleware,
    paymentLimit,
    validatePayment,
    processPayment
);

module.exports = router;
