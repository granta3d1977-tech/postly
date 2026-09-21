import type { Session } from "next-auth";
import { LogIn, LogOut } from "lucide-react";
import { signOut } from "@/auth";
import { UserAvatar } from "./UserAvatar";

export function LoginButton({ session }: { session: Session | null }) {
  if (!session?.user) {
    return <a href="/login" className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-white transition hover:border-violet-400/50 hover:bg-white/5"><LogIn className="size-3.5" />Войти</a>;
  }

  return <div className="flex items-center gap-3">
    <a href="/profile" className="hidden items-center gap-2 text-right sm:flex">
      <span className="max-w-44 truncate text-xs text-zinc-300">{session.user.email || session.user.name}</span>
      <UserAvatar user={session.user} />
    </a>
    <form action={async () => {
      "use server";
      await signOut({ redirectTo: "/" });
    }}>
      <button type="submit" className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-medium text-zinc-300 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-white"><LogOut className="size-3.5" /><span className="hidden sm:inline">Выйти</span></button>
    </form>
  </div>;
}
