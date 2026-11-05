"use client";

import Image from "next/image";
import Link from "next/link";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const slides = [
  {
    image: "/new1.jpg",
    alt: "A reader browsing a book in a library",
    title: "Share the books on your shelf",
    description: "Add the books you have finished. Let other readers enjoy them too.",
  },
  {
    image: "/new2.jpg",
    alt: "A stack of books on a wooden shelf",
    title: "Your neighbourhood library, online",
    description:
      "Find a book that someone nearby already loved, and borrow it for a week.",
  },
  {
    image: "/new3.jpg",
    alt: "An open book resting on a stack of books",
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
              <div className="relative flex h-[85vh] items-center overflow-hidden bg-brand-ink">
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
                  className="absolute inset-0 bg-[linear-gradient(90deg,rgba(32,16,40,0.32)_0%,rgba(32,16,40,0.16)_36%,transparent_68%)]"
                />
                <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 pt-8 text-white sm:px-8 lg:px-12">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/90">
                    BookNook
                  </p>
                  <Heading className="max-w-lg font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
                    {slide.title}
                  </Heading>
                  <p className="mt-3 max-w-md text-xs leading-5 text-white/90 sm:text-sm">
                    {slide.description}
                  </p>
                  <Link
                    href="/all-books"
                    className="mt-5 inline-flex min-h-11 items-center rounded-md bg-brand-cta px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-cta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
