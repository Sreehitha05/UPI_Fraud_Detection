const MPIN_KEY = "upi_mpins";
const BALANCE_KEY = "upi_balances";
const DEFAULT_BALANCE = 50000;

const hashMpin = async (upiId, mpin) => {
    const data = new TextEncoder().encode(
        `${upiId.toLowerCase()}:${mpin}`
    );
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
};

const readJson = (key, fallback) => {
    try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
        return fallback;
    }
};

const writeJson = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const hasMpin = (upiId) => {
    const mpins = readJson(MPIN_KEY, {});
    return Boolean(mpins[upiId.toLowerCase()]);
};

export const setMpin = async (upiId, mpin) => {
    if (!/^\d{4,6}$/.test(mpin)) {
        throw new Error("MPIN must be 4–6 digits");
    }

    const mpins = readJson(MPIN_KEY, {});
    const id = upiId.toLowerCase();
    mpins[id] = await hashMpin(id, mpin);
    writeJson(MPIN_KEY, mpins);

    const balances = readJson(BALANCE_KEY, {});
    if (balances[id] === undefined) {
        balances[id] = DEFAULT_BALANCE;
        writeJson(BALANCE_KEY, balances);
    }
};

export const verifyMpin = async (upiId, mpin) => {
    const mpins = readJson(MPIN_KEY, {});
    const stored = mpins[upiId.toLowerCase()];

    if (!stored) return false;

    const hash = await hashMpin(upiId.toLowerCase(), mpin);
    return hash === stored;
};

export const getBalance = (upiId) => {
    const balances = readJson(BALANCE_KEY, {});
    const id = upiId.toLowerCase();

    if (balances[id] === undefined) {
        balances[id] = DEFAULT_BALANCE;
        writeJson(BALANCE_KEY, balances);
    }

    return balances[id];
};

export const deductBalance = (upiId, amount) => {
    const balances = readJson(BALANCE_KEY, {});
    const id = upiId.toLowerCase();
    const current = balances[id] ?? DEFAULT_BALANCE;
    balances[id] = Math.max(0, current - amount);
    writeJson(BALANCE_KEY, balances);
    return balances[id];
};

export const formatBalance = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
