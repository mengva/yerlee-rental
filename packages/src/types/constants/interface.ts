export interface FilterDto {
    page: number;
    limit: number
}

export interface PaginationFilterDto {
    total: number;
    page: number;
    totalPage: number;
    limit: number;
}

export interface ServerResponseDto {
    success: boolean;
    message: string;
    data: any;
}

export interface FileDto {
    fileData: string; // base64 string
    fileName: string;
    fileType: string;
    size: number; // in bytes
}