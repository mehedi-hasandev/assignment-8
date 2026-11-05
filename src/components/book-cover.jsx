"use client";

import Image from "next/image";
import { useState } from "react";

const coverStyles = [
  "from-brand-ink via-brand-cta to-brand-plum",
  "from-brand-plum via-brand-cta to-brand-ink",
  "from-brand-cta via-brand-plum to-brand-ink",
  "from-brand-ink via-brand-plum to-brand-cta",
  "from-brand-plum via-brand-ink to-brand-cta",
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
        className={`flex ${aspectClass} flex-col justify-between bg-gradient-to-br p-4 text-white ${
          coverStyles[index % coverStyles.length]
        }`}
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/80">
          BookNook Library
        </span>
        <div>
          <p className="line-clamp-4 font-serif text-xl font-bold leading-tight">
            {title}
          </p>
          <p className="mt-3 line-clamp-2 text-xs text-white/80">{author}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectClass} bg-brand-paper`}>
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
