"use client";

// text editor for edition chapter desc
import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.snow.css";

interface EditorProps{
    onChange: (value: string) => void;
    value: string;
};

export const Editor = ({
    onChange,
    value
}: EditorProps) => {
    // we import react-quill like this although it is client comp but first it also render on server side
    // which cause conflict between server and client side comp due to their diffrence to avoid hydration error
    // we import this way
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false}), []);

    return(
        // snow means editor theme 
        <div className="bg-white">
            <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}/>
        </div>
    )
};