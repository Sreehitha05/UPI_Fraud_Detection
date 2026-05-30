const readyMiddleware = (req, res, next) => {
    if (!req.app.locals.ready) {
        return res.status(503).json({
            message: "Service starting. Try again shortly."
        });
    }

    next();
};

module.exports = readyMiddleware;
