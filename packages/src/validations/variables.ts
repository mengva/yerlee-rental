import z from "zod"
import { formatGenderLanguages } from "../utils/constants/variables";

// not allowed enter html tag into input
export const forbiddenHtmlRegex = /[<>]/;

// 2. Regex not allowed links (xws li http://, https://, www.)
// not allowed link http, https, or file script into input
export const forbiddenLinkRegex = /(http:\/\/|https:\/\/|www\.)\S+/i;

// variable const
export const zodValidationStr = z.string().min(2, "String should be 2 characters")
    .nonempty("String is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "String cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "String cannot contain links (http://, https://, www.)." }
    )

export const zodValidationUuid = z.string().uuid("Invalid uuid formatter").nonempty("UUID is required");
export const zodValidationEmail = z.string().email("Invalid email formatter").nonempty("Email is required");
export const zodValidationPassword = z.string()
    .min(6, "password must be at least 6 characters")
    .max(128, "password too long")
    .regex(/^(?=.*[a-z])/, "must contain lowercase letter")
    .regex(/^(?=.*[A-Z])/, "must contain uppercase letter")
    .regex(/^(?=.*\d)/, "must contain number")
    .regex(/^(?=.*[@$!%*?&])/, "must contain special character")
    .nonempty("Password is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Password cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Password cannot contain links (http://, https://, www.)." }
    )

export const zodValidationConfirmPassword = z.string()
    .min(6, "password must be at least 6 characters")
    .max(128, "password too long")
    .regex(/^(?=.*[a-z])/, "must contain lowercase letter")
    .regex(/^(?=.*[A-Z])/, "must contain uppercase letter")
    .regex(/^(?=.*\d)/, "must contain number")
    .regex(/^(?=.*[@$!%*?&])/, "must contain special character")
    .nonempty("Confirm password is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Confirm password cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Confirm password cannot contain links (http://, https://, www.)." }
    );

export const zodValidationGender = z.enum(formatGenderLanguages["en"]).default('other')
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Gender cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Gender cannot contain links (http://, https://, www.)." }
    );

export const zodRegistrationPassword = z.object({
    password: zodValidationPassword,
    confirmPassword: zodValidationConfirmPassword, // Reuse the same rules!
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Confirm password must match password",
        path: ["confirmPassword"], // This sets the error on the confirmPassword field specifically
    });

export const zodValidationBirthday = z.string()
    .min(1, "Birthday is required")
    // 1. Check basic format (YYYY/MM/DD)
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, "Invalid format. Use YYYY/MM/DD") // Adjust regex for DD/MM/YYYY if needed
    .refine((val) => {
        const [year, month, day] = val.split("/").map(Number);

        if (!day || !month || !year) {
            return false; // Missing day, month, or year
        }

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return false; // Not a valid number
        }

        // 2. Check if it's a valid calendar date
        // Note: Month is 0-indexed in JS Date (0 = Jan, 11 = Dec)
        const date = new Date(year, month - 1, day);

        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    }, "That date doesn't exist (e.g., Feb 30th)")
    .refine((val) => {
        const [day, month, year] = val.split("/").map(Number);

        if (!day || !month || !year) {
            return false; // Missing day, month, or year
        }

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return false; // Not a valid number
        }

        const birthDate = new Date(year, month - 1, day);
        const now = new Date();

        // 3. Check if date is in the future
        if (birthDate > now) return false;

        // 4. Optional: Check if user is too old (e.g., over 120 years)
        const minDate = new Date();
        minDate.setFullYear(now.getFullYear() - 120);
        return birthDate > minDate;
    }, "Please enter a valid birth year");

export const zodValidationOTPCode = z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers')
    .nonempty('OTP is required')
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "OTP code cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "OTP code cannot contain links (http://, https://, www.)." }
    )

export const zodValidationOTPCodeSignIn = z.string()
    .length(8, 'Code must be exactly 8 digits')
    .regex(/^\d+$/, 'Code must contain only numbers')
    .nonempty('Code is required')
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "OTP code cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "OTP code cannot contain links (http://, https://, www.)." }
    )

export const zodValidationPhoneNumber = z.string()
    .min(8, "Phone number must be at least 8 digits")
    .max(14, "Phone number must be at most 14 digits")
    .regex(/^\+?\d+$/, "Phone number must contain only numbers and optional leading +")
    .nonempty("Phone number is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Phone number cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Phone number cannot contain links (http://, https://, www.)." }
    )

export const zodValidationSearchQuery = z.string()
    .default("")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Search query cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Search query cannot contain links (http://, https://, www.)." }
    );

export const zodValidationStrDate = z.string()
    .default("")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Date string cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Date string cannot contain links (http://, https://, www.)." }
    );
export const zodValidationDate = z.string().date("Invalid date formatter")
    .nonempty("Date is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Date cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Date cannot contain links (http://, https://, www.)." }
    )
export const zodValidationFullName = z.string()
    .nonempty("FullName is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "FullName cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "FullName cannot contain links (http://, https://, www.)." }
    )

export const zodValidationFirstName = z.string()
    .nonempty("FirstName is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "FirstName cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "FirstName cannot contain links (http://, https://, www.)." }
    )
export const zodValidationLastName = z.string()
    .nonempty("LastName is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "LastName cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "LastName cannot contain links (http://, https://, www.)." }
    )
export const zodValidationOrderBy = z.enum(['desc', 'asc']).default("desc");

// file zod
export const zodValidationFile = z.object({
    // fieldname: z.string(),
    // originalname: z.string(),
    // encoding: z.string(),
    // mimetype: z.string(),
    // buffer: z.instanceof(Buffer),
    // size: z.number().max(validateMaxFileSize, "max size is 10MB"),
    fileData: z.string(), // base64 string
    fileName: z.string(),
    fileType: z.string(),
    size: z.number() // in bytes
});
export const zodValidationFiles = z.array(zodValidationFile);

// filter query
export const zodValidationFilter = z.object({
    page: z.number().default(1),
    limit: z.number().max(100).default(20)
});

// zod typeof validate....
export type ZodValidationStr = z.infer<typeof zodValidationStr>;
export type ZodValidationUuid = z.infer<typeof zodValidationUuid>;
export type ZodValidationFullName = z.infer<typeof zodValidationFullName>;

export type ZodValidationEmail = z.infer<typeof zodValidationEmail>;
export type ZodValidationOTPCode = z.infer<typeof zodValidationOTPCode>;
export type ZodValidationPhoneNumber = z.infer<typeof zodValidationPhoneNumber>;

export type ZodValidationPassword = z.infer<typeof zodValidationPassword>;
export type ZodValidationConfirmPassword = z.infer<typeof zodValidationConfirmPassword>;
export type ZodValidationFilter = z.infer<typeof zodValidationFilter>;
export type ZodValidationSearchQuery = z.infer<typeof zodValidationSearchQuery>;
export type ZodValidationStrDate = z.infer<typeof zodValidationStrDate>;
export type ZodValidationDate = z.infer<typeof zodValidationDate>;

export type ZodValidationFile = z.infer<typeof zodValidationFile>;
export type ZodValidationFiles = z.infer<typeof zodValidationFiles>;
