import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
const handleAuth = () => {
    const { userId } = auth();
    if(!userId) throw new Error("Unauthorized");
    return { userId };
};
 
// FileRouter for your app, can contain multiple FileRoutes
// diffrent upload items for diffrent use cases with their accepted file types
export const ourFileRouter = {
  // only contains images
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1}})
  //this runs first to authenticate use
    .middleware(() => handleAuth())
    //runs after upload complete
    .onUploadComplete(() => {}),
    courseAttachment: f(["text", "image", "video", "audio", "pdf"]) //add different attachments
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
    chapterVideo: f({ video: {maxFileCount: 1, maxFileSize: "512GB"}})
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;