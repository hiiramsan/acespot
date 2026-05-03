"use client"

import { logout } from "@/app/auth/actions"

type LogoutButtonProps = {
  className?: string
}

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  return (
    <form action={logout} className="w-full">
      <button
        type="submit"
        className={`cursor-pointer rounded-2xl border border-red-400/60 bg-red-500 px-4 py-3 text-sm font-light tracking-widest text-white transition-colors hover:border-red-300 hover:bg-red-800 ${className}`}
      >
        Logout
      </button>
    </form>
  )
}