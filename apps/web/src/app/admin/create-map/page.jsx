// JSX
// filepath: /Users/hussain/Desktop/web dev projects/metaverse-app/metaverse-repo/apps/web/src/app/spaces/[spaceId]/page.jsx
// ...existing code...
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import useWorldSocket from "@/hooks/use-world-socket";
import useMovement from "@/hooks/use-movement";
import PhaserWorld from "@/modules/world/components/PhaserWorld";
import axios from "axios";
import { useRequireAuth } from "@/hooks/use-protected-auth";

/**
 * SpaceView:
 * - Full-screen world rendering with Phaser.
 * - WebSocket connection for presence and chat.
 * - Keyboard movement handling.
 * - Chat drawer overlay (hidden by default, slides over the map on demand).
 * 
 * All previous logic is preserved; only layout/styling and comments are enhanced.
 */
export default function SpaceView() {
  // 1) Protect the route with auth (unchanged)
  useRequireAuth();

  // 2) Read dynamic spaceId from URL
  const params = useParams();
  const spaceId = params?.spaceId;

  // 3) JWT for WS auth, loaded from localStorage
  const [token, setToken] = useState("");
  useEffect(() => {
    const t = localStorage.getItem("jwt");
    console.log("🔐 Loaded token from localStorage:", t);
    if (t) setToken(t);
  }, []);

  // 4) Connect WS to backend (presence, movement, chat). Logic unchanged.
  useWorldSocket(spaceId, token);

  // 5) Enable keyboard movement and emit 'move' events over WS. Logic unchanged.
  useMovement();

  // 6) UI State: chat drawer visibility (hidden initially), chat buffer, input
  const [chatOpen, setChatOpen] = useState(false); // start hidden
  const [chatLog, setChatLog] = useState([]);
  const [input, setInput] = useState("");

  // 7) World data load state
  const [world, setWorld] = useState(null);
  const [loadingWorld, setLoadingWorld] = useState(true);

  // 8) Fetch world (map + elements) via HTTP. Logic preserved.
  useEffect(() => {
    if (!spaceId) return;
    setLoadingWorld(true);

    axios
      .get(`${process.env.NEXT_PUBLIC_HHTP_URL}/api/v1/space/${spaceId}/world`, {
        withCredentials: true,
      })
      .then((res) => {
        setWorld(res.data);
        setLoadingWorld(false);
      })
      .catch((err) => {
        console.error("Failed to load world:", err);
        setLoadingWorld(false);
      });
  }, [spaceId, token]);

  // 9) Chat WS listener (append messages to chatLog). Logic preserved.
  useEffect(() => {
    const ws = typeof window !== "undefined" ? window.__ws : null;
    if (!ws) return;

    const onMessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type === "chat") {
          const { userId, message, ts } = msg.payload || {};
          setChatLog((prev) => [...prev, { userId, message, ts }]);
        }
      } catch {
        // non-chat messages or parse issues are ignored
      }
    };

    ws.addEventListener("message", onMessage);
    return () => ws.removeEventListener("message", onMessage);
  }, [spaceId, token]);

  // 10) Send chat over WS if open and text present. Logic preserved.
  const sendChat = () => {
    const ws = window?.__ws;
    const text = input.trim();
    if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(JSON.stringify({ type: "chat", payload: { message: text } }));
    setInput("");
  };

  // 11) Share button: copy invite URL to clipboard. Logic preserved.
  const [copied, setCopied] = useState(false);
  const inviteUrl =
    typeof window !== "undefined" ? `${window.location.origin}/spaces/${spaceId}` : "";
  const copyInvite = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.warn("Failed to copy invite URL:", e);
    }
  };

  /**
   * Render:
   * - Full-screen container (fixed inset-0) so the map occupies the entire viewport.
   * - Overlay controls and space ID indicators rendered above the map (absolute).
   * - Chat drawer is hidden initially; when opened it overlays on top of the map (absolute, z-40).
   */
  return (
    <div className="fixed inset-0 bg-[#0b0f14] text-white overflow-hidden">
      {/* World fills full screen */}
      <main className="absolute inset-0">
        {/* Controls (top-left) overlay above map */}
        <div className="absolute top-3 left-3 z-30 flex gap-2">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-[#0f141b] hover:text-white transition-colors"
            onClick={() => setChatOpen((o) => !o)}
          >
            {chatOpen ? "Hide Chat" : "Show Chat"}
          </Button>
          <Button
            variant="outline"
            className={cn(
              "border-gray-700 transition-colors",
              copied
                ? "bg-green-600/20 text-green-300 hover:bg-green-600/30"
                : "bg-[#0f141b] text-gray-300 hover:bg-[#121821] hover:text-white"
            )}
            onClick={copyInvite}
            title={inviteUrl}
          >
            <span className="mr-2">🔗</span>
            {copied ? "Copied!" : "Share"}
          </Button>
        </div>

        {/* Space ID overlay (top-right) */}
        <div className="absolute top-3 right-3 z-30">
          <div className="px-3 py-2 rounded-md bg-[#0f141b] border border-gray-800 text-gray-300 text-sm shadow">
            Space ID: <span className="text-cyan-400">{spaceId}</span>
          </div>
        </div>

        {/* Phaser world canvas covers the entire screen */}
        <div className="absolute inset-0">
          {loadingWorld && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <div className="text-gray-400">Loading world...</div>
              </div>
            </div>
          )}

          {/* Render the world when available; preserves prior logic */}
          {!loadingWorld && world && <PhaserWorld map={world} />}

          {/* Error state when world fails to load */}
          {!loadingWorld && !world && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="px-4 py-2 rounded-md bg-[#1a2029] border border-red-600/40 text-red-300">
                Failed to load world
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Chat drawer overlay:
         - Hidden initially (translate-x fully off-screen).
         - Slides in over the map when chatOpen=true.
         - Absolute positioning with full height and a fixed width.
         - z-40 ensures it sits on top of the map canvas and controls. */}
      <aside
        className={cn(
          "absolute top-0 right-0 h-full w-[360px] bg-[#11161c] border-l border-gray-800 transition-transform duration-200 overflow-hidden z-40 shadow-xl",
          chatOpen ? "translate-x-0" : "translate-x-[360px]"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Drawer header */}
          <div className="px-4 py-3 border-b border-gray-800 bg-[#0f141b]/60 backdrop-blur-sm">
            <h2 className="text-lg font-semibold tracking-wide">Chat</h2>
            <p className="text-xs text-gray-500">Talk with others in this space</p>
          </div>

          {/* Chat messages list (scrollable) */}
          <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
            {chatLog.length === 0 && (
              <div className="text-xs text-gray-500">No messages yet. Start the conversation!</div>
            )}
            {chatLog.map((c, i) => (
              <div key={i} className="text-sm px-3 py-2 rounded-md bg-[#0f141b] border border-gray-800/60">
                <span className="text-cyan-400 mr-2 font-mono">{c.userId}</span>
                <span className="text-gray-300 break-words">{c.message}</span>
              </div>
            ))}
          </div>

          {/* Chat input + send button */}
          <div className="p-3 border-t border-gray-800 bg-[#0f141b]/60 backdrop-blur-sm flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-md bg-[#151a21] border border-gray-800 outline-none focus:border-cyan-500 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendChat();
              }}
            />
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold" onClick={sendChat}>
              Send
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
// ...existing code...