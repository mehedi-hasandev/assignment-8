"use client";

import Image from "next/image";
import { useState } from "react";

const coverStyles = [
  "from-emerald-950 via-emerald-800 to-amber-900",
  "from-rose-950 via-red-800 to-orange-700",
  "from-slate-700 via-stone-500 to-amber-200",
  "from-indigo-950 via-indigo-800 to-violet-700",
  "from-amber-950 via-amber-800 to-yellow-600",
];

export default function BookCover({ imageUrl, title, author, index }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!imageUrl || imageFailed) {
    return (
      <div
        role="img"
        aria-label={`Cover of ${title}`}
        className={`flex aspect-[2/3] flex-col justify-between bg-gradient-to-br p-4 text-white ${
          coverStyles[index % coverStyles.length]
        }`}
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/70">
          BookNook Library
        </span>
        <div>
          <p className="line-clamp-4 font-serif text-xl font-bold leading-tight">
            {title}
          </p>
          <p className="mt-3 line-clamp-2 text-xs text-white/75">{author}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[2/3] bg-zinc-800">
      <Image
        src={imageUrl}
        alt={`Cover of ${title}`}
        fill
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 20vw"
        unoptimized
        className="object-cover"
        onError={() => setImageFailed(true)}
      />
    </div>
  );
}
