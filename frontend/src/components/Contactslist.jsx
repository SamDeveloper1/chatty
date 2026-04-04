import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const Contactslist = () => {
  const { allContacts, isUsersLoading, setSelectedUser, getAllContacts } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  
  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);
  
  if (isUsersLoading) return <UsersLoadingSkeleton />;
  
  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-3 sm:p-4 md:p-5 rounded-lg cursor-pointer hover:bg-cyan-500/20 active:bg-cyan-500/30 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`avatar flex-shrink-0 ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.fullName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate text-sm sm:text-base">
              {contact.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
};

export default Contactslist;
