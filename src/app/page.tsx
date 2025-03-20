import HeroSection from '../components/dashboard/HeroSection'
import TopMovies from '@/components/dashboard/Top'
import Footer from '@/components/dashboard/Footer'
import TopUsers from '@/components/dashboard/TopUsers'
import TopRelease from '@/components/dashboard/TopRelease'; 
export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="  ">
        <HeroSection />
        <TopRelease />
        <TopMovies />
        <TopUsers />
        <Footer />
      </div>
    </main>
  )
}