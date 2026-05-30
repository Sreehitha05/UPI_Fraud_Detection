const path = require("path");
const ort = require("onnxruntime-node");

let session = null;
let modelLoaded = false;

const loadModel = async () => {
    try {
        const modelPath = path.join(
            __dirname,
            "..",
            "model",
            "fraud_detection_model.onnx"
        );

        session = await ort.InferenceSession.create(modelPath);
        modelLoaded = true;
        console.log("ONNX model loaded");
    } catch (error) {
        modelLoaded = false;
        console.error("Model load error:", error.message);
    }
};

const isModelReady = () => modelLoaded && session !== null;

const predictFraud = async (features) => {
    if (!isModelReady()) {
        return 0;
    }

    try {
        const input = new ort.Tensor(
            "float32",
            Float32Array.from(features),
            [1, features.length]
        );

        const feeds = { float_input: input };
        const results = await session.run(feeds);
        const outputName = Object.keys(results)[0];
        let prediction = results[outputName].data[0];

        if (
            prediction === undefined ||
            prediction === null ||
            Number.isNaN(prediction)
        ) {
            prediction = 0;
        }

        return Number(prediction);
    } catch (error) {
        console.error("ONNX prediction error:", error.message);
        return 0;
    }
};

module.exports = {
    loadModel,
    predictFraud,
    isModelReady
};
