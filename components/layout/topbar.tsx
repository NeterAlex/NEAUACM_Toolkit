"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold"></h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost">
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
