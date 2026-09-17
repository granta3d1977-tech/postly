import type { Session } from "next-auth";
import { Sparkles } from "lucide-react";
import { LoginButton } from "./LoginButton";

export function AuthHeader({ session }: { session: Session | null }) {
  return <header className="flex h-20 items-center justify-between border-b border-white/[0.07] sm:h-24">
    <a href="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-lg bg-violet-500 shadow-[0_0_24px_rgba(139,92,246,.65)]"><Sparkles className="size-4" /></span>PostlyAI</a>
    <LoginButton session={session} />
  </header>;
}
