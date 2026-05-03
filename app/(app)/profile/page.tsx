import { redirect } from "next/navigation"
import { LogoutButton } from "@/app/components/LogoutButton"
import { getUser } from "@/app/utils/user"
import Image from "next/image"

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) redirect("/auth")

  const displayName = user.full_name || "Member"
  const email = user.email || "—"
  const memberSince = formatMemberSince(user.created_at)
  const totalReservations = user.total_reservations ?? 0
  const hoursBooked = user.total_hours ?? 0
  const initials = displayName
    .trim()
    .split(" ")
    .map((part: string) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")

  return (
    <div className="h-full w-full px-4 md:px-8 lg:px-12 pt-20 pb-6">
      <section className="h-full max-w-5xl mx-auto flex flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#4a5e3a]">
              Profile
            </p>
            <h1
              className="text-3xl md:text-4xl font-semibold text-[#1a2e10]"
              style={{ fontFamily: "var(--font-urbanist)" }}
            >
              Account overview
            </h1>
          </div>
        </header>

        <div className="flex-1 grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] gap-6 min-h-0">
          <div className="lg:col-span-2 rounded-3xl border border-lime-400/40 bg-[#0b0b0b] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="h-20 w-20 rounded-full border border-lime-300/50 bg-[#101010] overflow-hidden">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Profile avatar"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xl font-semibold text-lime-300">
                      {initials || "R"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-lime-300/70">
                    Full name
                  </p>
                  <h2
                    className="text-2xl font-semibold text-white"
                    style={{ fontFamily: "var(--font-urbanist)" }}
                  >
                    {displayName}
                  </h2>
                  <p className="mt-1 text-sm text-white/60">{email}</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-2xl border border-lime-300/30 bg-[#121212] px-4 py-2 text-sm text-white/80 hover:border-lime-300/60"
              >
                Edit profile
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-lime-400/40 bg-[#0b0b0b] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-lime-300/70">
              Details
            </p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-lime-300/20 bg-[#121212] p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-lime-300/60">
                  Member since
                </p>
                <p className="mt-2 text-sm text-white/80">{memberSince}</p>
              </div>
              <div className="rounded-2xl border border-lime-300/20 bg-[#121212] p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-lime-300/60">
                  Email
                </p>
                <p className="mt-2 text-sm text-white/80">{email}</p>
              </div>
              <LogoutButton className="w-full" />
            </div>
          </div>

          <div className="rounded-3xl border border-lime-400/40 bg-[#0b0b0b] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-lime-300/70">
              Usage
            </p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-lime-300/20 bg-[#121212] p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-lime-300/60">
                  Total reservations
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {totalReservations}
                </p>
              </div>
              <div className="rounded-2xl border border-lime-300/20 bg-[#121212] p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-lime-300/60">
                  Hours booked
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {hoursBooked}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
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