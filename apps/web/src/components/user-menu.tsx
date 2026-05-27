import Link from "next/link";
import Image from "next/image";
import { ensureDefaultLocalUser } from "@/lib/local-user";

function getInitials(name: string) {
  return name
    .split(" ")
    .flatMap(part => {
      const initial = part.trim()[0];
      return initial ? [initial] : [];
    })
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function UserMenu() {
  let userName = "Treinador CCT";
  let userImage: string | null = null;

  try {
    const user = await ensureDefaultLocalUser();
    userName = user.name;
    userImage = user.image;
  } catch {
    // fallback para render inicial se o banco ainda não estiver pronto
  }

  const initials = getInitials(userName) || "TC";

  return (
    <Link
      href="/profile"
      className="group flex items-center gap-2.5 px-2.5 py-1.5 font-mono text-[13px] text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all select-none border border-transparent hover:border-border/30 rounded-none cursor-pointer"
    >
      <span className="font-semibold tracking-wide">{userName}</span>
      {userImage ? (
        <Image
          src={userImage}
          alt={`Foto de ${userName}`}
          width={28}
          height={28}
          unoptimized
          className="size-7 rounded-full border border-primary/25 object-cover shadow-xs"
        />
      ) : (
        <div className="size-7 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-[10px] font-bold text-primary font-mono tracking-tight shadow-xs transition-colors group-hover:bg-primary/20">
          {initials}
        </div>
      )}
    </Link>
  );
}

