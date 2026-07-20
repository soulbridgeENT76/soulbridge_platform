"use client";

import { type FormEvent, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { showToast } from "@shared/ui/toast";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminImageUpload,
  AdminFormActions,
  AdminButton,
} from "@widgets/admin-shell";
import { cn } from "@shared/lib/cn";
import { PORTRAIT_RATIO, UPLOAD_SIZE } from "@shared/config/media";
import {
  ABOUT,
  LEADERSHIP,
  PORTFOLIO,
  STRATEGY_PILLARS,
} from "@entities/about";

type Item = { title: string; description: string };
type Section = { key: number; label: string; title: string; items: Item[] };

// Seed the dynamic sections (02+) from current data.
const SEED_SECTIONS: Omit<Section, "key">[] = [
  {
    label: "PORTFOLIO",
    title: "주요 사업 포트폴리오 다각화",
    items: PORTFOLIO.map((p) => ({
      title: p.title,
      description: p.description,
    })),
  },
  {
    label: "STRATEGY",
    title: "4대 전략 비즈니스 필러",
    items: STRATEGY_PILLARS.map((p) => ({
      title: p.title,
      description: p.description,
    })),
  },
];

/**
 * ABOUT page editor — hero copy, the fixed Leadership section, and a variable
 * number of "label + title + items" sections (add/remove).
 * TODO(backend): persist on save.
 */
