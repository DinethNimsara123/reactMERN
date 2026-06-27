import React from 'react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#0a192f] text-white py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400 border-b border-cyan-800 pb-4">
          About Us
        </h1>
        
        <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
          <p>
            Welcome to <span className="text-cyan-300 font-semibold">DN Store</span>, your premier destination for high-performance laptops, gaming PCs, and cutting-edge tech accessories. We are passionate about bringing the latest technology directly to tech enthusiasts, gamers, and professionals.
          </p>
          
          <div className="bg-[#112240] p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-3">Our Mission</h2>
            <p>
              Our mission is to "Build Your Dream PC" by offering premium components, exceptional customer service, and reliable tech solutions. We ensure that every product we deliver meets the highest industry standards for performance and durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="text-center p-4 bg-[#112240] rounded-lg border border-gray-700">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold text-white mb-1">Fast Delivery</h3>
              <p className="text-sm text-gray-400">Quick and secure shipping right to your doorstep.</p>
            </div>
            <div className="text-center p-4 bg-[#112240] rounded-lg border border-gray-700">
              <div className="text-3xl mb-2">💎</div>
              <h3 className="font-bold text-white mb-1">Premium Quality</h3>
              <p className="text-sm text-gray-400">100% genuine gaming gear and tech accessories.</p>
            </div>
            <div className="text-center p-4 bg-[#112240] rounded-lg border border-gray-700">
              <div className="text-3xl mb-2">🎧</div>
              <h3 className="font-bold text-white mb-1">Expert Support</h3>
              <p className="text-sm text-gray-400">Dedicated assistance to help you choose the right PC.</p>
            </div>
          </div>

          <p className="pt-4 border-t border-gray-700 text-center text-gray-400">
            Thank you for choosing DN Store as your trusted tech partner. Let's build your dream setup today!
          </p>
        </div>
      </div>
    </div>
  );
}