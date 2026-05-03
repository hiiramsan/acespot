"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
    { href: "/bookings", label: "Book a Court" },
    { href: "/reservations", label: "My Reservations" },
    { href: "/profile", label: "Profile" },
];

const styles = `
  @keyframes fillFromLeft {
    from {
      background-position: 100% 0;
    }
    to {
      background-position: 0 0;
    }
  }

  .nav-link {
    background: linear-gradient(to right, #84cc16 0%, #84cc16 50%, #d1d5db 50%, #d1d5db 100%);
    background-size: 200% 100%;
    background-position: 100% 0;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: background-position 0.3s ease;
  }

  .nav-link:hover {
    animation: fillFromLeft 0.3s ease forwards;
  }

  .nav-link.active {
    background-position: 0 0;
    -webkit-text-fill-color: unset;
    color: #84cc16;
  }
`;

interface AppNavbarClientProps {
    user: any;
}

export function AppNavbarClient({ user }: AppNavbarClientProps) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-3 z-50 w-full pointer-events-auto">
            <style>{styles}</style>
            <div className="flex justify-center px-4">
                {/* Desktop Navbar */}
                <div className="hidden md:flex items-center h-14 bg-black rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.25)] px-5 gap-4">

                    {/* Logo Icon */}
                    <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
                        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="#BEF264">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M16 12h7v1h-7zM2 13h7v-1H2zm10 10h1v-7h-1zm0-14h1V2h-1zm-2 1h5v5h-5zm1 4h3v-3h-3z"></path>
                                <path fill="none" d="M0 0h24v24H0z"></path>
                            </g>
                        </svg>
                    </Link>

                    {/* Separator */}
                    <div className="h-6 w-px bg-gray-600"></div>

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-6">
                        {navLinks.map(({ href, label }) => {
                            const active = pathname === href || pathname.startsWith(href + "/");
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`text-xs font-semibold tracking-widest nav-link ${active ? "active" : ""}`}
                                >
                                    {label.toUpperCase()}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Separator */}

                    {/* Sign In Button */}
                    {
                        !user &&
                        <>
                            <div className="h-6 w-px bg-gray-600"></div>
                            <Link
                                href="/auth"
                                className="shrink-0 px-5 py-2 rounded-full bg-white text-black text-xs font-semibold tracking-widest hover:bg-lime-200 active:scale-95 transition-all duration-150"
                            >
                                SIGN IN
                            </Link>
                        </>
                    }


                </div>

                {/* Mobile Navbar */}
                <div className="md:hidden flex items-center justify-between h-14 bg-black rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.25)] px-4 w-full">
                    {/* Logo Icon */}
                    <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
                        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="#BEF264">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M16 12h7v1h-7zM2 13h7v-1H2zm10 10h1v-7h-1zm0-14h1V2h-1zm-2 1h5v5h-5zm1 4h3v-3h-3z"></path>
                                <path fill="none" d="M0 0h24v24H0z"></path>
                            </g>
                        </svg>
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        className="flex flex-col justify-center items-center w-9 h-9 gap-1.25 cursor-pointer"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-5 h-[1.5px] bg-white transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
                        <span className={`block w-5 h-[1.5px] bg-white transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
                        <span className={`block w-5 h-[1.5px] bg-white transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-80" : "max-h-0"}`}
            >
                <div className="flex justify-center px-4 mt-2">
                    <nav className="w-full bg-black/95 rounded-2xl px-4 py-3 gap-1 flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
                        {navLinks.map(({ href, label }) => {
                            const active = pathname === href || pathname.startsWith(href + "/");
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-xs font-semibold tracking-widest transition-all ${active
                                        ? "text-black bg-lime-400"
                                        : "text-gray-300 hover:text-lime-400"
                                        }`}
                                >
                                    {label.toUpperCase()}
                                </Link>
                            );
                        })}
                        <div className="border-t border-gray-600 my-2"></div>
                        <Link
                            href="/register"
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-3 rounded-lg bg-lime-400 text-black text-xs font-semibold tracking-widest hover:bg-lime-300 active:scale-95 transition-all duration-150 text-center"
                        >
                            SIGN IN
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
