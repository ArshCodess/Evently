"use client"
import { useUser } from "@/hooks/UserProvider";
import { UserButton } from "@clerk/nextjs";
import { CalendarRangeIcon, Heart, ReceiptText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useUser()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const linkBase =
    "flex items-center text-xs space-x-1 rounded-3xl px-4 py-2 relative gap-0.5 transition-transform transition-opacity duration-200 ease-in-out";
  const active =
    "bg-white text-gray-700 ";
  const inactive =
    "scale-75 opacity-60";

  return (
    <div className="fixed z-20 bottom-0 pb-1 bg-linear-180 from-transparent pt-3 to-25% lg:hidden to-white flex self-center w-full">
      <div className="list-none justify-between bg-gradient-to-br  text-gray-200 from-indigo-500 items-center border-gray-300 border to-pink-500  flex  rounded-4xl py-2 px-2 mx-auto">
        <Link
          className={`${linkBase} ${isActive("/applied") ? `${active}` : `${inactive}`
            }`}
          href="/applied"
        >
          <Heart />
          <p className={`mt-[3px] ${isActive("/applied") ? "" : "hidden"}`}>Applied</p>
        </Link>
        <Link
          className={`${linkBase} ${isActive("/tickets") ? `${active}` : `${inactive}`
            }`}
          href="/tickets"
        >
          <ReceiptText />
          <p className={`mt-[3px] ${isActive("/tickets") ? "" : "hidden"}`}>Tickets</p>
        </Link>
        <Link
          className={`${linkBase} ${isActive("/events") ? `${active}` : `${inactive}`
            }`}
          href="/events"
        >
          <CalendarRangeIcon />
          <p className={`mt-[3px] ${isActive("/events") ? "" : "hidden"}`}>Events</p>
        </Link>
        <Link
          className={`${linkBase} ${isActive("/profile") ? `${active}` : `${inactive}`
            }`}
          href="/profile"
        >
          {
            user?.user.imageUrl ? ( <div><img className="rounded-full h-7" src={user.user.imageUrl} alt="" /></div>): (<User />)
          }
          <p className={`mt-[3px] ${isActive("/profile") ? "" : "hidden"}`}>Profile</p>
        </Link>
      </div>
    </div>
  );
}
