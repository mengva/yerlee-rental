import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "./cors.js";

// 1. Generate Components (Yog koj xav siv UI ntawm UploadThing)
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// 2. The Functional Hook (Qhov no yog qhov tseem ceeb rau koj li Logic)
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();