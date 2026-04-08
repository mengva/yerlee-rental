
import { FileDto } from "../types/constants/interface";
import { validateMaxFileSizeNumber } from "./constants";

export class GlobalSecureFileUploadServices {

    public static readonly IMAGE_FILE_TYPE = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

    public static readonly ALLOWED_PDF_FILE_SIGNATURES = {
        '25504446': 'application/pdf', // PDF file
    };

    public static readonly ALLOWED_IMAGE_FILE_SIGNATURES = {
        'ffd8ff': 'image/jpeg',      // JPEG file
        '89504e': 'image/png',       // PNG file
        '474946': 'image/jpg',       // GIF signature but mapped to jpg
        '52494646': 'image/webp',    // WEBP file
    };

    public static readonly ALLOWED_FILE_SIGNATURES = {
        ...this.ALLOWED_PDF_FILE_SIGNATURES,
        ...this.ALLOWED_IMAGE_FILE_SIGNATURES,
    };

    public static validationFile(file: FileDto): { valid: boolean; error?: string } {
        if (file.size > validateMaxFileSizeNumber) {
            return { valid: false, error: 'File size exceeds 10MB limit' };
        }
        // ตรวจสอบ file signature
        const base64Data = file.fileData.split(',')[1] || '';
        const buffer = Buffer.from(base64Data, 'base64');
        const signature = buffer.toString('hex', 0, 8).toLowerCase();
        let isValidImage = false;
        for (const [sig, type] of Object.entries(this.ALLOWED_FILE_SIGNATURES)) {
            if (signature.startsWith(sig)) {
                isValidImage = true;
                break;
            }
        }
        if (!isValidImage) {
            return { valid: false, error: 'Invalid file type' };
        }
        return { valid: true };
    }

    public static async validationFiles(files: FileDto[]): Promise<string | undefined> {
        const valids = await Promise.all(
            files.map(file => this.validationFile(file))
        )
        const errorMessage = valids.find(v => v.valid === false)?.error;
        return errorMessage;
    }

}