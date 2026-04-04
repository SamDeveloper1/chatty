import {LoaderIcon} from "lucide-react"

export const PageLoader = ()=>{
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <LoaderIcon className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-cyan-400"/>
        </div>
    )
}