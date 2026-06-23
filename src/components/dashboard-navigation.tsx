"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function getCarIdFromPath(pathname: string) {
  const match = pathname.match(/^\/dashboard\/cars\/([^/]+)/);

  if (!match) {
    return null;
  }

  if (match[1] === "new") {
    return null;
  }

  return match[1];
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname.startsWith(href);
}

export function DashboardNavigation() {
  const pathname = usePathname();
  const carId = getCarIdFromPath(pathname);

  const links = [
    {
      href: "/dashboard",
      label: "Авто",
    },
    {
      href: "/dashboard/profile",
      label: "Профиль",
    },
  ];

  const carLinks = carId
    ? [
        {
          href: `/dashboard/cars/${carId}/maintenance`,
          label: "ТО",
        },
        {
          href: `/dashboard/cars/${carId}/expenses`,
          label: "Расходы",
        },
      ]
    : [];

  const allLinks = [...links, ...carLinks];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-[2rem] border border-neutral-200 bg-white/90 p-2 shadow-lg backdrop-blur dark:border-neutral-800 dark:bg-black/90 md:hidden">
      <div className="grid grid-cols-2 gap-2">
        {allLinks.map((link) => {
          const active = isActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "rounded-2xl px-3 py-3 text-center text-sm transition",
                active
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900",
              ].join(" ")}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}