import {LoaderIcon} from "lucide-react"
export const PageLoader = ()=>{
    return (
        <div className="flex justify-center items-center h-screen">
            <LoaderIcon className="h-10 animate-spin"/>
        </div>
    )
}