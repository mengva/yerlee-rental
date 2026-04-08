// vairables
export const ValidationEmailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
export const validateMaxFileSizeStr = "4MB";
export const validateMaxFileSizeNumber = 4 * 1024 * 1024; //4MB
export const AllowedImageFileType = "image/jpeg, image/png, image/web";
export const staffTokenName = "staff_auth_token";
export const customerTokenName = "customer_auth_token";
export const ownerTokenName = "owner_auth_token";

export const formatGenderLanguages = {
    "en": ["male", "female", "other"] as const,
    "lo": ["ຊາຍ", "ຍິງ", "ອື່ນໆ"] as const
}

export const LocalLanguage = ["en", "lo", "th"];