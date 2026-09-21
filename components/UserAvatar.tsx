import type { Session } from "next-auth";

export function UserAvatar({ user }: { user: Session["user"] }) {
  const label = user?.name || user?.email || "Пользователь";
  const initials = label.trim().slice(0, 1).toUpperCase();

  if (user?.image) {
    return <img src={user.image} alt={label} referrerPolicy="no-referrer" className="size-9 rounded-full border border-white/15 object-cover" />;
  }

  return <span aria-label={label} className="grid size-9 place-items-center rounded-full bg-violet-500 text-sm font-semibold text-white">{initials}</span>;
}
