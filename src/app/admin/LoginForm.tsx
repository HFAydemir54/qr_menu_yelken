"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "./actions";

const initial: ActionState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form
      action={action}
      className="mx-auto mt-24 w-full max-w-sm rounded-2xl bg-brand-paper p-6 shadow-sm ring-1 ring-black/5"
    >
      <h1 className="font-display text-2xl font-bold text-brand-dark">
        Yönetim Paneli
      </h1>
      <p className="mt-1 text-sm text-brand-muted">
        Menüyü yönetmek için şifrenizi girin.
      </p>

      <input
        type="password"
        name="password"
        autoFocus
        autoComplete="current-password"
        placeholder="Şifre"
        className="mt-5 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand-gold"
      />

      {state.error && (
        <p className="mt-3 text-sm font-medium text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full cursor-pointer rounded-xl bg-brand-dark px-4 py-3 font-semibold text-brand-gold-soft disabled:opacity-60"
      >
        {pending ? "Kontrol ediliyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
