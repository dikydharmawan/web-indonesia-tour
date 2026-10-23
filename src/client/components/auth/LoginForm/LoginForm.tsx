"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
} from "lucide-react";
import { useFormStatus } from "react-dom";
import { login } from "@/server/actions";
import { useI18n } from "@/client/i18n";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { dict } = useI18n();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {dict.login.processing}
        </>
      ) : (
        <>
          {dict.login.submit}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </>
      )}
    </button>
  );
}

export default function LoginForm({
  next,
  error,
}: {
  next: string;
  error?: string;
}) {
  const { dict } = useI18n();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={login} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          {dict.login.email}
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
          <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@admin.com"
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          {dict.login.password}
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
          <Lock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="text-slate-400 transition hover:text-ink-700"
            aria-label={showPassword ? dict.login.hidePassword : dict.login.showPassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <SubmitButton />

      <p className="text-center text-xs leading-relaxed text-slate-500">
        {dict.login.note}
      </p>
    </form>
  );
}
