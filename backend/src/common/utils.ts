import * as bcrypt from 'bcrypt';
import sanitizeHtml from 'sanitize-html';
import xss from 'xss';
import { BCRYPT_SALT_ROUNDS } from '../config/environtment';

export class Utils {
    static async hashPassword(plain: string) {
        console.log(plain, BCRYPT_SALT_ROUNDS)
        return bcrypt.hash(plain, BCRYPT_SALT_ROUNDS);
    }

    static async comparePassword(plain: string, hash: string) {
        return bcrypt.compare(plain, hash);
    }

    static async sanitizeString(s: string) {
        if (!s) return s;
        const cleaned = sanitizeHtml(s, {
            allowedTags: [],
            allowedAttributes: {},
        });
        return xss(cleaned);
    }

    static sanitizeObject(obj: any) {
        if (!obj) return obj;
        if (typeof obj === 'string') return Utils.sanitizeString(obj);
        if (Array.isArray(obj)) return obj.map(Utils.sanitizeObject);
        if (typeof obj === 'object') {
            const out: any = {};
            for (const k of Object.keys(obj)) {
                out[k] = Utils.sanitizeObject(obj[k]);
            }
            return out;
        }
        return obj;
    }

    static parseExpirationToSeconds(exp: string | number) {
        if (typeof exp === 'number') return exp;

        const regex = /^(\d+)([smhd])?$/i;
        const match = exp.match(regex);

        if (!match) {
            throw new Error(`Invalid expiration format: "${exp}"`);
        }

        const value = parseInt(match[1], 10);
        const unit = match[2]?.toLowerCase() || 's';

        switch (unit) {
            case 's':
                return value;
            case 'm':
                return value * 60;
            case 'h':
                return value * 60 * 60;
            case 'd':
                return value * 60 * 60 * 24;
            default:
                throw new Error(`Unknown unit in expiration: "${unit}"`);
        }
    }

    static buildPagination(
        totalItems: number,
        page: number,
        limit: number,
    ) {
        const totalPages = Math.ceil(totalItems / limit) || 1;
        const currentPage = Math.max(1, Number(page));
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

        return {
            totalItems,
            totalPages,
            currentPage,
            hasNextPage,
            hasPrevPage,
            page: Number(page),
            limit: Number(limit),
        };
    }

}