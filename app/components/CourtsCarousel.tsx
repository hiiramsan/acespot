"use client"

import { useState, useRef, JSX } from "react";

interface Card {
  id: number;
  tag: string;
  title: string;
  bg: string;
  image: string;
}

const cardGradient = "from-slate-900/10 via-slate-900/45 to-slate-950/80";

const availabilityColor = (label: string): string => {
  const key = label.toLowerCase();
  if (key.includes("high")) return "bg-lime-400";
  if (key.includes("moderate")) return "bg-yellow-300";
  return "bg-red-400";
};

const cards: Card[] = [
  {
    id: 1,
    tag: "Low availability",
    title: "Hard Court 1",
    bg: cardGradient,
    image: "/hardcourt1.png",
  },
  {
    id: 2,
    tag: "Low availability",
    title: "Hard Court 2",
    bg: cardGradient,
    image: "/hardcourt2.png",
  },
  {
    id: 3,
    tag: "Moderate availability",
    title: "Hard Court 3",
    bg: cardGradient,
    image: "/hardcourt3.png",
  },
  {
    id: 4,
    tag: "High availability",
    title: "Hard Court 4",
    bg: cardGradient,
    image: "/hardcourt4.png",
  },
  {
    id: 5,
    tag: "High availability",
    title: "Clay Court 1",
    bg: cardGradient,
    image: "/claycourt1.png",
  },
  {
    id: 6,
    tag: "Low availability",
    title: "Clay Court 2",
    bg: cardGradient,
    image: "/claycourt2.png",
  },
];

export default function CourtsCarousel(): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const scroll = (dir: "left" | "right"): void => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  const handleScroll = (): void => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  return (
    <div className="w-full px-6 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="w-full max-w-7xl mx-auto">
        {/* Carousel Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-4 pl-1 pr-6"
          style={
            {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollPaddingLeft: "0.25rem",
              scrollPaddingRight: "1.5rem",
            } as React.CSSProperties
          }
        >
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              aria-label={`Book ${card.title}`}
              className="relative shrink-0 rounded-xl overflow-hidden group w-65 sm:w-70 lg:w-75 h-105 text-left"
            >
              {/* Background Image */}
              <img
                src={card.image}
                alt={card.tag}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-linear-to-b ${card.bg}`} />

              {/* Hover legend */}
              <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="rounded-full  px-4 py-2 text-sm font-medium text-white cursor-pointer border border-white shadow-lg shadow-black/30">
                  {`Book ${card.title.toLowerCase()}`}
                </span>
              </div>

              {/* Top tag pill */}
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-4xl bg-black/90 text-white font-light shadow-lg shadow-black/30">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${availabilityColor(card.tag)}`}
                    aria-hidden="true"
                  />

                  {card.tag}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <p
                  className="text-white font-semibold leading-snug"
                  style={{ fontSize: "1.15rem", letterSpacing: "-0.02em" }}
                >
                  {card.title}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#c5c3bb] transition-all duration-200 hover:border-black hover:bg-black disabled:cursor-not-allowed disabled:opacity-30">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L5 8L10 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black group-hover:text-white transition-colors duration-200"
                />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#c5c3bb] transition-all duration-200 hover:border-black hover:bg-black disabled:cursor-not-allowed disabled:opacity-30">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black group-hover:text-white transition-colors duration-200"
                />
              </svg>
            </button>
          </div>

          <p
            className="text-right max-w-xs"
            style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.5 }}
          >
            Book a court for casual games, focused practice or private coaching,
            and elevate your game.
          </p>
        </div>
      </div>
    </div>
  );
}