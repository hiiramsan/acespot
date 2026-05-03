import AppNavbar from "@/app/components/AppNavbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#EFEBCE]">

      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        repeating-radial-gradient(
          circle at 0 0,
          rgba(0,0,0,0.06) 0 0.7px,
          transparent 0.7px 6px
        ),
        repeating-radial-gradient(
          circle at 100% 100%,
          rgba(0,0,0,0.03) 0 0.6px,
          transparent 0.6px 5px
        )
      `,
          mixBlendMode: "multiply",
        }}
      />
      {/* Floating Navbar */}
      <nav className="absolute top-3 left-0 right-0 z-50 px-4 pointer-events-none">
        <AppNavbar />
      </nav>

      {/* Full-screen Content */}
      <main className="relative w-full h-full overflow-auto">
        {children}
      </main>
    </div>
  );
}
