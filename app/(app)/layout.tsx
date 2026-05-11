import AppNavbar from "@/app/components/AppNavbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f6f4ef]">
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
