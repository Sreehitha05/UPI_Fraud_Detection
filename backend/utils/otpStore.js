const OTP_TTL_MS =
    Number(process.env.OTP_TTL_MS) || 5 * 60 * 1000;

const store = new Map();

const generateOtp = () =>
    String(Math.floor(1000 + Math.random() * 9000));

const normalizeMobile = (mobile) => {
    const digits = String(mobile).replace(/\D/g, "");

    if (digits.length !== 10) {
        return null;
    }

    return digits;
};

const setOtp = (sender, mobile) => {
    const normalized = String(sender).trim().toLowerCase();
    const mobileDigits = normalizeMobile(mobile);

    if (!mobileDigits) {
        return { error: "Enter a valid 10-digit mobile number" };
    }

    const otp = generateOtp();

    store.set(normalized, {
        otp,
        mobile: mobileDigits,
        expiresAt: Date.now() + OTP_TTL_MS
    });

    return {
        otp,
        mobileDigits,
        masked: `******${mobileDigits.slice(-4)}`
    };
};

const verifyOtp = (sender, otp, mobile) => {
    const normalized = String(sender).trim().toLowerCase();
    const mobileDigits = normalizeMobile(mobile);
    const entry = store.get(normalized);

    if (!entry || Date.now() > entry.expiresAt) {
        store.delete(normalized);
        return false;
    }

    if (!mobileDigits || entry.mobile !== mobileDigits) {
        return false;
    }

    const valid = entry.otp === String(otp).trim();

    if (valid) {
        store.delete(normalized);
    }

    return valid;
};

const pruneExpired = () => {
    const now = Date.now();

    for (const [key, entry] of store.entries()) {
        if (now > entry.expiresAt) {
            store.delete(key);
        }
    }
};

setInterval(pruneExpired, 60 * 1000).unref();

module.exports = {
    setOtp,
    verifyOtp,
    normalizeMobile
};
