import { redirect } from "next/navigation"
import { LogoutButton } from "@/app/components/LogoutButton"
import { getUser } from "@/app/utils/user"

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) redirect("/auth")

  const displayName = user.full_name || "Member"
  const email = user.email || "—"
  const memberSince = formatMemberSince(user.created_at)
  const totalReservations = user.total_reservations ?? 0
  const hoursBooked = user.total_hours ?? 0

  const emailInitial = (email && email !== "—") ? email.charAt(0).toUpperCase() : "U"
  const avatarColors = ["bg-blue-100 text-blue-900", "bg-purple-100 text-purple-900", "bg-green-100 text-green-900", "bg-pink-100 text-pink-900", "bg-amber-100 text-amber-900"]
  const colorIndex = email.charCodeAt(0) % avatarColors.length
  const avatarColor = avatarColors[colorIndex]

  // Adjust font sizes based on displayName length
  const nameLength = displayName.length
  let nameSize = "text-5xl sm:text-6xl"
  let emailSize = "text-xl"
  let statsSize = "text-5xl sm:text-6xl"

  if (nameLength > 25) {
    nameSize = "text-2xl sm:text-3xl"
    emailSize = "text-md"
    statsSize = "text-3xl sm:text-4xl"
  } else if (nameLength > 15) {
    nameSize = "text-3xl sm:text-4xl"
    emailSize = "text-xl"
    statsSize = "text-4xl sm:text-5xl"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Background */}
      <div className="relative h-42 overflow-hidden">
        <img
          src="/bannerprofile.png"
          alt="Profile banner"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30"></div>
      </div>


      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        {/* Profile Picture */}
        <div className="mb-10">
          <div className="w-24 h-24 flex items-center justify-center">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className={`w-full h-full rounded-lg flex items-center justify-center text-4xl font-light ${avatarColor}`}>
                {emailInitial}
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`${nameSize} font-light text-gray-900 mb-2`}>
              {displayName}
            </h1>
            <p className={`${emailSize} text-gray-500`}>{email}</p>
          </div>
          <LogoutButton className="px-5 py-2 bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors rounded whitespace-nowrap" />
        </div>

        {/* Main Info */}
        <div className="space-y-10 pb-10">
          {/* Member Info */}
          <div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Member Information
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline border-b border-gray-200 pb-3">
                <span className="text-gray-600">Member since</span>
                <span className="text-gray-900">{memberSince}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-gray-200 pb-3">
                <span className="text-gray-600">Email address</span>
                <span className="text-gray-900">{email}</span>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Usage Statistics
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className={`${statsSize} font-light text-gray-900`}>
                  {totalReservations}
                </p>
                <p className="text-sm text-gray-600 mt-2">Total Reservations</p>
              </div>
              <div>
                <p className={`${statsSize} font-light text-gray-900`}>
                  {hoursBooked}
                </p>
                <p className="text-sm text-gray-600 mt-2">Hours Booked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatMemberSince(dateValue: string | null | undefined) {
  if (!dateValue) return "—"

  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return "—"

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}