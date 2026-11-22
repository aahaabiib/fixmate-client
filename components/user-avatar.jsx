import { cn } from "@/lib/utils";

export default function UserAvatar({ user, className = "size-9" }) {
  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  if (user?.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name || "User"}
        className={cn("rounded-full border object-cover", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground",
        className
      )}
    >
      {initial}
    </span>
  );
}