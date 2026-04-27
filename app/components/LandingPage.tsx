import CommunitySection from '../components/CommunitySection'
import EmailBanner from '../components/EmailBanner'
import FacilitiesSection from '../components/FacilitiesSection'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import { MembershipSection } from '../components/MembershipSection'
import Navbar from '../components/Navbar'

const LandingPage = () => {
  return (
    <div className="w-full">
      <section className="relative h-dvh w-full p-2">
        <div
          className="absolute inset-0 bg-[url('/bg5.jpg')] bg-cover bg-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex h-full flex-col">
          <Navbar />
          <HeroSection />
        </div>
      </section>
      <div className="w-full bg-linear-to-br from-[#f9fbf2] via-[#f2f6e9] to-[#e7efe0]">
        <section className="min-h-screen w-full">
          <FacilitiesSection />
        </section>
        <section className="h-dvh w-full">
          <MembershipSection />
        </section>
        <section className="w-full">
          <CommunitySection />
        </section>
        <section className="w-full px-4 pb-12 pt-6 sm:px-8 lg:px-12">
          <EmailBanner />
        </section>
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage