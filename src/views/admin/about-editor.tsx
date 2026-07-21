"use client";

import { useActionState, useRef, useState } from "react";
import { Plus, Trash2, TriangleAlert } from "lucide-react";
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
import { WEBP_QUALITY_PHOTO } from "@shared/lib/image-to-webp";
import { useSaveToast } from "@shared/ui/use-save-toast";
import type {
  PageCopy,
  AboutLeadership,
  AboutSection as AboutSectionData,
} from "@entities/page-content";
import { savePageCopy } from "@features/update-page-copy";
import { saveAbout } from "@features/update-about";

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
 *
 * Every field prefills from the stored row, never from the bundled constants:
 * the fields are uncontrolled, so a constant shown here would be submitted as
 * if it were the saved value and overwrite the real one on the next save.
 */
type AboutEditorProps = {
  copy: PageCopy | null;
  leadership: AboutLeadership | null;
  sections: AboutSectionData[] | null;
};

export function AboutEditor({
  copy,
  leadership,
  sections: storedSections,
}: AboutEditorProps) {
  const [copyState, copyAction, copyPending] = useActionState(savePageCopy, {
    ok: true,
  });
  const [aboutState, aboutAction, aboutPending] = useActionState(saveAbout, {
    ok: true,
  });

  // Two independent forms on one screen — each announces its own save, so the
  // operator can tell which half of the page was written.
  useSaveToast(copyState, copyPending, "상단 문구가 저장되었습니다");
  useSaveToast(aboutState, aboutPending);

  // Until the page is saved once the row holds no leadership or sections, so
  // the bundled constants seed the form — the same content the page renders.
  const leader = leadership ?? {
    label: "LEADERSHIP",
    role: LEADERSHIP.role,
    name: LEADERSHIP.nameKo,
    bio: LEADERSHIP.bio,
    points: [...LEADERSHIP.points],
    photo: null,
  };
  const initialSections = storedSections ?? SEED_SECTIONS;

  const [points, setPoints] = useState<string[]>(leader.points);
  // Section label drives the card heading, so editing it renames the section.
  const [leaderLabel, setLeaderLabel] = useState(leader.label);

  const keyRef = useRef(initialSections.length);
  const [sections, setSections] = useState<Section[]>(
    initialSections.map((s, i) => ({ ...s, key: i })),
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
  /** Items are serialized to JSON on submit, so they must live in state. */
  const patchItem = (key: number, idx: number, patch: Partial<Item>) =>
    setSections((s) =>
      s.map((x) =>
        x.key === key
          ? {
              ...x,
              items: x.items.map((it, i) =>
                i === idx ? { ...it, ...patch } : it,
              ),
            }
          : x,
      ),
    );
  const removeItem = (key: number, idx: number) =>
    setSections((s) =>
      s.map((x) =>
        x.key === key
          ? { ...x, items: x.items.filter((_, i) => i !== idx) }
          : x
      )
    );

  return (
    <div className="flex flex-col gap-5">
      {/* Hero copy saves on its own — a separate <form> because forms cannot
          nest, and because the sections below are not persisted yet. */}
      <form action={copyAction} className="flex flex-col gap-5">
        <input type="hidden" name="slug" value="about" />
        <Card
          title="페이지 문구"
          caption="ABOUT 상단에 표시되는 영문 라벨·대제목·소제목입니다."
        >
          <AdminField label="영문 라벨" htmlFor="aboutEyebrow">
            <AdminInput
              id="aboutEyebrow"
              name="eyebrow"
              defaultValue={copy?.eyebrow ?? ABOUT.eyebrow}
              className="max-w-md"
            />
          </AdminField>
          <AdminField label="대제목" htmlFor="aboutTitle" hint="줄바꿈 그대로 반영">
            <AdminTextarea
              id="aboutTitle"
              name="title"
              defaultValue={copy?.title ?? ABOUT.title}
              className="min-h-20"
            />
          </AdminField>
          <AdminField label="소제목" htmlFor="aboutBody" hint="줄바꿈 그대로 반영">
            <AdminTextarea
              id="aboutBody"
              name="description"
              defaultValue={copy?.description ?? ABOUT.body}
            />
          </AdminField>

          {copyState.error && (
            <p className="flex items-start gap-1.5 text-sm text-red-600">
              <TriangleAlert size={15} className="mt-0.5 shrink-0" />
              {copyState.error}
            </p>
          )}

          <div className="flex justify-end">
            <AdminButton type="submit" variant="solid">
              문구 저장
            </AdminButton>
          </div>
        </Card>
      </form>

      <form action={aboutAction} className="flex flex-col gap-5">
        {/* Variable-length tree: serialized to one field rather than inventing
            indexed form names. The action re-validates the shape. */}
        <input
          type="hidden"
          name="sections"
          value={JSON.stringify(
            sections.map(({ label, title, items }) => ({
              label,
              title,
              items,
            })),
          )}
        />
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
            name="leaderPhoto"
            initialUrl={leader.photo}
            requiredSize={UPLOAD_SIZE.portrait}
            output={{ ...UPLOAD_SIZE.portrait, fit: "cover" }}
            outputQuality={WEBP_QUALITY_PHOTO}
            className="w-52"
          />
        </AdminField>

        <AdminField label="역할" htmlFor="leaderRole">
          <AdminInput
            id="leaderRole"
            name="leaderRole"
            defaultValue={leader.role}
            className="max-w-md"
          />
        </AdminField>

        <AdminField label="이름" htmlFor="leaderName">
          <AdminInput
            id="leaderName"
            name="leaderName"
            defaultValue={leader.name}
            className="max-w-xs"
          />
        </AdminField>

        <AdminField label="설명" htmlFor="leaderBio" hint="줄바꿈 그대로 반영">
          <AdminTextarea
            id="leaderBio"
            name="leaderBio"
            defaultValue={leader.bio}
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
                <AdminInput
                  name="leaderPoint"
                  value={point}
                  onChange={(e) =>
                    setPoints((p) =>
                      p.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                  placeholder="추가 정보"
                />
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
            <AdminInput
              value={section.title}
              onChange={(e) =>
                patchSection(section.key, { title: e.target.value })
              }
              placeholder="섹션 제목"
            />
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
                    <AdminInput
                      value={item.title}
                      onChange={(e) =>
                        patchItem(section.key, ii, { title: e.target.value })
                      }
                      placeholder="제목"
                    />
                    <AdminTextarea
                      value={item.description}
                      onChange={(e) =>
                        patchItem(section.key, ii, {
                          description: e.target.value,
                        })
                      }
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

        {aboutState.error && (
          <p className="flex items-start gap-1.5 text-sm text-red-600">
            <TriangleAlert size={15} className="mt-0.5 shrink-0" />
            {aboutState.error}
          </p>
        )}

        <AdminFormActions cancelHref="/admin" />
      </form>
    </div>
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
