import { type NextPage } from "next";

const Container = ({children, classNames = ""} : 
    {
        children: React.ReactNode;
        classNames?: string;
    }) => {
    
    return (
        <div className={`max-w-xl m-auto ${classNames} bg-slate-200`}>{children}</div>
    )
}

export default Container