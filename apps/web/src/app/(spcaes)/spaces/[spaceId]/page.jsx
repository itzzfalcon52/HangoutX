// JSX
// filepath: /Users/hussain/Desktop/web dev projects/metaverse-app/metaverse-repo/apps/web/src/app/(spcaes)/spaces/[spaceId]/page.jsx
// ...existing code...
  //  Compute the invite URL for the current space
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/spaces/${spaceId}`
      : "";

  //  Copy the invite URL to clipboard and show a copied state briefly
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

  //  Leave Space handler
  // - Closes the active WebSocket if present (window.__ws)
  // - Removes message listener(s) implicitly by closing the socket
  // - Clears global reference to avoid reusing a closed socket
  // - Redirects the user to the homepage "/"
  const leaveSpace = () => {
    try {
      const ws = typeof window !== "undefined" ? window.__ws : null;
      // ✅ If a socket exists and is open or connecting, close it gracefully
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        // Inform server (optional): send a “leave” message before closing
        try {
          ws.send(JSON.stringify({ type: "leave" }));
        } catch {}
        // Close the socket
        ws.close(1000, "Client left space");
      }
      // ✅ Remove global ref so hooks won’t reuse it accidentally
      if (typeof window !== "undefined") {
        window.__ws = null;
      }
    } catch (e) {
      console.warn("LeaveSpace: error while closing socket:", e);
    } finally {
      // ✅ Navigate to home; existing guards will handle auth/redirects if needed
      window.location.assign("/");
    }
  };

  // ---------- Render ----------
  //  Full-page layout with world canvas and a sliding chat pane.
  //    The UI is improved for clarity while preserving your logic.

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
              - Closes socket and redirects to "/"
              - Non-destructive styling to match toolbar */}
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
          <div className="px-4 py-3 border-b border-gray-800 bg-[#0f141b]/60 backdrop-blur-sm">
            <h2 className="text-lg font-semibold tracking-wide">Chat</h2>
            <p className="text-xs text-gray-500">Talk with others in this space</p>
          </div>
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
