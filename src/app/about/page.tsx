import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gray-100">
      {/* Hero Section */}
      <div className="mb-8 flex flex-col items-center">
        <Image
          src="/logo.png" // Replace with your logo path
          alt="Review Film Logo"
          width={180}
          height={180}
        
        />
        <h1 className="text-5xl font-extrabold text-gray-900 mt-4">About Us</h1>
        <p className="text-lg text-gray-600 mt-2 max-w-2xl text-center">
          Welcome to <span className="font-semibold">Review Film</span> – your ultimate destination for in-depth movie reviews, recommendations, and discussions!
        </p>
      </div>

      {/* Mission Statement */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h2>
        <p className="text-gray-600">
          At <span className="font-medium">Review Film</span>, we believe that movies are more than just entertainment—they are an art form that inspires, educates, and connects people.
          Our mission is to provide insightful and honest reviews that help you discover amazing films and deepen your appreciation for cinema.
        </p>
      </div>

      {/* Features Section */}
      <div className="mt-8 max-w-4xl">
        <h2 className="text-3xl font-semibold text-gray-800 text-center">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-900">Honest Reviews</h3>
            <p className="text-gray-600 mt-2">
              Get unbiased and in-depth reviews of the latest movies, from blockbusters to indie gems.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-900">Top Recommendations</h3>
            <p className="text-gray-600 mt-2">
              Discover must-watch films based on expert and community recommendations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-900">Community Discussions</h3>
            <p className="text-gray-600 mt-2">
              Join passionate discussions with fellow movie lovers and share your thoughts on the latest releases.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Join Us!</h2>
        <p className="text-gray-600 mt-2">
          Whether you're a casual viewer or a hardcore cinephile, there's a place for you in our community.
        </p>
        <Link href="/">
        <button className="mt-4 px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition">
            Explore Reviews
          </button>
        </Link>
      </div>
    </div>
  );
}
