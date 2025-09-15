"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Filters({
  active,
}: {
  active: "all" | "reading" | "finished";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setStatus = (val: "all" | "reading" | "finished") => {
    const q = new URLSearchParams(params.toString());
    if (val === "all") q.delete("status");
    else q.set("status", val);
    router.push(`${pathname}?${q.toString()}`);
  };

  const btn = (val: "all" | "reading" | "finished", label: string) => (
    <button
      onClick={() => setStatus(val)}
      className={`px-3 py-1.5 rounded border text-sm ${
        active === val
          ? "bg-teal-100 border-teal-400 text-teal-700"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-2">
      {btn("all", "Vše")}
      {btn("reading", "Rozčtené")}
      {btn("finished", "Dočtené")}
    </div>
  );
}
