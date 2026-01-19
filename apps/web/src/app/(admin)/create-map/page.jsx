"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "@/modules/home/components/Navbar";
import { createGame, destroyGame } from "@/modules/mapEditor/game-Logic/CreateGame";
import { useElements, useImportElements } from "@/hooks/use-elements";

export default function AdminMapEditorPage() {
  const [placements, setPlacements] = useState([]);
  const [saving, setSaving] = useState(false);

  const importMutation = useImportElements();
  const { data: elements = [], isLoading, isError } = useElements();

  const mapId = "REPLACE_WITH_MAP_ID";
  const mapKey = "map1";
  const tileSize = 32;

  useEffect(() => {
    createGame({ mapKey, tileSize, onPlacementsChanged: setPlacements });
    return () => destroyGame();
  }, []);

  useEffect(() => {
    if (isError) toast.error("Failed to load elements");
  }, [isError]);

  const importFromPublic = () => {
    importMutation.mutate(
      { folder: "/elements", static: true },
      {
        onSuccess: (data) => {
          toast.success(`Imported ${data?.count ?? 0} elements`);
        },
        onError: (e) => {
          toast.error(e?.response?.data?.message || "Import failed");
        },
      }
    );
  };

  // ✅ FAKE DRAG START
  const dragStart = (el) => {
    window.dispatchEvent(
      new CustomEvent("editor:dragstart", {
        detail: {
          elementId: el.id,
          imageUrl: el.imageUrl,
          width: el.width,
          height: el.height,
        },
      })
    );
  };

  // ✅ FAKE DRAG END
  const dragEnd = () => {
    window.dispatchEvent(new CustomEvent("editor:dragend"));
  };

  const save = async () => {
    if (!placements.length) return toast.error("Nothing to save");
    setSaving(true);
    try {
      await axios.post(
        `http://localhost:3000/api/v1/admin/maps/${mapId}/elements`,
        { placements },
        { withCredentials: true }
      );
      toast.success("Saved placements");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
        <aside className="w-[360px] bg-[#151a21] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Elements <span className="text-cyan-400">Palette</span>
            </h2>

            <button
              onClick={importFromPublic}
              disabled={importMutation.isPending}
              className={`text-xs px-3 py-2 rounded-md border transition ${
                importMutation.isPending
                  ? "border-gray-700 text-gray-400 cursor-not-allowed"
                  : "border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
              }`}
            >
              {importMutation.isPending ? "Importing..." : "Import"}
            </button>
          </div>

          {isLoading ? (
            <div className="text-sm text-gray-400">Loading elements...</div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {elements.map((el) => (
                <div
                  key={el.id}
                  onMouseDown={() => dragStart(el)}   // ✅ instead of draggable
                  onMouseUp={dragEnd}
                  className="bg-[#0b0f14] border border-gray-800 hover:border-cyan-500/60 rounded-lg p-2 cursor-grab active:cursor-grabbing transition"
                >
                  <img
                    src={el.imageUrl}
                    alt=""
                    className="w-full h-14 object-contain"
                    draggable={false}   // ✅ important
                  />
                  <div className="mt-2 text-[10px] text-gray-400 truncate">
                    {el.width}×{el.height}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={save}
            disabled={saving}
            className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${
              saving ? "bg-gray-700 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          >
            {saving ? "Saving..." : `Confirm & Save (${placements.length})`}
          </button>
        </aside>

        <main className="flex-1 bg-[#151a21] border border-gray-800 rounded-xl overflow-hidden flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <div className="font-semibold">
              Map Editor: <span className="text-cyan-400">{mapKey}</span>
            </div>
            <div className="text-xs text-gray-400">Grid {tileSize}px</div>
          </div>

          <div className="p-3 flex-1 min-h-0">
            <div
              id="game-container"
              className="w-full h-full rounded-lg border border-gray-800 overflow-hidden"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
