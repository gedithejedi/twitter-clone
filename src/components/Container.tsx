import { type NextPage } from "next";
import React from "react";

const Container: NextPage = ({children, classNames = ""} : 
    {
        children: React.ReactNode;
        classNames?: string;
    }) => {
    
    return (
        <div className={`max-w-xl m-auto ${classNames} bg-slate-200`}>{children}</div>
    )
}

export default Container