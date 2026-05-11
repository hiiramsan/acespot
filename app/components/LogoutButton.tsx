"use client"

import { logout } from "@/app/auth/actions"

type LogoutButtonProps = {
  className?: string
}

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const defaultClass = className || "rounded-2xl border border-red-400/60 bg-red-500 px-4 py-3 text-sm font-light tracking-widest hover:border-red-300 hover:bg-red-800"
  
  return (
    <form action={logout} className="">
      <button
        type="submit"
        className={`${defaultClass} cursor-pointer text-white transition-colors`}
      >
        Logout
      </button>
    </form>
  )
}