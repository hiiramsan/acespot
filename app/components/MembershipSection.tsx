import React from 'react'

const limitedBenefits = [
  'Free pass to courts',
  'Priority access',
  'Locker access',
]

export const MembershipSection = () => {
  return (
    <div className="relative flex h-full w-full items-center overflow-hidden px-6 py-8 lg:px-16" id="membership">
      <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
        <article className="rounded-4xl border border-[#d6ddce] bg-white/85 p-6 shadow-[0_18px_44px_rgba(8,21,38,0.12)] backdrop-blur-sm lg:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <p className="rounded-4xl border border-gray-500 px-4 py-1.5 text-md font-nav font-light text-black">
              Membership
            </p>
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-600">
              Limited Spots
            </span>
          </div>

          <h1 className="mt-5 max-w-xl text-3xl leading-tight text-[#0d1b2b] lg:text-5xl">
            Respot Membership Card
          </h1>

          <p className="mt-4 max-w-xl text-sm text-gray-700 lg:text-base">
            One premium card, fixed benefits, and priority treatment across the club. Once the batch is gone,
            enrollment closes.
          </p>

          <ul className="mt-8 space-y-3">
            {limitedBenefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center justify-between rounded-2xl border border-[#e4e9dc] bg-[#f7faf2] px-4 py-3"
              >
                <span className="text-[#101e30]">{benefit}</span>
                <span className="rounded-full bg-[#0f1722] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-lime-300">
                  Limited
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-end gap-2">
            <span className="text-5xl leading-none text-[#0d1b2b]">$79</span>
            <span className="pb-1 text-sm text-gray-600">/month</span>
          </div>

          <button
            type="button"
            className="mt-8 w-full cursor-pointer rounded-full bg-[#0f1722] px-5 py-3 text-sm font-medium text-lime-300 transition-colors duration-200 hover:bg-[#1a2738]"
          >
            Claim Membership Card
          </button>
        </article>

        <article className="perspective-distant relative mx-auto w-full max-w-xl">
          <div className="relative overflow-hidden rounded-4xl border border-[#21364e] bg-linear-to-br from-[#081525] via-[#0d2238] to-[#102d48] p-8 text-white shadow-[0_22px_50px_rgba(2,11,22,0.45)] transition-transform duration-300 lg:rotate-y-[-10deg] lg:rotate-x-[8deg]">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-lime-300/25 blur-3xl" />
            <div
              className="pointer-events-none absolute inset-0 bg-[url('/bg8.jpg')] bg-cover bg-center opacity-10"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_30%,rgba(255,255,255,0.12)_55%,rgba(255,255,255,0)_70%)]" />

            <div className="relative z-10 flex min-h-72 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-nav text-xs uppercase tracking-widest text-white/60">ACESPOT Club</p>
                  <h2 className="mt-2 text-2xl">Membership Card</h2>
                </div>
                <span className="rounded-full border border-lime-300/50 bg-lime-300/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-lime-200">
                  Limited
                </span>
              </div>

              <div className="flex-1" />

              <div className="mt-8 flex items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-white/55">Card Holder</p>
                  <p className="mt-1 text-base text-lime-300">Jullian Puerta</p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p className="text-[11px] uppercase tracking-widest text-white/55">Quick Access QR</p>
                  <div className="rounded-2xl bg-white p-1 shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
                    <img
                      src="/qr.svg"
                      alt="Membership quick access QR"
                      className="h-32 w-32 rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default MembershipSection
