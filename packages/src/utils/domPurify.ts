import DOMPurify from "dompurify";
import { JSDOM } from 'jsdom';

interface ValidationResultDto {
    message: string;
    error: boolean;
}

export class DOMPurifyServices {

    private static window = new JSDOM('').window;
    private static purify = DOMPurify(this.window);

    public static sanitizeString(str: string): string | null {
        if (!str || typeof str !== "string") {
            return '';
        }
        // 🧼 Sanitize base HTML
        const clean = this.purify.sanitize(str);
        return clean;
    }

    public static validationDate(date: string): ValidationResultDto {
        const start = new Date(date)
        if (!date) {
            return {
                error: false,
                message: ''
            }
        }
        if (isNaN(start.getTime())) {
            return {
                message: 'Invalid date format',
                error: true,
            };
        }
        const oneYearAgo = new Date()
        if (start.getFullYear() > oneYearAgo.getFullYear()) {
            return {
                message: 'Invalid current date formatter',
                error: true,
            };
        }
        return {
            message: '',
            error: false
        };
    }

    public static sanitizeObject(obj: unknown): unknown {
        // Handle null and undefined explicitly
        if (obj === null || obj === undefined || !obj) {
            return ''; // or '' depending on your needs
        }
        
        const keys: string[] = Object.keys(obj);
        const imageFileKeys: string[] = ["fileName", "fileType", "fileData", "size"];
        const isValidImageFile = Boolean(keys && keys.length && imageFileKeys.every(key => imageFileKeys.includes(key)) && keys.length === imageFileKeys.length);

        if (isValidImageFile) {
            return obj;
        }
        
        // Handle arrays
        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }


        // Handle objects
        if (typeof obj === 'object') {
            const sanitized: Record<string, unknown> = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    sanitized[key] = this.sanitizeObject((obj as Record<string, unknown>)[key]);
                }
            }
            return sanitized;
        }

        // Handle strings
        if (typeof obj === "string") {
            const str = this.sanitizeString(obj);
            return str?.trim() ?? '';
        }
        // Fallback
        return obj;
    }

    // exp: 2024-06-01T12:00:00Z or 2024-06-01
    private static isValidDateString(str: string): boolean {
        // More strict: Check for ISO 8601 or common date formats
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}/;
        if (!isoDateRegex.test(str) && str.length < 8) {
            return false;
        }
        const date = new Date(str);
        return !isNaN(date.getTime());
    }
}