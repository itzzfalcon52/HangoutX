// JavaScript
// filepath: /Users/hussain/Desktop/web dev projects/metaverse-app/metaverse-repo/apps/web/src/modules/world/phaser/WorldScene.jsx
// ...existing code...
"use client";

/**
 * WorldScene:
 * - Renders layered map images using metadata from /{mapKey}/data.json
 * - Loads an IntGrid CSV for collision (walls), aligned by a dedicated collision tile size
 * - Spawns/animates player sprites using getters provided at scene start
 * - Fits the camera to the map and draws debug collision cells for visibility
 *
 * Key points in this update:
 * - We keep your previous logic intact.
 * - We explicitly separate visual tile size (32px) and collision tile size (16px).
 * - We parse the IntGrid preserving column alignment (empty cells become 0).
 * - We draw debug walls using collisionTileSize so they align with the IntGrid.
 */
import * as Phaser from "phaser";

export class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: "WorldScene" });

    // Default map key (overridden by init(data))
    this.mapKey = "map1";

    // Track currently visible player sprites
    this.playerSprites = new Map();

    // Visual tile size used by your art and conceptual grid (unchanged logic default)
    this.tileSize = 32;

    // Collision grid resolution (IntGrid); you stated it's 16px
    // We will use this for reading the CSV grid, checking walls, and drawing debug cells
    this.collisionTileSize = 16;
  }

  /**
   * init:
   * - Receives external callbacks and mapKey
   * - No logic changes; we store references for update() loop
   */
  init(data) {
    this.mapKey = data.mapKey;
    this.getPlayers = data.getPlayers;
    this.getSelfId = data.getSelfId;
  }

  /**
   * preload:
   * - Load the base map JSON (width/height/x/y/layers array)
   * - Load the collision IntGrid CSV
   * - After map JSON loads, enqueue layer images referenced by file names
   */
  preload() {
    // Load base map metadata (width/height/x/y/layers)
    this.load.json("mapData", `/${this.mapKey}/data.json`);

    // Load collision IntGrid CSV (tile occupancy; 0=empty, 1=wall)
    this.load.text("collision", `/${this.mapKey}/IntGrid.csv`);

    // After JSON loads, enqueue each layer image by filename
    this.load.once("filecomplete-json-mapData", () => {
      const map = this.cache.json.get("mapData");
      if (!map) return;

      console.log("🗺️ Loading map layers:", map.layers);

      (map.layers || []).forEach((file) => {
        this.load.image(`layer:${file}`, `/${this.mapKey}/${file}`);
      });
    });
  }

  /**
   * create:
   * - Reads cached map JSON and IntGrid CSV
   * - Sets map offsets (x,y) from JSON
   * - Parses CSV preserving empty cells to keep alignment
   * - Validates IntGrid size against collisionTileSize
   * - Draws layer images and configures camera bounds/zoom
   * - Renders debug collision cells using collisionTileSize for perfect alignment
   */
  create() {
    // Expose scene in window for console debug
    window.__phaserScene = this;

    // Read map JSON from cache (already loaded in preload)
    const map = this.cache.json.get("mapData");
    if (!map) {
      console.error("❌ mapData missing");
      return;
    }

    // Assign map metadata for later use
    this.mapData = map;

    // Map offset in world coordinates (top-left anchor for all layers)
    this.mapOffsetX = this.mapData.x ?? 0;
    this.mapOffsetY = this.mapData.y ?? 0;

    // Parse collision CSV:
    // - Keep empty strings as 0 so the number of columns stays consistent.
    // - This prevents misalignment when some cells are blank.
    const raw = this.cache.text.get("collision") ?? "";
    const rows = raw.trim().split("\n");
    this.collisionGrid = rows.map((row) => {
      const cols = row.split(",");
      return cols.map((v) => {
        const t = v.trim();
        if (t === "") return 0; // preserve alignment: blank cells become 0
        const n = Number(t);
        return Number.isFinite(n) ? n : 0; // non-numeric -> 0
      });
    });

    // Debug: grid dimensions
    console.log("Grid size:", this.collisionGrid.length, this.collisionGrid[0].length);
    console.log("🧱 Collision grid loaded", this.collisionGrid);

    // Sanity check: compare IntGrid size with map pixel size using collisionTileSize
    // Expected columns/rows come from dividing the map size by 16px (your IntGrid cell size)
    const expectedCols = Math.floor(map.width / this.collisionTileSize);
    const expectedRows = Math.floor(map.height / this.collisionTileSize);
    const gotCols = this.collisionGrid[0]?.length ?? 0;
    const gotRows = this.collisionGrid.length;
    if (gotRows !== expectedRows || gotCols !== expectedCols) {
      console.warn(
        "IntGrid size mismatch",
        { expectedRows, expectedCols, collisionTileSize: this.collisionTileSize },
        { gotRows, gotCols }
      );
    }

    // Cache offsets for simpler expressions below
    const offsetX = this.mapOffsetX;
    const offsetY = this.mapOffsetY;

    console.log("🗺️ Map offset:", offsetX, offsetY);

    // Draw layered images at the map origin (top-left) with depth ordering
    (map.layers || []).forEach((file) => {
      const key = `layer:${file}`;
      this.add.image(offsetX, offsetY, key).setOrigin(0, 0).setDepth(0);
    });

    // Configure camera bounds to the entire map size
    this.cameras.main.setBounds(offsetX, offsetY, map.width, map.height);

    // Compute zoom to fit the current view while respecting small padding
    const viewW = this.scale.width;
    const viewH = this.scale.height;
    const padding = 8;
    const zoomX = (viewW - padding) / map.width;
    const zoomY = (viewH - padding) / map.height;
    this.cameras.main.setZoom(Math.min(zoomX, zoomY));

    // Center the camera on the map's midpoint
    this.cameras.main.centerOn(offsetX + map.width / 2, offsetY + map.height / 2);

    console.log("✅ Map rendered", map.width, map.height);

    // Debug collision visualization:
    // - Draw semi-transparent red squares for cells with value 1
    // - Use collisionTileSize so the overlay matches IntGrid resolution (16px cells)
    for (let ty = 0; ty < this.collisionGrid.length; ty++) {
      const row = this.collisionGrid[ty];
      for (let tx = 0; tx < row.length; tx++) {
        if (row[tx] === 1) {
          this.add
            .rectangle(
              offsetX + tx * this.collisionTileSize + this.collisionTileSize / 2,
              offsetY + ty * this.collisionTileSize + this.collisionTileSize / 2,
              this.collisionTileSize,
              this.collisionTileSize,
              0xff0000,
              0.4
            )
            .setDepth(999);
        }
      }
    }

    console.log("🟥 Debug walls drawn");
  }

  /**
   * update:
   * - Gets the latest players from external store via provided getters
   * - Creates sprites on first sight, then interpolates movement smoothly
   * - Flips sprite based on movement direction; switches between walk and idle
   * - All behavioral logic is preserved
   */
  update() {
    // Pull live player data each tick
    const playersRaw = this.getPlayers();
    const selfId = this.getSelfId();
    if (!playersRaw || !selfId) return;

    // Normalize players collection (Map or object)
    const players = playersRaw instanceof Map ? [...playersRaw.values()] : Object.values(playersRaw);

    // Create player sprites when they appear for the first time
    for (const p of players) {
      if (!this.playerSprites.has(p.id)) {
        const worldX = p.x + this.mapOffsetX;
        const worldY = p.y + this.mapOffsetY;

        // Ensure textures/animation frames are loaded
        this.ensureAvatarLoaded(p.avatarKey);

        // Skip drawing until idle texture is available
        if (!this.textures.exists(`${p.avatarKey}:idle`)) continue;

        // Create the sprite at the initial world position
        const sprite = this.add.sprite(worldX, worldY, `${p.avatarKey}:idle`);
        sprite.setDepth(10);
        sprite.setOrigin(0.5, 0.5);
        sprite.setScale(0.3);

        // Logical movement target (used by interpolation)
        sprite.targetX = worldX;
        sprite.targetY = worldY;

        // Track it by player id
        this.playerSprites.set(p.id, sprite);

        console.log("PLAYER", p.x, p.y, "WORLD", worldX, worldY);
      }
    }

    // Update positions/animations each frame
    for (const p of players) {
      const sprite = this.playerSprites.get(p.id);
      if (!sprite) continue;

      // Compute world coordinate by adding map offset
      const worldX = p.x + this.mapOffsetX;
      const worldY = p.y + this.mapOffsetY;

      // Update the target so interpolation moves toward latest position
      sprite.targetX = worldX;
      sprite.targetY = worldY;

      // Smooth interpolation toward the target
      const speed = 0.25;
      const prevX = sprite.x;
      const prevY = sprite.y;

      sprite.x = Phaser.Math.Linear(sprite.x, sprite.targetX, speed);
      sprite.y = Phaser.Math.Linear(sprite.y, sprite.targetY, speed);

      // Velocity magnitude (used to decide walking vs idle)
      const vx = sprite.x - prevX;
      const vy = sprite.y - prevY;
      const vel = Math.hypot(vx, vy);

      // Dead-zone for arriving at target
      const arrived =
        Math.abs(sprite.targetX - sprite.x) < 0.8 && Math.abs(sprite.targetY - sprite.y) < 0.8;

      // Flip horizontally based on desired direction (less jitter than velocity-based)
      const dirX = sprite.targetX - sprite.x;
      if (dirX < -0.5) sprite.setFlipX(true);
      else if (dirX > 0.5) sprite.setFlipX(false);

      // Animation control: walk when moving, idle when arrived
      if (!arrived && vel > 0.2) {
        if (!sprite.anims.currentAnim || sprite.anims.currentAnim.key !== `walk:${p.avatarKey}`) {
          sprite.play(`walk:${p.avatarKey}`, true);
        }
      } else {
        if (sprite.anims.isPlaying) {
          sprite.stop();
          sprite.setTexture(`${p.avatarKey}:idle`);
        }
      }
    }

    // Camera follow self: left as-is (if needed, add follow logic here)
  }

  /**
   * isWallTile:
   * - Returns true when the requested tile index is outside the grid or the cell value equals 1
   * - Uses IntGrid index space (tx, ty), not pixel coordinates
   * - Logic unchanged; now implicitly aligned to collisionTileSize since the grid was parsed in that resolution
   */
  isWallTile(tileX, tileY) {
    if (
      tileY < 0 ||
      tileY >= this.collisionGrid.length ||
      tileX < 0 ||
      tileX >= this.collisionGrid[0].length
    ) {
      return true;
    }
    return this.collisionGrid[tileY][tileX] === 1;
  }

  /**
   * ensureAvatarLoaded:
   * - Lazy-load textures for avatar idle and walk frames when first needed
   * - Creates walk animation after load completes
   */
  ensureAvatarLoaded(avatarKey) {
    const base = `/avatars/${avatarKey}`;

    // Avoid reloading if already present
    if (this.textures.exists(`${avatarKey}:idle`)) return;

    // Idle frame
    this.load.image(`${avatarKey}:idle`, `${base}/idle.png`);

    // Walk frames (0..7)
    for (let i = 0; i < 8; i++) {
      this.load.image(`${avatarKey}:walk${i}`, `${base}/walk${i}.png`);
    }

    // After all assets for this avatar load, define the animation
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.createWalkAnimation(avatarKey);
    });

    // Start the queued asset load
    this.load.start();
  }

  /**
   * createWalkAnimation:
   * - Registers the looping walk animation with 8 frames at 12 fps
   * - Skips if it already exists for this avatarKey
   */
  createWalkAnimation(avatarKey) {
    if (this.anims.exists(`walk:${avatarKey}`)) return;

    const frames = [];
    for (let i = 0; i < 8; i++) {
      frames.push({ key: `${avatarKey}:walk${i}` });
    }

    this.anims.create({
      key: `walk:${avatarKey}`,
      frames,
      frameRate: 12,
      repeat: -1,
    });

    console.log("🎞️ Animation created:", `walk:${avatarKey}`);
  }
}
// ...existing code...