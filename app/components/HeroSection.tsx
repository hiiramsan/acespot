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
