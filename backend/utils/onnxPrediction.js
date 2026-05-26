const ort = require("onnxruntime-node");

let session;

// LOAD MODEL

const loadModel = async () => {

    try {

        session = await ort.InferenceSession.create(
            "./model/fraud_detection_model.onnx"
        );

        console.log("ONNX Model Loaded");

    } catch (error) {

        console.log("Model Load Error:", error);
    }
};

// PREDICT FRAUD

const predictFraud = async (features) => {

    try {

        const input = new ort.Tensor(
            "float32",
            Float32Array.from(features),
            [1, features.length]
        );

        const feeds = {
            float_input: input
        };

        const results = await session.run(feeds);

        console.log("ONNX Results:", results);

        const outputName =
            Object.keys(results)[0];

        let prediction =
            results[outputName].data[0];

        // HANDLE INVALID VALUES

        if (
            prediction === undefined ||
            prediction === null ||
            isNaN(prediction)
        ) {

            prediction = 0;
        }

        return Number(prediction);

    } catch (error) {

        console.log(
            "ONNX Prediction Error:",
            error
        );

        return 0;
    }
};

module.exports = {
    loadModel,
    predictFraud
};