import Image from "next/image";
import Navbar from "@/modules/home/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-[#0b0f14] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Welcome to the{" "}
            <span className="text-cyan-400">Metaverse</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">
            Create, explore, and connect in immersive virtual spaces. 
            Build your own world and interact with others in real-time.
          </p>
          <div className="flex gap-4 mt-8">
            <Link
              href="/spaces"
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
            >
              Explore Spaces
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-transparent border-2 border-cyan-500 hover:bg-cyan-500/10 text-cyan-400 font-semibold rounded-lg transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Why Choose <span className="text-cyan-400">Our Platform</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#151a21] p-8 rounded-xl border border-gray-800 hover:border-cyan-500 transition-all duration-300">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Real-Time Interaction</h3>
            <p className="text-gray-400">
              Connect with users in real-time through WebSocket technology. See others move and interact instantly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#151a21] p-8 rounded-xl border border-gray-800 hover:border-cyan-500 transition-all duration-300">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Customizable Spaces</h3>
            <p className="text-gray-400">
              Create and customize your own virtual spaces with various elements, layouts, and themes.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#151a21] p-8 rounded-xl border border-gray-800 hover:border-cyan-500 transition-all duration-300">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Avatar System</h3>
            <p className="text-gray-400">
              Choose from various avatars and express yourself in the virtual world with animated movements.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Enter the Metaverse?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users creating and exploring virtual spaces. Start your journey today.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2024 Metaverse Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}