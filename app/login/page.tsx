import { Sparkles } from "lucide-react";
import { AuthHeader } from "@/components/AuthHeader";
import { auth, getGitHubCredentials, getGoogleCredentials } from "@/auth";
import { signInWithGitHub, signInWithGoogle } from "./actions";

export default async function LoginPage() {
  const session = await auth();
  const google = getGoogleCredentials();
  const github = getGitHubCredentials();
  const hasGoogle = Boolean(google.clientId && google.clientSecret);
  const hasGitHub = Boolean(github.clientId && github.clientSecret);

  return <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
    <div aria-hidden className="pointer-events-none absolute -left-64 -top-72 size-[42rem] rounded-full bg-violet-700/25 blur-[200px]" />
    <div aria-hidden className="pointer-events-none absolute -right-72 top-40 size-[40rem] rounded-full bg-fuchsia-700/15 blur-[200px]" />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8"><AuthHeader session={session} />
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center py-12 sm:min-h-[calc(100vh-6rem)]">
        <div className="w-full rounded-3xl border border-white/10 bg-[#171717]/90 p-7 shadow-[0_24px_70px_rgba(0,0,0,.42)] sm:p-9">
          <span className="grid size-11 place-items-center rounded-xl bg-violet-500 shadow-[0_0_28px_rgba(139,92,246,.55)]"><Sparkles className="size-5" /></span>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Добро пожаловать</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Войдите, чтобы создавать посты и сохранять доступ к своему аккаунту.</p>
          <div className="mt-8 grid gap-3">
            {hasGoogle && <form action={signInWithGoogle}><button className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"><span className="grid size-5 place-items-center rounded-full bg-[conic-gradient(from_-45deg,#4285f4_0_25%,#34a853_0_50%,#fbbc05_0_75%,#ea4335_0)] text-[0px]">G</span>Войти через Google</button></form>}
            {hasGitHub && <form action={signInWithGitHub}><button className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] text-sm font-semibold text-white transition hover:border-violet-400/50 hover:bg-white/[0.08]">Войти через GitHub</button></form>}
            {!hasGoogle && !hasGitHub && <p className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-center text-sm text-amber-100">Добавьте ключи Google или GitHub в `.env.local`, чтобы включить вход.</p>}
          </div>
          <p className="mt-7 text-center text-xs leading-5 text-zinc-600">Продолжая, вы соглашаетесь с использованием OAuth для безопасного входа.</p>
        </div>
      </section>
    </div>
  </main>;
}