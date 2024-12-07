"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Home, Settings } from "lucide-react";

const menuItems = [
  { name: "首页", href: "/", icon: Home },
  { name: "假条生成", href: "/leavn", icon: FileText },
  { name: "证书生成", href: "/cert", icon: FileText },
  { name: "数据转换", href: "/convert", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-100 h-screen">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-lg font-semibold text-primary">NEAUACM Toolkit</span>
      </div>
      <nav className="p-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg ${
                  pathname === item.href ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
