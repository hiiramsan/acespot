"use client"

import React, { useState, useEffect, useRef } from 'react'

type SlideDirection = 'left' | 'right'

interface Testimonial {
    id: number
    image: string
    imageAlt: string
    quote: string
    name: string
    memberSince: string
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        image: '/rafa.jpg',
        imageAlt: 'our community member Rafael Costa',
        quote:
            'The level here is amazing. Every week I meet players who push me harder and make every training session worth it.',
        name: 'Galt MacDermot',
        memberSince: '2019',
    },
    {
        id: 2,
        image: '/tati.jpg',
        imageAlt: 'our community member Tati Alves',
        quote:
            'This is more than a club, it is like a family to me. We are always there for each other and we learn and improve our game together.',
        name: 'Tati Alves',
        memberSince: '2014',
    },
    {
        id: 3,
        image: '/mar.jpg',
        imageAlt: 'our community member Mariana Lopes',
        quote:
            'I came for the facilities, but I stayed for the people. The community vibe keeps me motivated all season long.',
        name: 'Akofa Akoussah',
        memberSince: '2021',
    },
]

type AnimState = 'idle' | 'exit' | 'enter'

const CommunitySection = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [animState, setAnimState] = useState<AnimState>('idle')
    const [direction, setDirection] = useState<SlideDirection>('right')
    const [displayIndex, setDisplayIndex] = useState(0)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const isAnimating = animState !== 'idle'

    const handleSlide = (dir: SlideDirection) => {
        if (isAnimating) return

        setDirection(dir)
        setAnimState('exit')

        timerRef.current = setTimeout(() => {
            setActiveIndex((prev) => {
                const next =
                    dir === 'right'
                        ? (prev + 1) % testimonials.length
                        : (prev - 1 + testimonials.length) % testimonials.length
                setDisplayIndex(next)
                return next
            })
            setAnimState('enter')
        }, 280)
    }

    useEffect(() => {
        setDisplayIndex(activeIndex)
    }, [])

    useEffect(() => {
        if (animState === 'enter') {
            const frame = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimState('idle')
                })
            })
            return () => cancelAnimationFrame(frame)
        }
    }, [animState])

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    const t = testimonials[displayIndex]

    const exitTranslate = direction === 'right' ? '-40px' : '40px'
    const enterTranslate = direction === 'right' ? '40px' : '-40px'

    const containerStyle: React.CSSProperties =
        animState === 'exit'
            ? {
                opacity: 0,
                transform: `translateX(${exitTranslate})`,
                transition: 'opacity 280ms ease, transform 280ms ease',
            }
            : animState === 'enter'
                ? {
                    opacity: 0,
                    transform: `translateX(${enterTranslate})`,
                    transition: 'none',
                }
                : {
                    opacity: 1,
                    transform: 'translateX(0)',
                    transition: 'opacity 320ms ease, transform 320ms ease',
                }

    return (
        <div className="flex flex-col px-6 pt-10 pb-8 lg:px-16 lg:pt-16" id="community">
            <div className="flex flex-row gap-4 items-center">
                <p className="border border-gray-500 rounded-4xl px-4 py-1.5 text-md text-black font-nav font-light">
                    Community
                </p>
                <h1 className="text-black text-xl lg:text-2xl text-nav">What are you waiting to join us?</h1>
            </div>

            <div className="mt-6 px-2 lg:mt-8 lg:px-20 overflow-hidden flex justify-center">
                <div
                    style={containerStyle}
                    className="flex flex-row items-center justify-start gap-10"
                >
                    <img
                        src={t.image}
                        alt={t.imageAlt}
                        className="block h-80 w-96 flex-none rounded-3xl object-cover"
                    />

                    {/* Text content */}
                    <div className="flex flex-col gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 1025 1024">
                            <path
                                fill="#000000"
                                d="M855.048 768h-87l-256 256V768h-343q-57 0-113-57t-56-115V172q0-58 56-115t113-57h686q57 0 113 57t56 115v424q0 58-56 115t-113 57zm-407-384q0-27-18.5-45.5t-45.5-18.5h-64v-64h32q13 0 22.5-9.5t9.5-22.5t-9.5-22.5t-22.5-9.5h-96q-26 0-45 19t-19 45v256q0 26 19 45t45 19h128q26 0 45-19t19-45V384zm384 0q0-27-19-45.5t-45-18.5h-64v-64h32q13 0 22.5-9.5t9.5-22.5t-9.5-22.5t-22.5-9.5h-96q-27 0-45.5 19t-18.5 45v256q0 26 18.5 45t45.5 19h128q26 0 45-18.5t19-45.5V384z"
                            />
                        </svg>

                        <h1 className="max-w-2xl text-2xl text-black">{t.quote}</h1>

                        <p className="text-lg text-blue-500">
                            {t.name} <span className="text-black">|</span>{' '}
                            <span className="text-gray-600">Member since {t.memberSince}</span>
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    aria-label="Previous testimonial"
                                    onClick={() => handleSlide('left')}
                                    disabled={isAnimating}
                                    className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#c5c3bb] transition-all duration-200 hover:border-black hover:bg-black disabled:cursor-not-allowed disabled:opacity-30"
                                >
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
                                    aria-label="Next testimonial"
                                    onClick={() => handleSlide('right')}
                                    disabled={isAnimating}
                                    className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#c5c3bb] transition-all duration-200 hover:border-black hover:bg-black disabled:cursor-not-allowed disabled:opacity-30"
                                >
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

                            {/* Counter */}
                            <div className="flex items-baseline gap-0.5 text-sm">
                                <span className="text-black font-medium">{displayIndex + 1}</span>
                                <span className="text-gray-400">&nbsp;/&nbsp;{testimonials.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommunitySection