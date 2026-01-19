let game;

/**
 * Creates the Phaser game ONLY on the client.
 * Call this from a "use client" component inside useEffect().
 */
export async function createGame({ mapKey = "map1", tileSize = 32, onPlacementsChanged } = {}) {
  if (typeof window === "undefined") return null;
  if (game) return game;

  const container = document.getElementById("game-container");
  if (!container) throw new Error("Missing #game-container");

  const Phaser = await import("phaser");
  const { EditorScene } = await import("../components/LoadMap");

  const getSize = () => ({
    width: Math.max(1, container.clientWidth),
    height: Math.max(1, container.clientHeight),
  });

  const { width, height } = getSize();

  game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game-container",
    width,
    height,
    backgroundColor: "#0b0f14",
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.NO_CENTER,
    },
    physics: {
      default: "arcade",
      arcade: { debug: false },
    },
    scene: [EditorScene],
  });

  game.scene.start("EditorScene", { mapKey, tileSize, onPlacementsChanged });

  // Force canvas to fill the container (prevents "small canvas with empty space")
  const canvas = container.querySelector("canvas");
  if (canvas) {
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
  }

  const resize = () => {
    if (!game) return;
    const s = getSize();
    game.scale.resize(s.width, s.height);
  };

  // Window resize
  window.addEventListener("resize", resize);

  // Container resize (flexbox/sidebar/layout changes)
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // Ensure correct size after layout settles
  requestAnimationFrame(resize);

  game.__cleanup = () => {
    window.removeEventListener("resize", resize);
    ro.disconnect();
  };

  return game;
}

export function destroyGame() {
  if (!game) return;
  game.__cleanup?.();
  game.destroy(true);
  game = undefined;
}