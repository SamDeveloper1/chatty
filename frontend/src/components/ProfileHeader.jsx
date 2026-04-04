import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  LogOutIcon,
  Volume2Icon,
  VolumeOffIcon,
  LoaderIcon,
} from "lucide-react";
const mouseClickSound = new Audio("/sounds/mouse-click.mp3");
const ProfileHeader = () => {
  const { logout, authUser, updateProfile, isUpdatingProfileImage } =
    useAuthStore();
  const { toggleSound, isSoundEnabled } = useChatStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };
  return (
    <div className="p-3 sm:p-4 md:p-6 border-b border-slate-700/50 flex-shrink-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* AVATAR */}
          <div className="avatar online flex-shrink-0">
            <button
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              {isUpdatingProfileImage ? (
                <LoaderIcon className="w-full h-5 animate-spin text-center" />
              ) : (
                <img
                  src={selectedImage || authUser.profilePic || "/avatar.png"}
                  alt="User image"
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          {/* USERNAME AND ONLINE TEXT */}
          <div className="min-w-0">
            <h3 className="text-slate-200 font-medium text-sm sm:text-base max-w-[120px] sm:max-w-[150px] md:max-w-[180px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>
        {/* BUTTONS */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 items-center flex-shrink-0">
          {/* LOGOUT BUTTON */}
          <button
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {/* SOUND TOGGLE BTN */}
          <button
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <VolumeOffIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
