const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    receiver: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    amount: {
        type: Number,
        required: true,
        min: 1
    },

    status: {
        type: String,
        enum: ["SUCCESS", "MFA", "BLOCKED"],
        default: "SUCCESS"
    },

    riskBand: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: "LOW"
    },

    fraudScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 1
    },

    ruleScore: {
        type: Number,
        default: 0
    },

    aiPrediction: {
        type: Number,
        default: 0
    },

    blockReason: {
        type: String,
        default: ""
    },

    processingMs: {
        type: Number
    },

    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

transactionSchema.index({ sender: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
