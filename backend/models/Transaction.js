const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

    sender: {
        type: String,
        required: true
    },

    receiver: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    otp: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "SUCCESS"
    },

    fraudScore: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Transaction",
    transactionSchema
);