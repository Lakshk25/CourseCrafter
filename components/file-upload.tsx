"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({
    onChange,
    endpoint
}: FileUploadProps) => {
    return (
        // drag and drop or choose file
        <UploadDropzone 
        endpoint={endpoint}
        // contains image information (res)
        onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
            toast.error(`${error?.message}`)
        }}/>
    )
}