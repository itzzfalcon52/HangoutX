import { connectSocket } from "@/lib/sockets";
import { useEffect } from "react";
import { useWorldStore } from "@/stores/useWorldStore";
import { toast } from "react-toastify";

export default function useWorldSocket(spaceID, token) {
  // Zustand store actions
  const addPlayer = useWorldStore((state) => state.addPlayer);
  const removePlayer = useWorldStore((state) => state.removePlayer);
  const movePlayer = useWorldStore((state) => state.movePlayer);
  const setSelfId = useWorldStore((state) => state.setSelfId);

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = connectSocket(token);

    // Send a "join" message when the connection is established
    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send(
        JSON.stringify({
          type: "join",
          payload: {
            spaceId: spaceID,
            token,
          },
        })
      );
    };

    // Handle incoming messages
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "space-joined": {
          // Set the current user's ID
          setSelfId(message.payload.spawn);

          // Add all existing users in the room
          message.payload.users.forEach((user) => addPlayer(user));

          // Show a toast notification for joining the space
          toast.success("You have joined the space!");
          break;
        }

        case "user-joined": {
          // Add the new player to the world
          addPlayer(message.payload);

          // Show a toast notification for the new user
          toast.success(`${message.payload.userId} has joined the space!`);
          break;
        }

        case "movement": {
          // Update the player's position
          movePlayer(message.payload.userId, message.payload.x, message.payload.y);
          break;
        }

        case "movement-rejected": {
          // Show a toast notification for invalid movement
          toast.error("Invalid movement!");
          break;
        }

        case "user-left": {
          // Remove the player from the world
          removePlayer(message.payload.userId);

          // Show a toast notification for the user leaving
          toast.info(`${message.payload.userId} has left the space.`);
          break;
        }

        default:
          console.warn("Unknown message type:", message.type);
      }
    };

    // Handle WebSocket errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("WebSocket connection error. Please try again.");
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, [spaceID, token, addPlayer, removePlayer, movePlayer, setSelfId]);
}