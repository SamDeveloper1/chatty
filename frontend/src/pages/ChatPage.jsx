import React from 'react'
import BorderAnimatedContainer from "../components/BorderAnimatedContainer"
import { useChatStore } from '../store/useChatStore'
import ProfileHeader from '../components/ProfileHeader';
import ActivetabSwitch from '../components/ActivetabSwitch';
import ChatsList from '../components/ChatsList';
import Contactslist from '../components/Contactslist';
import ChatContainer from '../components/ChatContainer';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder';

const ChatPage = () => {
  const {activeTab, selectedUser} = useChatStore();
  
  return (
    <div className="relative w-full max-w-6xl h-[100dvh] sm:h-[90vh] md:h-[85vh] lg:h-[800px]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE - Sidebar */}
        <div className={`
          ${selectedUser ? 'hidden md:flex' : 'flex'} 
          w-full md:w-72 lg:w-80 
          bg-slate-800/50 backdrop-blur-sm flex-col
          min-h-0
        `}>
          <ProfileHeader/>
          <ActivetabSwitch/>
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 space-y-2">
            {activeTab==="chats" ? <ChatsList/> : <Contactslist/>}
          </div>
        </div>
        
        {/* RIGHT SIDE - Chat Area */}
        <div className={`
          ${selectedUser ? 'flex' : 'hidden md:flex'} 
          flex-1 flex-col bg-slate-900/50 backdrop-blur-sm
          min-h-0
        `}>
          {selectedUser ? <ChatContainer/> : <NoConversationPlaceholder/>}
        </div>
      </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage