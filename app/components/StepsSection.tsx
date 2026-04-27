import React from "react";

const mosaicTiles = [
  { id: 1, label: "B", position: "10% 20%" },
  { id: 2, label: "A", position: "40% 30%" },
  { id: 3, label: "L", position: "70% 20%" },
  { id: 4, label: "L", position: "20% 70%" },
  { id: 5, label: "E", position: "60% 60%" },
  { id: 6, label: "R", position: "90% 70%" },
];

const StepsSection = () => {
  return (
    <section className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative flex flex-col justify-between gap-6">
            <div className="absolute -left-6 top-0 hidden h-full items-center gap-3 lg:flex">
              
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-4xl font-light leading-tight text-black sm:text-5xl">
                It&apos;s Time To Find Your
                <br />
                Teammates &amp; Common Court!
              </h2>
              <p className="max-w-md text-sm text-black/70">
                Build your crew, choose a court, and book in seconds.
              </p>
              
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {mosaicTiles.map((tile) => (
              <div
                key={tile.id}
                className="relative h-28 overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-[0_12px_30px_rgba(0,0,0,0.08)] sm:h-32"
                style={{
                  backgroundImage: "url('/alcaraz.avif')",
                  backgroundSize: "cover",
                  backgroundPosition: tile.position,
                }}
              >
                <span className="absolute inset-0 bg-white/10" aria-hidden="true" />
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-white/90 sm:text-4xl">
                  {tile.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex min-h-45 flex-col justify-between rounded-3xl bg-black p-6 text-white shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
              <span>Step 1</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div>
              <p className="text-lg font-light text-white/80">How many teammates do you need?</p>
              <div className="mt-4 flex items-center gap-3">
                <button className="h-10 w-10 rounded-full border border-white/30 text-lg">-</button>
                <div className="rounded-full border border-white/30 px-5 py-2 text-sm">3</div>
                <button className="h-10 w-10 rounded-full border border-white/30 text-lg">+</button>
              </div>
            </div>
          </div>

          <div className="flex min-h-45 flex-col justify-between rounded-3xl bg-[#f37b3c] p-6 text-white shadow-[0_18px_40px_rgba(243,123,60,0.35)]">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/80">
              <span>Step 2</span>
              <span className="h-px flex-1 bg-white/30" />
            </div>
            <div>
              <p className="text-lg font-light">Which court do you need?</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between border-b border-white/30 pb-2">
                  <span>Indoor</span>
                  <span className="h-3 w-3 rounded-full border border-white/70" />
                </div>
                <div className="flex items-center justify-between border-b border-white/30 pb-2">
                  <span>Street</span>
                  <span className="h-3 w-3 rounded-full bg-white" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Complex</span>
                  <span className="h-3 w-3 rounded-full border border-white/40" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-45 flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 text-black shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-black/50">
              <span>Step 3</span>
              <span className="h-px flex-1 bg-black/10" />
            </div>
            <div>
              <p className="text-lg font-light text-black/80">Allow Location To Access</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-black/60">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-black/20">↗</span>
                <span>Enable GPS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
