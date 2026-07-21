"use client";

import { useState, useTransition } from "react";
import { Check, Plus, X } from "lucide-react";
import { AdminButton, AdminInput } from "@widgets/admin-shell";
import { showToast } from "@shared/ui/toast";
import { cn } from "@shared/lib/cn";
import type { ContentCategoryRow } from "@entities/content";

type Result = { ok: boolean; error?: string };

type CategoryManagerProps = {
  categories: ContentCategoryRow[];
  /** Bound server actions — the list refreshes via revalidation on success. */
  onAdd: (name: string) => Promise<Result>;
  onRename: (id: number, name: string) => Promise<Result>;
  onRemove: (id: number) => Promise<Result>;
};

/**
 * Inline category manager on the contents list screen. Add, click-to-rename,
 * and remove all persist to content_categories; the server revalidates the page
 * so the list reflects the change. A category in use cannot be removed, and a
 * rename carries through to the contents that used the old name.
 */
export function CategoryManager({
  categories,
  onAdd,
  onRename,
  onRemove,
}: CategoryManagerProps) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [pending, startTransition] = useTransition();

  const add = () => {
    const name = value.trim();
    if (!name) return;
    startTransition(async () => {
      const res = await onAdd(name);
      if (res.ok) {
        setValue("");
        setAdding(false);
        showToast("카테고리를 추가했습니다");
      } else {
        showToast(res.error ?? "추가에 실패했습니다.", "error");
      }
    });
  };

  const startEdit = (c: ContentCategoryRow) => {
    setEditingId(c.id);
    setEditValue(c.name);
  };

  const saveEdit = (id: number, original: string) => {
    const name = editValue.trim();
    if (!name || name === original) {
      setEditingId(null);
      return;
    }
    startTransition(async () => {
      const res = await onRename(id, name);
      if (res.ok) {
        setEditingId(null);
        showToast("카테고리를 수정했습니다");
      } else {
        showToast(res.error ?? "수정에 실패했습니다.", "error");
      }
    });
  };

  const remove = (id: number) => {
    startTransition(async () => {
      const res = await onRemove(id);
      if (res.ok) showToast("카테고리를 삭제했습니다");
      else showToast(res.error ?? "삭제에 실패했습니다.", "error");
    });
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">카테고리</p>
          <p className="mt-0.5 text-xs text-ink/50">
            콘텐츠 필터에 사용됩니다. 이름을 클릭하면 수정, X로 삭제합니다. 사용
            중인 카테고리는 삭제할 수 없습니다.
          </p>
        </div>
        {!adding && (
          <AdminButton
            type="button"
            variant="outline"
            onClick={() => setAdding(true)}
          >
            <Plus size={15} />
            카테고리 추가
          </AdminButton>
        )}
      </div>

      <div
        className={cn(
          "mt-4 flex flex-wrap items-center gap-2",
          pending && "pointer-events-none opacity-60"
        )}
      >
        {categories.map((c) =>
          editingId === c.id ? (
            <span key={c.id} className="inline-flex items-center gap-1.5">
              <AdminInput
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveEdit(c.id, c.name);
                  }
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="h-9 w-40 py-1.5"
                autoFocus
              />
              <AdminButton
                type="button"
                variant="solid"
                onClick={() => saveEdit(c.id, c.name)}
              >
                <Check size={14} />
                저장
              </AdminButton>
              <AdminButton
                type="button"
                variant="ghost"
                onClick={() => setEditingId(null)}
              >
                취소
              </AdminButton>
            </span>
          ) : (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 py-1.5 pl-3.5 pr-2 text-sm text-ink"
            >
              {/* Click the name to rename it in place. */}
              <button
                type="button"
                onClick={() => startEdit(c)}
                className="rounded transition-colors hover:text-brand"
              >
                {c.name}
              </button>
              <button
                type="button"
                aria-label={`${c.name} 삭제`}
                onClick={() => remove(c.id)}
                className="flex h-5 w-5 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-red-500/10 hover:text-red-600"
              >
                <X size={13} />
              </button>
            </span>
          )
        )}

        {adding && (
          <span className="inline-flex items-center gap-1.5">
            <AdminInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
                if (e.key === "Escape") setAdding(false);
              }}
              placeholder="새 카테고리명"
              className="h-9 w-40 py-1.5"
              autoFocus
            />
            <AdminButton type="button" variant="solid" onClick={add}>
              추가
            </AdminButton>
            <AdminButton
              type="button"
              variant="ghost"
              onClick={() => setAdding(false)}
            >
              취소
            </AdminButton>
          </span>
        )}
      </div>
    </div>
  );
}
