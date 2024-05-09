import { getIp } from "./get-ip";

const trackers: Record<string, { count: number; expiresAt: number }> = {};

export async function rateLimitByIp(limit: number = 1, window = 10000) {
    const ip = getIp();

    if (!ip) {
        throw new Error("IP address is not found.");
    }

    return rateLimitByKey(ip, limit, window)
}


export async function rateLimitByKey(key: string, limit: number = 1, window = 10000) {
    const tracker = trackers[key] || { count: 0, expiresAt: 0 };

    if (!trackers[key]) {
        trackers[key] = tracker;
    }

    if (tracker.expiresAt < Date.now()) {
        tracker.count = 0;
        tracker.expiresAt = Date.now() + window;
    }

    tracker.count++;

    if (tracker.count > limit) {
        return { error: `Too many requests. Please try again later.` };
    }
}
