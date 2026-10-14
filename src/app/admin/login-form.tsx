"use client";

import { useActionState } from "react";

import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block text-sm" htmlFor="admin-password">
        Нууц үг
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="h-11 w-full rounded-[8px] border border-line bg-white px-3 text-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      />
      {state?.error ? <p className="text-sm font-medium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-[8px] bg-ink text-sm font-medium text-white disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Нэвтэрч байна…" : "Нэвтрэх"}
      </button>
    </form>
  );
}
