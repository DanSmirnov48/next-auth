import { IncomingMessage } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'next/headers';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const getUserIp = (req: IncomingMessage): string | string[] | undefined => {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            return Array.isArray(forwarded) ? forwarded[0] : forwarded;
        }
        return req.socket.remoteAddress;
    };

    const userIp = getUserIp(req);
    res.status(200).json({ ip: userIp });
}

export function getIp() {
    const forwarded = headers().get('x-forwarded-for');
    const realIp = headers().get('x-real-ip');
    
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    if (realIp) {
        return realIp.trim();
    }

    return null
}