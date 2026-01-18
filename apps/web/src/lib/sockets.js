let socket = null; // Declare a global socket variable

export function connectSocket(token) {
  // Create a new WebSocket connection
  socket = new WebSocket("ws://localhost:3001");

  // Handle WebSocket connection open
  socket.onopen = () => {
    console.log("WS connected");
  };

  // Handle WebSocket disconnection
  socket.onclose = () => {
    console.log("WS disconnected");
    socket = null; // Reset the socket variable
  };

  // Handle WebSocket errors
  socket.onerror = (err) => {
    console.error("WS error", err);
  };

  return socket;
}

export function getSocket() {
  // Ensure the socket is connected before returning it
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    throw new Error("Socket not connected");
  }
  return socket;
}

// Helper function to send a message to the WebSocket server
export function sendMessage(type, payload) {
  try {
    const ws = getSocket(); // Ensure the socket is connected
    ws.send(
      JSON.stringify({
        type,
        payload,
      })
    );
  } catch (error) {
    console.error(`Failed to send message of type "${type}":`, error.message);
  }
}

// Function to send a "join" request
export function sendJoinRequest(spaceId, token) {
  sendMessage("join", { spaceId, token });
}

// Function to send a "move" request
export function sendMoveRequest(x, y) {
  sendMessage("move", { x, y });
}

// Function to send a "leave" request
export function sendLeaveRequest() {
  sendMessage("leave", {});
}