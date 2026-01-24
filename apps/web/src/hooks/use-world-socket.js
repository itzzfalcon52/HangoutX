// JavaScript
// filepath: /Users/hussain/Desktop/web dev projects/metaverse-app/metaverse-repo/apps/web/src/hooks/use-world-socket.js
// ...existing code...
import { connectSocket, sendJoinRequest } from "@/lib/sockets";
import { useEffect } from "react";
import { useCreateWorldStore } from "@/stores/useWorldStore";
import { toast } from "sonner";

export default function useWorldSocket(spaceID, token) {
  const addPlayer = useCreateWorldStore((s) => s.addPlayer);
  const removePlayer = useCreateWorldStore((s) => s.removePlayer);
  const movePlayer = useCreateWorldStore((s) => s.movePlayer);
  const setSelfId = useCreateWorldStore((s) => s.setSelfId);

  useEffect(() => {
    console.log("🧪 WS INIT", { spaceID, token });
    if (!spaceID || !token) return;

    // ✅ Open socket and store global reference
    const socket = connectSocket();
    window.__ws = socket;

    // ✅ On open, send join request with spaceID + token
    const handleOpen = () => {
      console.log("✅ WS OPEN → sending JOIN");
      sendJoinRequest(spaceID, token);
    };

    // ✅ Handle all server messages
    const handleMessage = (event) => {
      console.log("📩 WS MESSAGE RAW:", event.data);
      const message = JSON.parse(event.data);
      console.log("📩 WS MESSAGE PARSED:", message);

      switch (message.type) {
        case "space-joined": {
          const self = message.payload.self;
          setSelfId(self.id);
          addPlayer(self);
          message.payload.users.forEach(addPlayer);
          window.__canMove = true;
          toast.success("Joined space");
          break;
        }

        case "join-rejected": {
          const reason = message.payload?.reason;
          toast.error(
            reason === "already-in-space"
              ? "You are already in this space from another session."
              : "Join rejected."
          );
          try { socket.close(); } catch {}
          window.__canMove = false;
          break;
        }

        case "user-joined": {
          addPlayer(message.payload);
          toast.message("User joined the space", {
            description: `User ${message.payload.userId || message.payload.id} appeared.`,
          });
          break;
        }

        case "movement": {
          movePlayer(message.payload.id, message.payload.x, message.payload.y);
          break;
        }

        case "user-left": {
          // ✅ Notify locally that someone left, then remove their avatar (disables it visually)
          const leftId = message.payload?.userId || message.payload?.id;
          toast.message("User left the space", {
            description: `User ${leftId} has left. Avatar disabled.`,
          });
          removePlayer(message.payload.id);
          break;
        }
      }
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);

    // ✅ Cleanup on unmount: remove listeners and close socket gracefully
    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      try {
        // Inform server we are leaving (optional)
        socket.send(JSON.stringify({ type: "leave" }));
      } catch {}
      try { socket.close(); } catch {}
      window.__ws = null;
      window.__canMove = false;
    };
  }, [spaceID, token]);
}