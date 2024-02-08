"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
    value: string;
};

export const Preview = ({
    value
}: PreviewProps) => {
    // we import react-quill like this although it is client comp but first it also render on server side
    // which cause conflict between server and client side comp due to their diffrence to avoid hydration error
    // we import this way
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

    return (
        <ReactQuill
            theme="bubble"
            value={value} 
            readOnly/>
    )
};