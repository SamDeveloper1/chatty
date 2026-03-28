import { useState } from "react";
import { CheckIcon, CheckCheckIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

// The 6 emojis available to react with
// Keep this small — a picker with 6 options is fast and clean
const REACTION_EMOJIS = ["😂", "❤️", "👍", "😮", "😢", "🔥"];

const MessageBubble = ({ msg }) => {
  const { reactToMessage } = useChatStore();
  const { authUser } = useAuthStore();

  const myId = authUser._id?.toString();

  // Is this message sent by me or by the other person?
  const isMine = msg.senderId?.toString() === myId;

  // Controls whether the emoji picker bar is visible
  // We use local state (not store) — it's UI-only, no need to share globally
  const [showPicker, setShowPicker] = useState(false);

  // ─── Reaction helpers ──────────────────────────────────────────────────────

  // Group reactions by emoji so we can show "😂 2" instead of two separate 😂s
  // Returns: [{ emoji: "😂", count: 2, reactedByMe: true }, ...]
  const groupedReactions = () => {
    const reactions = msg.reactions || [];
    const map = {};

    reactions.forEach((r) => {
      if (!map[r.emoji]) {
        map[r.emoji] = { emoji: r.emoji, count: 0, reactedByMe: false };
      }
      map[r.emoji].count += 1;
      // Mark if I personally reacted with this emoji
      if (r.userId?.toString() === myId) {
        map[r.emoji].reactedByMe = true;
      }
    });

    return Object.values(map);
  };

  const handleReact = (emoji) => {
    reactToMessage(msg._id, emoji);
    setShowPicker(false); // close picker after selecting
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    // The outer wrapper is `relative` so the picker can be absolutely positioned
    // `group` is a Tailwind trick — child elements can use `group-hover:` to
    // show/hide based on whether THIS wrapper is hovered
    <div
      className={`chat ${isMine ? "chat-end" : "chat-start"} relative group`}
    >
      {/* ── Emoji picker bar ────────────────────────────────────────────────
          Appears on hover above the message bubble.
          Positioned differently for sent vs received messages so it always
          stays within the chat area and doesn't overflow off-screen.
          - My messages (chat-end): picker aligns to the right
          - Their messages (chat-start): picker aligns to the left        */}
      <div
        className={`
          absolute -top-10 z-10
          ${isMine ? "right-0" : "left-0"}
          hidden group-hover:flex
          items-center gap-1
          bg-slate-700 border border-slate-600
          rounded-full px-2 py-1 shadow-lg
        `}
      >
        {REACTION_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            className="text-lg hover:scale-125 transition-transform duration-100 cursor-pointer"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* ── Message bubble ──────────────────────────────────────────────── */}
      <div
        className={`chat-bubble relative ${
          isMine
            ? "bg-cyan-600 text-white"
            : "bg-slate-800 text-slate-200"
        }`}
      >
        {msg.image && (
          <img
            src={msg.image}
            alt="Shared"
            className="rounded-lg h-48 object-cover"
          />
        )}
        {msg.text && <p className="mt-2">{msg.text}</p>}

        {/* Time + read receipt ticks (Feature 2) */}
        <p className="text-sm mt-1 opacity-75 flex items-center gap-1">
          {new Date(msg.createdAt).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}

          {/* Only show ticks on messages I sent */}
          {isMine && (
            <>
              {msg.isRead ? (
                // ✓✓ cyan — they read it
                <CheckCheckIcon className="w-4 h-4 text-cyan-300 inline-block" />
              ) : (
                // ✓ gray — sent, not yet read
                <CheckIcon className="w-4 h-4 text-slate-300 opacity-60 inline-block" />
              )}
            </>
          )}
        </p>
      </div>

      {/* ── Reaction bubbles ─────────────────────────────────────────────────
          Shown below the bubble if there are any reactions.
          Aligned same side as the bubble (right for mine, left for theirs).
          Each pill shows: emoji + count
          If I reacted with that emoji → pill has a highlighted border        */}
      {groupedReactions().length > 0 && (
        <div
          className={`flex flex-wrap gap-1 mt-1 ${
            isMine ? "justify-end" : "justify-start"
          }`}
        >
          {groupedReactions().map(({ emoji, count, reactedByMe }) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              title={reactedByMe ? "Click to remove" : "Click to react"}
              className={`
                flex items-center gap-1
                text-sm px-2 py-0.5 rounded-full
                border transition-all duration-150
                ${
                  reactedByMe
                    // Highlighted pill — I reacted with this emoji
                    ? "bg-cyan-900/50 border-cyan-500 text-cyan-200"
                    // Normal pill — others reacted but not me
                    : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-400"
                }
              `}
            >
              <span>{emoji}</span>
              {/* Only show count if more than 1 person reacted */}
              {count > 1 && (
                <span className="text-xs font-medium">{count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;