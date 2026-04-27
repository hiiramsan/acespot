const Footer = () => {
    return (
        <footer className="w-full bg-black text-lime-200">
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.2fr_1fr_1fr]">
                <div className="space-y-4">
                    <div className="inline-flex items-center font-nav text-2xl font-light text-lime-200">
                        ACE<span className="font-medium font-inter text-lime-100">SPOT</span>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="#BEF264" aria-hidden="true">
                            <path d="M16 12h7v1h-7zM2 13h7v-1H2zm10 10h1v-7h-1zm0-14h1V2h-1zm-2 1h5v5h-5zm1 4h3v-3h-3z"></path>
                            <path fill="none" d="M0 0h24v24H0z"></path>
                        </svg>
                    </div>
                    <p className="max-w-sm text-sm text-lime-100/80">
                        Premium courts, events, and community-driven experiences in the heart of the city.
                        Play, connect, and recharge at your home court.
                    </p>
                    <div className="flex items-center gap-3">
                        <a
                            href="https://www.instagram.com"
                            aria-label="Instagram"
                            className="inline-flex p-1 h-9 w-9 items-center justify-center rounded-full bg-lime-300 text-black transition hover:bg-lime-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                        </a>
                        <a
                            href="https://www.facebook.com"
                            aria-label="Facebook"
                            className="inline-flex p-1 h-9 w-9 items-center justify-center rounded-full bg-lime-300 text-black transition hover:bg-lime-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.x.com"
                            aria-label="X"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-lime-300 text-black transition hover:bg-lime-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-300">
                        Visit Us
                    </h3>
                    <div className="space-y-2 text-sm text-lime-100/80">
                        <p>1260 Summit Ave, Midtown, NY 10012</p>
                        <p>Mon - Fri: 6:00 AM - 11:00 PM</p>
                        <p>Sat - Sun: 7:00 AM - 10:00 PM</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-300">
                        Contact
                    </h3>
                    <div className="space-y-2 text-sm text-lime-100/80">
                        <p>Phone: (212) 555-0148</p>
                        <p>Email: hello@acespot.com</p>
                        <p>Courts, events, and private bookings.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                        <a href="#facilities" className="text-lime-200 transition hover:text-lime-300">
                            Facilities
                        </a>
                        <a href="#membership" className="text-lime-200 transition hover:text-lime-300">
                            Membership
                        </a>
                        <a href="#community" className="text-lime-200 transition hover:text-lime-300">
                            Community
                        </a>
                        <a href="#" className="text-lime-200 transition hover:text-lime-300">
                            Book Now
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-lime-200/10">
                <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-2 px-6 py-4 text-xs text-lime-100/60 sm:flex-row sm:items-center sm:justify-between sm:px-10">
                    <span>2026 Acespot. All rights reserved.</span>
                    <span>Designed for players who want more than a court.</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
