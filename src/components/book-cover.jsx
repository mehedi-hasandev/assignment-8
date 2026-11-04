"use client";

import Image from "next/image";
import { useState } from "react";

const coverStyles = [
  "from-orange-100 via-orange-200 to-orange-400",
  "from-orange-50 via-amber-100 to-orange-300",
  "from-amber-100 via-orange-200 to-amber-400",
  "from-orange-100 via-orange-300 to-amber-500",
  "from-amber-50 via-orange-100 to-orange-300",
];

export default function BookCover({
  imageUrl,
  title,
  author,
  index,
  aspectClass = "aspect-[2/3]",
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!imageUrl || imageFailed) {
    return (
      <div
        role="img"
        aria-label={`Cover of ${title}`}
        className={`flex ${aspectClass} flex-col justify-between bg-gradient-to-br p-4 text-orange-950 ${
          coverStyles[index % coverStyles.length]
        }`}
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-orange-900/70">
          BookNook Library
        </span>
        <div>
          <p className="line-clamp-4 font-serif text-xl font-bold leading-tight">
            {title}
          </p>
          <p className="mt-3 line-clamp-2 text-xs text-orange-950/75">{author}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectClass} bg-orange-50`}>
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
