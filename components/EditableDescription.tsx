"use client";

import { useEffect, useRef, useState } from "react";
import { writeClient } from "@/sanity/write-client";

interface EditableDescriptionProps {
  projectId: string;
  description?: string;
  isAdmin: boolean;
  className?: string;
}

type Mode = "display" | "edit";

export function EditableDescription({
  projectId,
  description,
  isAdmin,
  className,
}: EditableDescriptionProps) {
  const [mode, setMode] = useState<Mode>("display");
  const [localValue, setLocalValue] = useState(description ?? "");
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode === "edit") {
      textareaRef.current?.focus();
    }
  }, [mode]);

  function enterEdit() {
    setDraft(localValue);
    setMode("edit");
  }

  function cancelEdit() {
    setMode("display");
    setDraft("");
  }

  async function save() {
    const trimmed = draft.trim();
    setSaving(true);
    try {
      if (trimmed.length === 0) {
        await writeClient.patch(projectId).unset(["description"]).commit();
        setLocalValue("");
      } else {
        await writeClient
          .patch(projectId)
          .set({ description: trimmed })
          .commit();
        setLocalValue(trimmed);
      }
      setMode("display");
      setDraft("");
    } catch {
      alert("Could not save — are you still logged in to sanity.io?");
    } finally {
      setSaving(false);
    }
  }

  const isEmpty = localValue.length === 0;

  if (mode === "edit") {
    return (
      <div className={className} onClick={(e) => e.stopPropagation()}>
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={saving}
          className={`w-full rounded-md border border-border bg-transparent p-2 text-sm text-muted-foreground outline-none${saving ? " opacity-50" : ""}`}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              cancelEdit();
            } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              void save();
            }
          }}
          onBlur={() => {
            if (draft !== localValue) {
              void save();
            } else {
              cancelEdit();
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={`${className ?? ""}${isEmpty ? " italic opacity-60" : ""}`}>
        {isEmpty ? "Description coming soon." : localValue}
      </div>
    );
  }

  // Admin display mode
  return (
    <div
      className={`${className ?? ""}${isEmpty ? " italic opacity-60" : ""} cursor-text`}
      title="Double-click to edit"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        enterEdit();
      }}
    >
      {isEmpty ? "Description coming soon." : localValue}
    </div>
  );
}
