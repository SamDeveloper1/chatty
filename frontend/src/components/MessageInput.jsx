import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";


export const MessageInput = () => {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const { sendMessage, isSoundEnabled, sendTyping, sendStopTyping } = useChatStore();

  

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleTextChange = (e) => {
    setText(e.target.value);

    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendTyping();

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      sendStopTyping();
    }, 1500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    sendStopTyping();

    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-2 sm:p-3 md:p-4 border-t border-slate-700/50 flex-shrink-0">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-2 sm:mb-3 flex items-center px-1">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex gap-2 sm:gap-3 md:gap-4"
      >
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          className="flex-1 min-w-0 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-3 sm:px-4 text-sm sm:text-base text-slate-200 placeholder-slate-400"
          placeholder="Type a message..."
        />

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex-shrink-0 bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg p-2 sm:px-3 md:px-4 transition-colors ${
            imagePreview ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg p-2 sm:px-3 md:px-4 sm:py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};