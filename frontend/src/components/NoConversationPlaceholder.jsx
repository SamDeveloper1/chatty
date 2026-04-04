import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6">
      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
        <MessageCircleIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-cyan-400" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-2">Select a conversation</h3>
      <p className="text-slate-400 text-sm sm:text-base max-w-xs sm:max-w-sm md:max-w-md px-2">
        Choose a contact from the sidebar to start chatting or continue a previous conversation.
      </p>
    </div>
  );
};

export default NoConversationPlaceholder;