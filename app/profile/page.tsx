import { redirect } from "next/navigation";
import { AuthHeader } from "@/components/AuthHeader";
import { UserAvatar } from "@/components/UserAvatar";
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <main className="min-h-screen bg-[#0a0a0a] text-white"><div className="mx-auto max-w-7xl px-5 sm:px-8"><AuthHeader session={session} />
    <section className="mx-auto max-w-xl py-16 sm:py-24"><p className="text-sm font-medium text-violet-300">Аккаунт</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Ваш профиль</h1>
      <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"><UserAvatar user={session.user} /><div className="min-w-0"><p className="truncate font-medium">{session.user.name || "Пользователь PostlyAI"}</p><p className="mt-1 truncate text-sm text-zinc-400">{session.user.email || "Email не предоставлен"}</p></div></div>
      <p className="mt-6 text-sm leading-6 text-zinc-500">Ваш идентификатор готов для привязки будущих генераций: <span className="font-mono text-zinc-400">{session.user.id}</span></p>
    </section>
  </div></main>;
}
