"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { GripVertical } from "lucide-react";
import { AdminLinkButton, DeleteButton } from "@widgets/admin-shell";
import { PlaceholderImage } from "@shared/ui";
import { showToast } from "@shared/ui/toast";
import { PORTRAIT_RATIO } from "@shared/config/media";
import { cn } from "@shared/lib/cn";
import type { Artist } from "@entities/artist";
import { removeArtist, reorderArtists } from "@features/update-artist";

const idsOf = (list: Artist[]) => list.map((a) => a.id).join(",");

/**
 * Admin artist list with drag-to-reorder.
 *
 * Native HTML5 drag rather than a library: the list is short and the only
 * gesture is a vertical row move, so a dependency would not earn its weight.
 * Drag is grip-activated — the row is only draggable while the handle is held,
 * so the edit and delete controls stay clickable.
 */
export function ArtistTable({ artists }: { artists: Artist[] }) {
  const [items, setItems] = useState(artists);
  const [pending, startTransition] = useTransition();
  // The row currently allowed to drag (set on handle mousedown). Without this
  // the whole row is a drag source and text/buttons cannot be used normally.
  const [handleId, setHandleId] = useState<string | null>(null);
  const draggingId = useRef<string | null>(null);

  // Re-sync when the server order changes (after a successful save revalidates,
  // or another tab reorders). Keyed on the id sequence so it only resets on a
  // real change, not on every render's new array identity.
  const serverKey = idsOf(artists);
  useEffect(() => {
    setItems(artists);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverKey]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    draggingId.current = id;
    // Firefox starts a drag only once some data is set.
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    const dragId = draggingId.current;
    if (!dragId || dragId === overId) return;
    setItems((prev) => {
      const from = prev.findIndex((a) => a.id === dragId);
      const to = prev.findIndex((a) => a.id === overId);
      if (from === -1 || to === -1 || from === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleDragEnd = () => {
    draggingId.current = null;
    setHandleId(null);

    // Only write if the drag actually changed the order.
    if (idsOf(items) === serverKey) return;

    const nextIds = items.map((a) => a.id);
    startTransition(async () => {
      const result = await reorderArtists(nextIds);
      if (result.ok) {
        showToast("순서를 변경했습니다", "edit");
      } else {
        showToast(result.error ?? "순서 변경에 실패했습니다.", "error");
        setItems(artists); // revert to the server order
      }
    });
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <table className="w-full text-center text-sm">
        <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/45">
          <tr>
            <th className="py-3.5 pl-4 pr-2 font-semibold">순서</th>
            {/* Left-aligned so the thumbnails form a clean column — centred,
                they stagger with each name's length. The left pad clears the
                handle + thumbnail so the header sits above the name text. */}
            <th className="py-3.5 pl-2 pr-5 text-left font-semibold">이름</th>
            <th className="px-5 py-3.5 font-semibold">역할</th>
            <th className="px-5 py-3.5 font-semibold">관리</th>
          </tr>
        </thead>
        <tbody
          className={cn(
            "divide-y divide-ink/[0.06]",
            pending && "pointer-events-none opacity-60"
          )}
        >
          {items.map((artist) => (
            <tr
              key={artist.id}
              draggable={handleId === artist.id}
              onDragStart={(e) => handleDragStart(e, artist.id)}
              onDragOver={(e) => handleDragOver(e, artist.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                "hover:bg-ink/[0.015]",
                draggingId.current === artist.id && "opacity-40"
              )}
            >
              <td className="py-4 pl-4 pr-2 align-middle">
                {/* Grip handle: arms the row for dragging only while held. */}
                <button
                  type="button"
                  aria-label="드래그하여 순서 변경"
                  onMouseDown={() => setHandleId(artist.id)}
                  onMouseUp={() => setHandleId(null)}
                  className="flex cursor-grab items-center justify-center text-ink/30 transition-colors hover:text-ink/60 active:cursor-grabbing"
                >
                  <GripVertical size={16} />
                </button>
              </td>
              <td className="px-2 py-4 text-left font-medium text-ink">
                <div className="flex items-center gap-4">
                  {/* Small enough that the optimizer serves a thumbnail rather
                      than the full portrait. Not draggable itself, so the drag
                      always comes from the handle. */}
                  {artist.photo ? (
                    <Image
                      src={artist.photo}
                      alt=""
                      width={36}
                      height={48}
                      draggable={false}
                      className="h-12 w-9 shrink-0 rounded object-cover"
                    />
                  ) : (
                    // The same placeholder the public grid and detail page
                    // render, so a photoless artist looks here as it does on
                    // the site.
                    <PlaceholderImage
                      ratio={PORTRAIT_RATIO}
                      size="sm"
                      className="w-9 shrink-0 rounded"
                    />
                  )}
                  <span>
                    {artist.nameKo}
                    <span className="ml-2 text-xs text-ink/40">
                      {artist.nameEn}
                    </span>
                  </span>
                </div>
              </td>
              <td className="px-5 py-4 text-ink/60">{artist.role}</td>
              <td className="px-5 py-4">
                <div className="flex justify-center gap-1">
                  <AdminLinkButton
                    href={`/admin/artists/${artist.slug}`}
                    variant="ghost"
                  >
                    편집
                  </AdminLinkButton>
                  <DeleteButton
                    itemName={artist.nameKo}
                    action={removeArtist.bind(null, artist.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
