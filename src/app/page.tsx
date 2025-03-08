import HeroSection from '../components/dashboard/HeroSection'
import TopMovies from '@/components/dashboard/Top'
import Trending from '@/components/dashboard/Trending'
import Footer from '@/components/dashboard/Footer'
export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="  ">
        <HeroSection />
        <TopMovies />
   <Trending />
   <Footer />
      </div>
    </main>
  )
}