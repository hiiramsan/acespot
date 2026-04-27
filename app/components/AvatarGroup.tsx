import React from 'react'

const AvatarGroup = () => {
    return (
        <div
            className="relative rounded-4xl bg-white/10 px-2 py-2 backdrop-blur-sm
  border border-white/30 text-white shadow-lg shadow-black/30 overflow-hidden"
        >
            <span
                className="absolute inset-0 rounded-3xl bg-linear-to-b from-white/40 to-transparent
    opacity-45 pointer-events-none"
            ></span>
            <div className="relative z-10 flex -space-x-3 rtl:space-x-reverse">
                <img
                    className="h-10 w-10 rounded-full object-cover"
                    src="/jannik2.jpg"
                    alt="Player avatar 1"
                />
                <img
                    className="h-10 w-10 rounded-full object-cover"
                    src="/alcaraz.avif"
                    alt="Player avatar 2"
                />
                <img
                    className="h-10 w-10 rounded-full object-cover"
                    src="/djoko.jpg"
                    alt="Player avatar 3"
                />
            </div>
        </div>
    )
}

export default AvatarGroup
