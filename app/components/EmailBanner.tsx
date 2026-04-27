import React from 'react'

const EmailBanner = () => {
    return (
        <div className="relative py-4 w-full overflow-hidden rounded-4xl bg-white">
            <img
                src="/community.jpg"
                alt="Community banner"
                className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#041320]/80" />

            <div className="relative z-10 flex h-full items-center px-5 py-4 lg:px-10">
                <div className="max-w-3xl">
                    <h2 className="text-white text-lg leading-tight sm:text-xl lg:text-4xl lg:leading-[1.15]">
                        Get the Latest Updates, Special Offers, and Exclusive Event Invitations!
                    </h2>

                    <div className="mt-3 lg:mt-4 flex w-full max-w-xl items-center rounded-full border border-white/25 bg-black/30 px-2 py-1.5 backdrop-blur-sm">
                        <input
                            type="email"
                            placeholder="Enter your email address..."
                            className="w-full bg-transparent px-3 text-xs text-white placeholder:text-gray-300 focus:outline-none lg:text-base"
                        />

                        <button
                            type="button"
                            aria-label="Subscribe"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-300 cursor-pointer text-[#0b2a40] transition-colors duration-200 hover:bg-lime-400 lg:h-11 lg:w-11"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5 12H19M19 12L13 6M19 12L13 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmailBanner
