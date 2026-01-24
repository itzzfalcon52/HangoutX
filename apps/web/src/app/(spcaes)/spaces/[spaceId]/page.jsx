// JSX
// filepath: /Users/hussain/Desktop/web dev projects/metaverse-app/metaverse-repo/apps/web/src/app/(spcaes)/spaces/[spaceId]/page.jsx
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

// ✅ SpaceView is the main page for rendering a specific space by spaceId.
//   It preserves all existing logic and adds a user-friendly Leave button that closes the socket and redirects.
export default function SpaceView() {
  // ✅ Require authentication before entering the space (your route guards handle redirects)
  useRequireAuth();

  // ✅ Read the dynamic route parameter /spaces/[spaceId]
  const params = useParams();
  const spaceId = params?.spaceId;

  // ✅ Store JWT from localStorage for WS auth (existing logic preserved)
  const [token, setToken] = useState("");

  useEffect(() => {
    // ✅ Load token from localStorage (used for WS join)
    const t = localStorage.getItem("jwt");
    console.log("🔐 Loaded token from localStorage:", t);
    if (t) setToken(t);
  }, []);

  // ---------- Connect world socket ----------
  // ✅ Connects WebSocket to the backend and joins the space
  //    Keeps previous logic intact, including movement and any toasts inside the hook.
  useWorldSocket(spaceId, token);

  // ---------- Movement hook ----------
  // ✅ Handles keyboard movement and sends 'move' events (existing logic preserved)
  useMovement();

  // ---------- UI State ----------
  // ✅ Chat panel open/close state
  const [chatOpen, setChatOpen] = useState(false);
  // ✅ Local chat log buffer (from WS messages)
  const [chatLog, setChatLog] = useState([]);
  // ✅ Input box for chat
  const [input, setInput] = useState("");
  // ✅ Holds the world (map + elements) data fetched from HTTP API
  const [world, setWorld] = useState(null);
  // ✅ Loading state for world fetch
  const [loadingWorld, setLoadingWorld] = useState(true);

  // ---------- Fetch world (map + elements) ----------
  // ✅ Fetch world data from your HTTP backend using the configured env URL.
  //    Preserves existing logic and credentials handling.
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

  // ---------- Chat WS listener ----------
  // ✅ Listens for 'chat' type messages on the same WS socket and appends them to chatLog
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
        // ✅ Swallow parse errors, WS may carry non-chat messages
      }
    };

    ws.addEventListener("message", onMessage);
    return () => ws.removeEventListener("message", onMessage);
  }, [spaceId, token]);

  // ---------- Send chat ----------
  // ✅ Sends a chat message over the WS socket if open and text is non-empty.
  const sendChat = () => {
    const ws = window?.__ws;
    const text = input.trim();
    if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(JSON.stringify({ type: "chat", payload: { message: text } }));
    setInput("");
  };

  // ---------- Share button ----------
  // ✅ Provides a Share button that copies the direct URL to this space.
  //    Friends can paste the link, sign in, and join the space.
  const [copied, setCopied] = useState(false);

  // ✅ Compute the invite URL for the current space
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/spaces/${spaceId}`
      : "";

  // ✅ Copy the invite URL to clipboard and show a copied state briefly
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

  // ---------- Leave Space ----------
  // ✅ Closes the active WebSocket (if any) and redirects user to "/".
  //    - Attempts to send a lightweight "leave" message before closing (optional).
  //    - Clears the global window.__ws reference to avoid stale sockets.
  //    - Uses location.assign("/") to perform a hard navigation to home.
   // ✅ Gracefully notify server, close socket, clear globals, and redirect to "/"
   const leaveSpace = () => {
    try {
      const ws = typeof window !== "undefined" ? window.__ws : null;

      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        // Inform server we are leaving so it can broadcast "user-left"
        try {
          ws.send(JSON.stringify({ type: "leave" }));
        } catch {}

        // Close the socket normally
        ws.close(1000, "Client leaving space");
      }

      // Prevent further movement locally
      window.__canMove = false;
      // Clear global ref
      window.__ws = null;
    } catch (e) {
      console.warn("leaveSpace: error while closing socket:", e);
    } finally {
      // Hard redirect to home
      window.location.assign("/");
    }
  };

  // ---------- Render ----------
  // ✅ Full-page layout with world canvas and a sliding chat pane.
  //    The UI keeps your logic and adds a Leave Space button in the toolbar.

  return (
    <div className="fixed inset-0 bg-[#0b0f14] text-white overflow-hidden">
      {/* Full-screen world */}
      <main className="absolute inset-0">
        {/* Top-left controls overlay */}
        <div className="absolute top-3 left-3 z-30 flex gap-2">
          {/* ✅ Toggle Chat open/close */}
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-[#0f141b] hover:text-white transition-colors"
            onClick={() => setChatOpen((o) => !o)}
          >
            {chatOpen ? "Hide Chat" : "Show Chat"}
          </Button>

          {/* ✅ Share current space URL */}
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

          {/* ✅ NEW: Leave Space button
              - Closes the WebSocket and redirects to "/"
              - Styled consistently with the toolbar */}
          <Button
            variant="outline"
            className="border-red-600/50 text-red-300 bg-[#0f141b] hover:bg-red-900/20 hover:text-red-200 transition-colors"
            onClick={leaveSpace}
            title="Leave this space"
          >
            <span className="mr-2">🚪</span>
            Leave Space
          </Button>
        </div>

        {/* Top-right space id overlay */}
        <div className="absolute top-3 right-3 z-30">
          <div className="px-3 py-2 rounded-md bg-[#0f141b] border border-gray-800 text-gray-300 text-sm shadow">
            Space ID: <span className="text-cyan-400">{spaceId}</span>
          </div>
        </div>

        {/* Phaser world fills entire screen */}
        <div className="absolute inset-0">
          {loadingWorld && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <div className="text-gray-400">Loading world...</div>
              </div>
            </div>
          )}
          {!loadingWorld && world && <PhaserWorld map={world} />}
          {!loadingWorld && !world && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="px-4 py-2 rounded-md bg-[#1a2029] border border-red-600/40 text-red-300">
                Failed to load world
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Chat overlay drawer (absolute over the map) */}
      <aside
        className={cn(
          "absolute top-0 right-0 h-full w-[360px] bg-[#11161c] border-l border-gray-800 transition-transform duration-200 overflow-hidden z-40 shadow-xl",
          chatOpen ? "translate-x-0" : "translate-x-[360px]"
        )}
      >
        <div className="h-full flex flex-col">
          {/* ✅ Drawer header */}
          <div className="px-4 py-3 border-b border-gray-800 bg-[#0f141b]/60 backdrop-blur-sm">
            <h2 className="text-lg font-semibold tracking-wide">Chat</h2>
            <p className="text-xs text-gray-500">Talk with others in this space</p>
          </div>

          {/* ✅ Messages list */}
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

          {/* ✅ Composer */}
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