import * as Phaser from "phaser";

export class EditorScene extends Phaser.Scene {
  constructor() {
    super({ key: "EditorScene" });
    this.mapKey = "map1"; // folder under /publicmap1
    this.tileSize = 32; // change to your grid size
    this.placements = [];
    this.ghost = null;
    this.dragged = null; // { elementId, imageUrl, width, height }
    this.onPlacementsChanged = null; // callback injected from React
  }

  init(data) {
    this.mapKey = data?.mapKey ?? this.mapKey;
    this.tileSize = data?.tileSize ?? this.tileSize;
    this.onPlacementsChanged = data?.onPlacementsChanged ?? null;
  }

  preload() {
    this.load.json("mapData", `/${this.mapKey}/data.json`);
  }

  create() {
    const map = this.cache.json.get("mapData");
    if (!map) throw new Error("mapData not found");

    this.mapData = map;

    // Dynamically load layer PNGs then draw them.
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.drawLayers();
      this.drawGrid();
      this.setupDnD();
      this.setupPlacementControls();
    });

    (map.layers || []).forEach((file) => {
      this.load.image(`layer:${file}`, `/${this.mapKey}/${file}`);
    });

    this.load.start();
  }

  drawLayers() {
    const offsetX = this.mapData.x ?? 0;
    const offsetY = this.mapData.y ?? 0;

    (this.mapData.layers || []).forEach((file) => {
      const key = `layer:${file}`;
      this.add.image(offsetX, offsetY, key).setOrigin(0, 0);
    });

    // Define world bounds for camera
    this.cameras.main.setBounds(offsetX, offsetY, this.mapData.width, this.mapData.height);
    this.physics.world.setBounds(offsetX, offsetY, this.mapData.width, this.mapData.height);

    // Nice camera controls (optional)
    this.cameras.main.centerOn(offsetX + this.mapData.width / 2, offsetY + this.mapData.height / 2);
  }

  drawGrid() {
    const offsetX = this.mapData.x ?? 0;
    const offsetY = this.mapData.y ?? 0;

    const g = this.add.graphics();
    g.lineStyle(1, 0x00ffff, 0.08);

    const cols = Math.floor(this.mapData.width / this.tileSize);
    const rows = Math.floor(this.mapData.height / this.tileSize);

    for (let c = 0; c <= cols; c++) {
      const x = offsetX + c * this.tileSize;
      g.lineBetween(x, offsetY, x, offsetY + rows * this.tileSize);
    }
    for (let r = 0; r <= rows; r++) {
      const y = offsetY + r * this.tileSize;
      g.lineBetween(offsetX, y, offsetX + cols * this.tileSize, y);
    }
  }

  setupDnD() {
    // Receive drag info from React via window event
    window.addEventListener("editor:dragstart", (e) => {
      this.dragged = e.detail; // { elementId, imageUrl, width, height }
      this.ensureElementTextureLoaded(this.dragged);
      this.createOrUpdateGhost();
    });

    window.addEventListener("editor:dragend", () => {
      this.dragged = null;
      if (this.ghost) this.ghost.setVisible(false);
    });

    this.input.on("pointermove", (pointer) => {
      if (!this.dragged || !this.ghost) return;

      const snapped = this.snapToGrid(pointer.worldX, pointer.worldY);
      this.ghost.setPosition(snapped.x, snapped.y).setVisible(true);

      const ok = this.isInsideMap(snapped.x, snapped.y, this.dragged.width, this.dragged.height);
      this.ghost.setAlpha(ok ? 0.55 : 0.2);
      this.ghost.setTint(ok ? 0x00ffff : 0xff4444);
    });
  }

  setupPlacementControls() {
    this.input.on("pointerdown", (pointer) => {
      if (!this.dragged) return;

      const snapped = this.snapToGrid(pointer.worldX, pointer.worldY);
      if (!this.isInsideMap(snapped.x, snapped.y, this.dragged.width, this.dragged.height)) return;

      // Place a finalized sprite
      const texKey = this.textureKeyFor(this.dragged);
      const sprite = this.add.image(snapped.x, snapped.y, texKey).setOrigin(0, 0);

      // Store placement
      const placement = {
        elementId: this.dragged.elementId,
        x: snapped.x,
        y: snapped.y,
        width: this.dragged.width,
        height: this.dragged.height,
      };
      this.placements.push(placement);

      // Allow remove via right click
      sprite.setInteractive({ useHandCursor: true });
      sprite.on("pointerdown", (p) => {
        if (p.rightButtonDown()) {
          sprite.destroy();
          this.placements = this.placements.filter(
            (pl) => !(pl.elementId === placement.elementId && pl.x === placement.x && pl.y === placement.y)
          );
          this.emitPlacements();
        }
      });

      this.emitPlacements();
    });

    // enable right click
    this.input.mouse?.disableContextMenu();
  }

  emitPlacements() {
    if (typeof this.onPlacementsChanged === "function") {
      this.onPlacementsChanged([...this.placements]);
    }
  }

  snapToGrid(worldX, worldY) {
    const offsetX = this.mapData.x ?? 0;
    const offsetY = this.mapData.y ?? 0;

    const x = Math.floor((worldX - offsetX) / this.tileSize) * this.tileSize + offsetX;
    const y = Math.floor((worldY - offsetY) / this.tileSize) * this.tileSize + offsetY;

    return { x, y };
  }

  isInsideMap(x, y, w, h) {
    const offsetX = this.mapData.x ?? 0;
    const offsetY = this.mapData.y ?? 0;
    return (
      x >= offsetX &&
      y >= offsetY &&
      x + w <= offsetX + this.mapData.width &&
      y + h <= offsetY + this.mapData.height
    );
  }

  textureKeyFor(d) {
    return `element:${d.elementId}`;
  }

  ensureElementTextureLoaded(d) {
    const key = this.textureKeyFor(d);
    if (this.textures.exists(key)) return;

    // imageUrl in DB is like "/elements/tree.png" (served from /public)
    this.load.image(key, d.imageUrl);
    this.load.once(Phaser.Loader.Events.COMPLETE, () => this.createOrUpdateGhost());
    this.load.start();
  }

  createOrUpdateGhost() {
    if (!this.dragged) return;
    const key = this.textureKeyFor(this.dragged);
    if (!this.textures.exists(key)) return;

    if (!this.ghost) {
      this.ghost = this.add.image(0, 0, key).setOrigin(0, 0).setAlpha(0.55).setVisible(false);
      this.ghost.setDepth(10_000);
    } else {
      this.ghost.setTexture(key).setVisible(false);
    }
  }
}