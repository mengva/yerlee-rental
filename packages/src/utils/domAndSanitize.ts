import { DOMPurifyServices } from "./domPurify";
import { SecureSanitizeServices } from "./sanitize";

export class DomAndSanitizeServices {
    public static object(obj: unknown) {
        const domInfoValidate = DOMPurifyServices.sanitizeObject(obj);
        const result = SecureSanitizeServices.sanitizeObject(domInfoValidate);
        return result;
    }

    public static string(str: string): string {
        if (!str) return '';
        const strInfo = DOMPurifyServices.sanitizeString(str);
        if (!strInfo) return '';
        const result = SecureSanitizeServices.sanitizeString(strInfo);
        return result;
    }
}