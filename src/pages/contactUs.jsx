import React, { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-white py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-cyan-400 border-b border-cyan-800 pb-4">
          Contact Us
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Have questions or need help building your dream PC? Reach out to us anytime!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-6 bg-[#112240] p-8 rounded-xl border border-gray-700 h-fit">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Get in Touch</h2>
            <div className="flex items-start space-x-4">
              <span className="text-2xl">📍</span>
              <div>
                <h4 className="font-bold text-gray-300">Our Location</h4>
                <p className="text-gray-400">No. 123, Tech Street, Colombo 03, Sri Lanka.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-2xl">📞</span>
              <div>
                <h4 className="font-bold text-gray-300">Phone Support</h4>
                <p className="text-gray-400">+94 11 000 0000 / +94 77 111 1111</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-2xl">✉️</span>
              <div>
                <h4 className="font-bold text-gray-300">Email Address</h4>
                <p className="text-gray-400">support@dnstore.example.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-[#112240] p-8 rounded-xl border border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#0a192f] border border-gray-600 text-white focus:outline-none focus:border-cyan-400"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#0a192f] border border-gray-600 text-white focus:outline-none focus:border-cyan-400"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#0a192f] border border-gray-600 text-white focus:outline-none focus:border-cyan-400 resize-none"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}