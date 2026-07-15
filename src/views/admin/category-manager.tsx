"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { AdminButton, AdminInput } from "@widgets/admin-shell";

type CategoryManagerProps = {
  initial: readonly string[];
};

/**
 * Inline category manager shown on the contents list screen.
 * TODO(backend): persist add/remove to the category store.
 */
export function CategoryManager({ initial }: CategoryManagerProps) {
  const [categories, setCategories] = useState<string[]>([...initial]);
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");

  const add = () => {
    const name = value.trim();
    if (!name || categories.includes(name)) return;
    setCategories((c) => [...c, name]);
    setValue("");
    setAdding(false);
  };

  const remove = (name: string) => {
    setCategories((c) => c.filter((x) => x !== name));
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">카테고리</p>
          <p className="mt-0.5 text-xs text-ink/50">
            콘텐츠 필터에 사용되는 카테고리를 관리합니다.
          </p>
        </div>
        {!adding && (
          <AdminButton type="button" variant="outline" onClick={() => setAdding(true)}>
            <Plus size={15} />
            카테고리 추가
          </AdminButton>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 py-1.5 pl-3.5 pr-2 text-sm text-ink"
          >
            {c}
            <button
              type="button"
              aria-label={`${c} 삭제`}
              onClick={() => remove(c)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-red-500/10 hover:text-red-600"
            >
              <X size={13} />
            </button>
          </span>
        ))}

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
