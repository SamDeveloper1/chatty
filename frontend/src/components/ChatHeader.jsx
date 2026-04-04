import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore"
import { XIcon, ArrowLeftIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
    const {selectedUser, setSelectedUser} = useChatStore();
    const {onlineUsers} = useAuthStore();
    const isOnline = onlineUsers.includes(selectedUser._id)
    
    useEffect(()=>{
        const handleEscKey = (event)=>{
            if(event.key === "Escape") setSelectedUser(null)
        }
        window.addEventListener("keydown",handleEscKey)
      return ()=>window.removeEventListener("keydown",handleEscKey)
    },[setSelectedUser])

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 py-3 sm:py-4 px-3 sm:px-4 md:px-6 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Back button - visible only on mobile */}
            <button 
              onClick={()=>setSelectedUser(null)}
              className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-slate-200 transition-colors"
            >
                <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            <div className={`avatar flex-shrink-0 ${isOnline ? "online" : "offline"}`}>
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full">
                    <img 
                      src={selectedUser.profilePic || "/avatar.png"} 
                      alt={selectedUser.fullName}
                      className="w-full h-full object-cover rounded-full" 
                    />
                </div>
            </div>
            <div className="min-w-0">
                <h3 className="text-slate-200 font-medium text-sm sm:text-base truncate">
                  {selectedUser.fullName}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm">{isOnline ? "Online" : "Offline"}</p>
            </div>
        </div>
        {/* Close button - hidden on mobile (use back button instead) */}
        <button 
          onClick={()=>setSelectedUser(null)}
          className="hidden md:block p-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
            <XIcon className="w-5 h-5 cursor-pointer"/>
        </button>
    </div>
  )
}

export default ChatHeader