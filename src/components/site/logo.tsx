"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next-intl/client";
import { cn } from "@/lib";
import pkg from "../../../package.json";

export default function Logo({
  disabled = false,
  share = false,
  version = true,
  size = "default",
}) {
  const router = useRouter();
  const locale = useLocale();

  const onClick = () => {
    if (disabled) return;
    router.push("/");
  };

  const onCheckLog = () => {
    const version = pkg.version.replace(/\./g, "");
    const localePath = locale === "zh-CN" ? "zh-CN/" : "";
    const url = `https://docs.ltopx.com/${localePath}change-log#v${version}`;
    window.open(url);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        { "text-2xl": size === "default" },
        { "text-4xl": size === "large" }
      )}
    >
      <div
        className="flex items-center gap-2 cursor-pointer select-none text-transparent font-extrabold"
        onClick={onClick}
      >
        <span className="bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
          L-GPT
        </span>
        {!!share && <span className="bg-clip-text bg-share-ico">Share</span>}
      </div>
      {!!version && (
        <span
          className="text-xs cursor-pointer font-semibold py-1.5 px-3 bg-slate-400/10 rounded-full tabular-nums"
          onClick={onCheckLog}
        >
          v{pkg.version}
        </span>
      )}
    </div>
  );
}