export function AboutEditor() {
  const [points, setPoints] = useState<string[]>([...LEADERSHIP.points]);
  // Section label drives the card heading, so editing it renames the section.
  const [leaderLabel, setLeaderLabel] = useState("LEADERSHIP");

  const keyRef = useRef(SEED_SECTIONS.length);
  const [sections, setSections] = useState<Section[]>(
    SEED_SECTIONS.map((s, i) => ({ ...s, key: i }))
  );

  const addSection = () => {
    setSections((s) => [
      ...s,
      { key: keyRef.current++, label: "", title: "", items: [] },
    ]);
  };
  const removeSection = (key: number) =>
    setSections((s) => s.filter((x) => x.key !== key));
  /** Patch a section field (e.g. label) so the card heading follows it. */
  const patchSection = (key: number, patch: Partial<Section>) =>
    setSections((s) => s.map((x) => (x.key === key ? { ...x, ...patch } : x)));
  const addItem = (key: number) =>
    setSections((s) =>
      s.map((x) =>
        x.key === key
          ? { ...x, items: [...x.items, { title: "", description: "" }] }
          : x
      )
    );
  const removeItem = (key: number, idx: number) =>
    setSections((s) =>
      s.map((x) =>
        x.key === key
          ? { ...x, items: x.items.filter((_, i) => i !== idx) }
          : x
      )
    );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(backend): collect all values and save the About page.
    showToast("저장되었습니다");
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Hero copy */}
      <Card title="페이지 문구" caption="ABOUT 상단에 표시되는 대제목·소제목입니다.">
        <AdminField label="대제목" htmlFor="aboutTitle" hint="줄바꿈 그대로 반영">
          <AdminTextarea
            id="aboutTitle"
            name="aboutTitle"
            defaultValue={ABOUT.title}
            className="min-h-20"
          />
        </AdminField>
        <AdminField label="소제목" htmlFor="aboutBody" hint="줄바꿈 그대로 반영">
          <AdminTextarea
            id="aboutBody"
            name="aboutBody"
            defaultValue={ABOUT.body}
          />
        </AdminField>
      </Card>

      {/* 01 — Leadership (fixed) */}
      <Card index="01" title={leaderLabel || "새 섹션"}>
        <AdminField label="섹션 라벨" htmlFor="leaderLabel">
          <AdminInput
            id="leaderLabel"
            name="leaderLabel"
            value={leaderLabel}
            onChange={(e) => setLeaderLabel(e.target.value)}
            className="max-w-xs"
          />
        </AdminField>

        <AdminField
          label="프로필 이미지"
          hint="세로형 3:4"
        >
          <AdminImageUpload
            ratio={PORTRAIT_RATIO}
            requiredSize={UPLOAD_SIZE.portrait}
            className="w-52"
          />
        </AdminField>

        <AdminField label="역할" htmlFor="leaderRole">
          <AdminInput
            id="leaderRole"
            name="leaderRole"
            defaultValue={LEADERSHIP.role}
            className="max-w-md"
          />
        </AdminField>

        <AdminField label="이름" htmlFor="leaderName">
          <AdminInput
            id="leaderName"
            name="leaderName"
            defaultValue={LEADERSHIP.nameKo}
            className="max-w-xs"
          />
        </AdminField>

        <AdminField label="설명" htmlFor="leaderBio" hint="줄바꿈 그대로 반영">
          <AdminTextarea
            id="leaderBio"
            name="leaderBio"
            defaultValue={LEADERSHIP.bio}
          />
        </AdminField>

        {/* 추가 정보 (points) */}
        <div className="rounded-xl border border-ink/10 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">추가 정보</span>
            <AdminButton
              type="button"
              variant="outline"
              onClick={() => setPoints((p) => [...p, ""])}
            >
              <Plus size={15} />항목 추가
            </AdminButton>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {points.map((point, i) => (
              <Row
                key={i}
                onRemove={() =>
                  setPoints((p) => p.filter((_, j) => j !== i))
                }
              >
                <AdminInput defaultValue={point} placeholder="추가 정보" />
              </Row>
            ))}
          </div>
        </div>
      </Card>

      {/* 02+ — variable sections */}
      {sections.map((section, si) => (
        <Card
          key={section.key}
          index={String(si + 2).padStart(2, "0")}
          title={section.label || "새 섹션"}
          onRemove={() => removeSection(section.key)}
        >
          <AdminField label="섹션 라벨" hint="예: PORTFOLIO, STRATEGY">
            <AdminInput
              value={section.label}
              onChange={(e) =>
                patchSection(section.key, { label: e.target.value })
              }
              placeholder="영문 라벨"
              className="max-w-xs"
            />
          </AdminField>
          <AdminField label="제목">
            <AdminInput defaultValue={section.title} placeholder="섹션 제목" />
          </AdminField>

          <div className="rounded-xl border border-ink/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">데이터 항목</span>
              <AdminButton
                type="button"
                variant="outline"
                onClick={() => addItem(section.key)}
              >
                <Plus size={15} />항목 추가
              </AdminButton>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {section.items.map((item, ii) => (
                <div
                  key={ii}
                  className="flex flex-col gap-2 rounded-lg bg-ink/[0.02] p-3 sm:flex-row"
                >
                  <div className="flex flex-1 flex-col gap-2">
                    <AdminInput defaultValue={item.title} placeholder="제목" />
                    <AdminTextarea
                      defaultValue={item.description}
                      placeholder="설명"
                      className="min-h-20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(section.key, ii)}
                    aria-label="항목 삭제"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-red-500/5 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}

      {/* Add section */}
      <button
        type="button"
        onClick={addSection}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/25 py-5 text-sm font-semibold text-ink/55 transition-colors hover:border-brand/50 hover:text-brand"
      >
        <Plus size={17} />섹션 추가
      </button>

      <AdminFormActions cancelHref="/admin" />
    </form>
  );
}

function Card({
  index,
  title,
  caption,
  onRemove,
  children,
}: {
  index?: string;
  title: string;
  caption?: string;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {index && (
            <span className="font-display text-xl font-black leading-none text-brand">
              {index}
            </span>
          )}
          <div>
            <p className="text-sm font-semibold text-ink">{title}</p>
            {caption && <p className="mt-0.5 text-xs text-ink/50">{caption}</p>}
          </div>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink/45",
              "transition-colors hover:bg-red-500/5 hover:text-red-600"
            )}
          >
            <Trash2 size={14} />섹션 삭제
          </button>
        )}
      </div>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

function Row({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">{children}</div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="삭제"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-red-500/5 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
