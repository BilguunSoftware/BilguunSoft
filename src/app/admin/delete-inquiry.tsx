"use client";

import { useState, useTransition } from "react";

import { deleteInquiry } from "@/app/admin/actions";

export function DeleteInquiryButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function remove() {
    setError("");
    startTransition(async () => {
      const result = await deleteInquiry(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setConfirming(false);
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex h-9 items-center rounded-[8px] border border-line px-3 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
      >
        Устгах
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <p className="text-sm">Устгах уу?</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setConfirming(false);
            setError("");
          }}
          disabled={pending}
          className="inline-flex h-9 items-center rounded-[8px] px-3 text-sm text-muted hover:text-ink"
        >
          Болих
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="inline-flex h-9 items-center rounded-[8px] bg-ink px-3 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Устгаж байна…" : "Тийм"}
        </button>
      </div>
      {error ? <p className="text-sm font-medium">{error}</p> : null}
    </div>
  );
}
