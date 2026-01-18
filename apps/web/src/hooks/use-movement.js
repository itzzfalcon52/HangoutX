import { useEffect, useState } from "react";
import { sendMoveRequest } from "@/lib/sockets";

const useMovement = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // User's current position
  const [animationFrame, setAnimationFrame] = useState(0); // Current animation frame (0-7)
  const [isMoving, setIsMoving] = useState(false); // Whether the user is currently moving

  // Handle keydown events for movement
  useEffect(() => {
    const handleKeyDown = (event) => {
      let newX = position.x;
      let newY = position.y;

      switch (event.key) {
        case "ArrowUp":
          newY -= 1;
          break;
        case "ArrowDown":
          newY += 1;
          break;
        case "ArrowLeft":
          newX -= 1;
          break;
        case "ArrowRight":
          newX += 1;
          break;
        default:
          return; // Ignore other keys
      }

      // Update position and send move request
      setPosition({ x: newX, y: newY });
      sendMoveRequest(newX, newY);

      // Start walking animation
      setIsMoving(true);
    };

    const handleKeyUp = () => {
      // Stop walking animation when the key is released
      setIsMoving(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [position]);

  // Handle animation frame updates
  useEffect(() => {
    if (!isMoving) {
      setAnimationFrame(0); // Reset to idle frame when not moving
      return;
    }

    const interval = setInterval(() => {
      setAnimationFrame((prevFrame) => (prevFrame + 1) % 8); // Cycle through frames 0-7
    }, 100); // Update frame every 100ms

    return () => clearInterval(interval);
  }, [isMoving]);

  return { position, animationFrame, isMoving };
};

export default useMovement;