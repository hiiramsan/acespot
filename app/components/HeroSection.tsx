import React from 'react'
import AvatarGroup from './AvatarGroup'

const HeroSection = () => {
    return (
        <div className="flex flex-1 px-10 py-8">
            <div className="flex w-full items-stretch justify-between">
                <div className="flex max-w-4xl flex-col justify-between mt-10">
                    <p className="text-sm uppercase tracking-[0.2em] italic text-white/60">Choose a court. <br /> Pick a time.  <br />
                        <span className='text-lime-300'> Play</span>.</p>
                    <div className="flex flex-col gap-4">
                        <div>
                            <button className="relative px-4 py-1 rounded-4xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium shadow-lg shadow-black/30 overflow-hidden">

                                <span className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/30 to-transparent opacity-40 pointer-events-none"></span>

                                <span className="relative z-10 inline-flex items-center gap-2 font-light font-nav">
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.25"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 22s7-7.02 7-12a7 7 0 1 0-14 0c0 4.98 7 12 7 12z" />
                                        <circle cx="12" cy="10" r="2.5" />
                                    </svg>
                                    San Francisco, California
                                </span>
                            </button>
                        </div>
                        <h1 className="text-6xl leading-tight font-extralight font-inter text-white [text-shadow:0_8px_24px_rgba(0,0,0,0.35)]">
                            Elevate Your Game
                            <br />
                            High-Performance Courts, Ready When You Are
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-end">
                    <div className="inline-flex items-start flex-col gap-3 w-[40%] text-white/70">
                        <AvatarGroup />
                        <p className=" font-nav font-light">
                            Train, compete, and connect with players who bring intensity to every match.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
