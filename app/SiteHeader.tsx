"use client";

import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const navigation = [
    { href: "/", label: "About" },
    { href: "/resume", label: "Resume" },
    { href: "/experience", label: "Projects" },
    { href: "/statistics", label: "Statistics" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Kui Wu home">
        Kui Wu
      </a>
      <nav aria-label="Primary navigation">
        {navigation.map((item) => (
          <a
            href={item.href}
            key={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
