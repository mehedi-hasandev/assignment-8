"use client";

import Image from "next/image";
import Link from "next/link";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const slides = [
  {
    image: "/booknook-reading.jfif",
    alt: "A stack of books ready to be shared with other readers",
    title: "Share the books on your shelf",
    description: "Add the books you have finished. Let other readers enjoy them too.",
  },
  {
    image: "/booknook-sharing.jfif",
    alt: "A welcoming library and a collection of books",
    title: "Your neighbourhood library, online",
    description:
      "Find a book that someone nearby already loved, and borrow it for a week.",
  },
  {
    image: "/booknook-library.jfif",
    alt: "A welcoming library reading room with bright bookshelves",
    title: "Borrow, read, return. Repeat.",
    description:
      "Seven days for every book. Return it with one click when you are done.",
  },
];

export default function Banner() {
  return (
    <section aria-label="Discover BookNook" className="booknook-banner">
      <Swiper
        modules={[A11y, Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        pagination={{ clickable: true }}
        aria-label="BookNook featured books"
        className="w-full"
      >
        {slides.map((slide, index) => {
          const Heading = index === 0 ? "h1" : "h2";

          return (
            <SwiperSlide key={slide.title}>
              <div className="relative flex h-[420px] items-center overflow-hidden bg-[#241d18] sm:h-[360px] lg:h-[clamp(300px,24vw,420px)]">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  loading="eager"
                  sizes="100vw"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,15,13,0.72)_0%,rgba(11,15,13,0.56)_38%,rgba(11,15,13,0.24)_68%,rgba(11,15,13,0.08)_100%)]"
                />
                <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 pt-8 text-white sm:px-8 lg:px-12">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-200">
                    BookNook
                  </p>
                  <Heading className="max-w-lg font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
                    {slide.title}
                  </Heading>
                  <p className="mt-3 max-w-md text-xs leading-5 text-white/90 sm:text-sm">
                    {slide.description}
                  </p>
                  <Link
                    href="/books"
                    className="mt-5 inline-flex rounded-md bg-emerald-300 px-4 py-2 text-xs font-semibold text-[#183328] shadow-sm transition-colors hover:bg-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Browse Books
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
