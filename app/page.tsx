"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowUp, Check, Clipboard, Loader2, LockKeyhole, Send, Sparkles, Zap } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

const styles = ["Вирусный", "Продающий", "Экспертный"] as const;
const postTypes = [
  { label: "🔥 Вирусный", color: "bg-orange-50 text-orange-700 ring-orange-100" },
  { label: "💰 Продающий", color: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
  { label: "🧠 Экспертный", color: "bg-violet-50 text-violet-700 ring-violet-100" },
];
const examples = ["как продать курс по дизайну", "5 ошибок в бизнесе", "пост про утреннюю рутину"];
const previewPosts = [
  "Люди не покупают курс по дизайну, когда видят очередное «научись с нуля». Они покупают момент, в котором наконец могут назвать себя дизайнером.\n\nПокажите не уроки, а путь: от первого неловкого макета до портфолио, за которое не стыдно. Именно это меняет решение.\n\n#дизайн #онлайнкурс",
  "Пять ошибок в бизнесе редко выглядят как ошибки в моменте. Кажется, что можно подождать с цифрами, нанять «потом» и сделать ещё одну скидку.\n\nНо именно такие мелочи съедают рост. Сохраните пост, чтобы свериться со своим списком.\n\n#бизнес #предпринимательство",
  "Утренняя рутина — это не список идеальных привычек из Pinterest. Это 20 минут до того, как мир потребует от вас ответов.\n\nСтакан воды, тишина, план на день. Маленький ритуал, который возвращает себе управление.\n\n#продуктивность #рутина",
];
type Style = (typeof styles)[number];
type Generation = { id: string; topic: string; style: Style; posts: string[]; createdAt: string };
const HISTORY_KEY = "postly-history";

function TypedPost({ text, animate }: { text: string; animate: boolean }) {
  const [visibleLength, setVisibleLength] = useState(animate ? 0 : text.length);

  useEffect(() => {
    if (!animate) { setVisibleLength(text.length); return; }
    setVisibleLength(0);
    const timer = window.setInterval(() => {
      setVisibleLength((current) => {
        if (current >= text.length) { window.clearInterval(timer); return text.length; }
        return Math.min(current + 3, text.length);
      });
    }, 14);
    return () => window.clearInterval(timer);
  }, [animate, text]);

  const isTyping = visibleLength < text.length;
  return <p className="mt-5 whitespace-pre-wrap text-[15px] leading-6 text-zinc-700">{text.slice(0, visibleLength)}{isTyping && <span aria-hidden className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-violet-500 align-[-2px]" />}</p>;
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<Style>("Вирусный");
  const [posts, setPosts] = useState<string[]>([]);
  const [history, setHistory] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    try { const saved = localStorage.getItem(HISTORY_KEY); if (saved) setHistory(JSON.parse(saved)); }
    catch { localStorage.removeItem(HISTORY_KEY); }
  }, []);

  function saveHistory(item: Generation) {
    const next = [item, ...history].slice(0, 10);
    setHistory(next); localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  }

  async function generate(event: FormEvent) {
    event.preventDefault();
    if (topic.trim().length < 3) { setError("Опишите тему хотя бы тремя символами."); return; }
    setLoading(true); setError(""); setPosts([]);
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, style }) });
      const data = await response.json() as { posts?: string[]; error?: string };
      if (!response.ok || !data.posts) throw new Error(data.error || "Ошибка генерации");
      setPosts(data.posts);
      saveHistory({ id: crypto.randomUUID(), topic: topic.trim(), style, posts: data.posts, createdAt: new Date().toISOString() });
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) { setError(err instanceof Error ? err.message : "Что-то пошло не так."); }
    finally { setLoading(false); }
  }

  async function copy(text: string, index: number) {
    await navigator.clipboard.writeText(text); setCopied(index);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <div aria-hidden className="pointer-events-none absolute -left-64 -top-72 size-[42rem] rounded-full bg-violet-700/25 blur-[200px]" />
      <div aria-hidden className="pointer-events-none absolute -right-72 top-40 size-[40rem] rounded-full bg-fuchsia-700/15 blur-[200px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <header className="flex h-20 items-center justify-between border-b border-white/[0.07] sm:h-24">
          <a href="#top" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-lg bg-violet-500 shadow-[0_0_24px_rgba(139,92,246,.65)]"><Sparkles className="size-4" /></span>PostlyAI</a>
          <div className="flex items-center gap-3"><Badge className="hidden border border-violet-400/20 bg-violet-500/10 text-violet-200 sm:inline-flex">⚡ Powered by Groq</Badge><Button variant="ghost" size="sm" className="border border-white/10 px-4 text-white"><LockKeyhole className="size-3.5" />Войти</Button></div>
        </header>

        <section id="top" className="mx-auto flex min-h-[660px] max-w-5xl flex-col items-center justify-center py-20 text-center sm:py-28">
          <Badge className="mb-7 border border-violet-400/20 bg-violet-500/10 text-violet-200"><Sparkles className="mr-1.5 size-3.5" />Ваш личный AI-копирайтер</Badge>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-white sm:text-7xl lg:text-[72px] lg:leading-[1.02]">3 вирусных поста<br /><span className="bg-gradient-to-r from-violet-300 via-violet-400 to-fuchsia-300 bg-clip-text text-transparent">за 5 секунд</span></h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">AI который пишет как SMMщик с 5 летним опытом</p>

          <form onSubmit={generate} className="mt-11 w-full max-w-3xl text-left">
            <div className={`rounded-[24px] border border-white/10 bg-[#171717]/90 p-2 shadow-[0_20px_60px_rgba(0,0,0,.35)] transition focus-within:border-violet-400/70 focus-within:shadow-[0_0_0_4px_rgba(139,92,246,.12),0_24px_70px_rgba(0,0,0,.45)] ${loading ? "animate-generating border-violet-400/80" : ""}`}>
              <div className="flex items-center gap-2 px-3 sm:px-4"><Sparkles className="size-5 shrink-0 text-violet-400" /><Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={300} placeholder="О чём хотите написать пост?" aria-label="Тема поста" className="h-14 text-[15px] sm:text-base" /><Button type="submit" size="icon" disabled={loading} className="animate-pulse-glow shrink-0 rounded-2xl"><span className="sr-only">Сгенерировать посты</span>{loading ? <Loader2 className="size-5 animate-spin" /> : <ArrowUp className="size-5" />}</Button></div>
              <div className="flex flex-wrap items-center gap-1 border-t border-white/[0.06] px-3 pb-1 pt-2 sm:px-4"><span className="mr-1 text-xs text-zinc-500">Тон:</span>{styles.map((item) => <button key={item} type="button" onClick={() => setStyle(item)} className={`rounded-lg px-2.5 py-1 text-xs transition ${style === item ? "bg-violet-500/20 text-violet-200" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}>{item}</button>)}</div>
            </div>
            {error && <p role="alert" className="mt-3 text-center text-sm text-rose-300">{error}</p>}
            <p className="mt-4 text-center text-xs text-zinc-600">Нажмите Enter или стрелку, чтобы сгенерировать</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Примеры тем">{examples.map((example) => <button key={example} type="button" onClick={() => { setTopic(example); setError(""); }} className="rounded-full border border-white/[0.09] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-violet-200">{example}</button>)}</div>
          </form>
          <div className="mt-10 flex items-center gap-2 text-xs text-zinc-500"><Zap className="size-3.5 text-violet-400" />Генерация за секунды · Без регистрации</div>
        </section>

        <section id="results" className="scroll-mt-8 pb-24 sm:pb-32"><div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-violet-300">{posts.length ? "Результаты готовы" : "Так выглядят результаты"}</p><h2 className="mt-1 text-3xl font-semibold tracking-tight">Выберите свой пост</h2></div><p className="text-sm text-zinc-500">Каждый вариант готов к публикации</p></div>
          <div className="grid gap-5 lg:grid-cols-3">{(posts.length ? posts : previewPosts).map((post, index) => { const type = postTypes[index] ?? postTypes[2]; return <Card key={`${post}-${index}`} className="animate-card-in flex min-h-[390px] flex-col border-white/80 bg-white p-5 text-zinc-900 shadow-[0_24px_55px_rgba(0,0,0,.32),0_0_34px_rgba(139,92,246,.13)]" style={{ animationDelay: `${index * 110}ms` }}><div className="flex items-center justify-between"><Badge className={`ring-1 ${type.color}`}>{type.label}</Badge><span className="text-xs text-zinc-400">{post.length} знаков</span></div><TypedPost text={post} animate={posts.length > 0} /><div className="mt-auto grid gap-2 pt-6"><Button variant="outline" onClick={() => copy(post, index)} className="w-full">{copied === index ? <><Check className="size-4 text-emerald-600" />Скопировано</> : <><Clipboard className="size-4" />Копировать</>}</Button><Button onClick={() => alert("Публикация в Telegram появится совсем скоро!")} className="w-full bg-[#8b5cf6] hover:bg-violet-500"><Send className="size-4" />Опубликовать в Telegram</Button></div></Card>; })}</div>
        </section>

        {history.length > 0 && <section className="border-t border-white/[0.07] py-12"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-medium">Недавние генерации</h2><button onClick={() => { setHistory([]); localStorage.removeItem(HISTORY_KEY); }} className="text-sm text-zinc-500 transition hover:text-white">Очистить</button></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{history.slice(0, 3).map((item) => <button key={item.id} onClick={() => { setTopic(item.topic); setStyle(item.style); setPosts(item.posts); }} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-left transition hover:border-violet-400/40 hover:bg-white/[0.06]"><p className="truncate text-sm text-zinc-200">{item.topic}</p><p className="mt-1 text-xs text-zinc-500">{item.style} · {new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(new Date(item.createdAt))}</p></button>)}</div></section>}
        <footer className="border-t border-white/[0.07] py-8 text-center text-xs text-zinc-600">© {new Date().getFullYear()} PostlyAI · Сделано на Groq — 300 токенов/сек</footer>
      </div>
    </main>
  );
}
