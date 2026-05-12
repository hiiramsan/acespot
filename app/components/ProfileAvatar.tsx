"use client"

import { useEffect, useState } from "react"

type ProfileAvatarProps = {
  avatarUrl?: string | null
  emailInitial: string
  avatarColor: string
}

export default function ProfileAvatar({ avatarUrl, emailInitial, avatarColor }: ProfileAvatarProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [avatarUrl])

  if (!avatarUrl || hasError) {
    return (
      <div className={`w-full h-full rounded-lg flex items-center justify-center text-4xl font-light ${avatarColor} border-2`}>
        {emailInitial}
      </div>
    )
  }

  return (
    <img
      src={avatarUrl}
      alt="Profile"
      className="w-full h-full object-cover rounded-lg"
      onError={() => setHasError(true)}
    />
  )
}
