import { validateMaxFileSizeStr } from "@/admin/packages/utils";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Logic: Check user before allow to upload (Optional)
const auth = (req: Request) => ({ id: "fake-user-1" });

export const ourFileRouter = {
    // Tsim profile rau Upload duab Bill nyiaj lossis duab Court
    imageUploader: f({ image: { maxFileSize: validateMaxFileSizeStr, maxFileCount: 10 } })
        .middleware(async ({ req }) => {
            const user = await auth(req);
            if (!user) throw new Error("Unauthorized");
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("File URL:", file.url);
            file.key
            return {
                uploadedBy: metadata.userId,
                key: file.key,
                url: file.url,
                size: file.size,
                type: file.type,
            };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;