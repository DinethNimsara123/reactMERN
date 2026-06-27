import { FaInstagram, FaYoutube, FaTwitter, FaTwitch, FaFacebook, FaDiscord, FaReddit, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#041024] border-t border-gray-800 text-gray-300 py-10 px-6 md:px-12 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Column */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">OUR COMPANY</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><a href="/about-us" className="hover:text-blue-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Store Locations</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Press Releases</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Our Blog</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Partnerships</a></li>
          </ul>
        </div>

        {/* Products/Categories Column */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">CATEGORIES</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Laptops & PCs</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Gaming Gears</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Smartphones</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Audio & Speakers</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Network Devices</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Tech Accessories</a></li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">CUSTOMER SUPPORT</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Order Tracking</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Warranty Policies</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Size Guide</a></li>
            <li><a href="/contact-us" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
          </ul>
        </div>

        {/* Social Icons Column */}
        <div className="space-y-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">STAY CONNECTED</h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">Follow us on our social media platforms for the latest tech updates, daily tech news, and exclusive gadget drops.</p>
          <div className="flex flex-wrap gap-3 text-gray-400">
            <div className="bg-gray-800/50 p-2 rounded-lg cursor-pointer hover:text-white hover:bg-pink-600/30 transition-all"><FaInstagram size={18} /></div>
            <div className="bg-gray-800/50 p-2 rounded-lg cursor-pointer hover:text-white hover:bg-red-600/30 transition-all"><FaYoutube size={18} /></div>
            <div className="bg-gray-800/50 p-2 rounded-lg cursor-pointer hover:text-white hover:bg-sky-500/30 transition-all"><FaTwitter size={18} /></div>
            <div className="bg-gray-800/50 p-2 rounded-lg cursor-pointer hover:text-white hover:bg-purple-600/30 transition-all"><FaTwitch size={18} /></div>
            <div className="bg-gray-800/50 p-2 rounded-lg cursor-pointer hover:text-white hover:bg-blue-600/30 transition-all"><FaFacebook size={18} /></div>
            <div className="bg-gray-800/50 p-2 rounded-lg cursor-pointer hover:text-white hover:bg-indigo-600/30 transition-all"><FaDiscord size={18} /></div>
            <div className="bg-gray-800/50 p-2 rounded-lg cursor-pointer hover:text-white hover:bg-orange-600/30 transition-all"><FaReddit size={18} /></div>
            <div className="bg-gray-800/50 p-2 rounded-lg cursor-pointer hover:text-white hover:bg-black/40 transition-all"><FaTiktok size={18} /></div>
          </div>
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-800/60 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500">
        <span>&copy; {new Date().getFullYear()} All rights reserved by DN Store Digital Hub.</span>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:text-gray-300">Privacy Policy</span>
          <span className="cursor-pointer hover:text-gray-300">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}