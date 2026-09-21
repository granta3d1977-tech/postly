import { ArrowRight, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { AuthHeader } from "@/components/AuthHeader";
import PostGenerator from "@/components/PostGenerator";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <div aria-hidden className="pointer-events-none absolute -left-64 -top-72 size-[42rem] rounded-full bg-violet-700/25 blur-[200px]" />
      <div aria-hidden className="pointer-events-none absolute -right-72 top-40 size-[40rem] rounded-full bg-fuchsia-700/15 blur-[200px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8"><AuthHeader session={session} /><PostGenerator /></div>
    </main>;
  }

  return <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
    <div aria-hidden className="pointer-events-none absolute -left-64 -top-72 size-[42rem] rounded-full bg-violet-700/25 blur-[200px]" />
    <div aria-hidden className="pointer-events-none absolute -right-72 top-40 size-[40rem] rounded-full bg-fuchsia-700/15 blur-[200px]" />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8"><AuthHeader session={null} />
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col items-center justify-center py-20 text-center sm:min-h-[calc(100vh-6rem)]">
        <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-200"><Sparkles className="size-4" />Ваш личный AI-копирайтер</span>
        <h1 className="text-5xl font-semibold tracking-[-0.055em] sm:text-7xl lg:text-[72px] lg:leading-[1.02]">3 вирусных поста<br /><span className="bg-gradient-to-r from-violet-300 via-violet-400 to-fuchsia-300 bg-clip-text text-transparent">за 5 секунд</span></h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">AI, который пишет как SMMщик с пятью годами опыта. Войдите, чтобы начать создавать посты.</p>
        <a href="/login" className="mt-10 inline-flex h-12 items-center gap-2 rounded-xl bg-violet-500 px-6 text-sm font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,.42)] transition hover:bg-violet-400">Войти и попробовать <ArrowRight className="size-4" /></a>
        <p className="mt-5 text-xs text-zinc-600">Google или GitHub · Без пароля</p>
      </section>
    </div>
  </main>;
}
