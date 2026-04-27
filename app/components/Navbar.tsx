import Link from "next/link"

const Navbar = () => {
  return (
    <div className="relative w-full flex items-center px-8 py-4 text-white">
      
      {/* Left - Links */}
      <div className="flex gap-4 font-nav font-light text-lg">
        <a href="#facilities" className="group relative pb-1">
          Facilities
          <span className="pointer-events-none absolute bottom-0 left-0 h-[0.5px] w-0 bg-lime-300 transition-[width] duration-300 group-hover:w-full" />
        </a>
         <a href="#membership" className="group relative pb-1">
          Membership
          <span className="pointer-events-none absolute bottom-0 left-0 h-[0.5px] w-0 bg-lime-300 transition-[width] duration-300 group-hover:w-full" />
        </a>
        <a href="#community" className="group relative pb-1">
          Community
          <span className="pointer-events-none absolute bottom-0 left-0 h-[0.5px] w-0 bg-lime-300 transition-[width] duration-300 group-hover:w-full" />
        </a>
       
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <a href="" className="inline-flex items-center font-nav text-2xl font-light">
          ACE<span className="font-medium font-inter">SPOT</span>
          <svg width="32px" height="32px" viewBox="0 0 24 24" fill="#BEF264"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16 12h7v1h-7zM2 13h7v-1H2zm10 10h1v-7h-1zm0-14h1V2h-1zm-2 1h5v5h-5zm1 4h3v-3h-3z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>
        </a>
      </div>

      {/* Right - CTA */}
      <div className="ml-auto">
        <Link
          href="/bookings"
          className="group inline-flex items-center gap-1 rounded-full bg-lime-300/90 px-4 py-2 font-nav font-light text-sm text-black  transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white hover:text-black hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)"
        >
          Book Now
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-up-right-icon lucide-arrow-up-right transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
        </Link>
        
      </div>

    </div>
  )
}

export default Navbar