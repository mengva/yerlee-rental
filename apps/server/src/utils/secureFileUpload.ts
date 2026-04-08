import type { FileDto } from '@/server/packages/types/constants/interface';

export interface ResponseFileDto {
    url: string;
    size: number;
    type: string;
    width: number;
    height: number;
    publicId: string;
}

export interface ImageFileDto {
    files: FileDto[];
}

export class SecureFileUploadServices {

    
}