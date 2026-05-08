import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#FF8C00] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-2xl font-bold mb-4">Explore Mumbai</h3>
          <p className="text-sm text-white/90 leading-relaxed">
            Discover the best places, eateries, and hidden gems in the city with curated recommendations and local favorites.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-white/90">
            <li className="hover:text-white transition-colors">All places</li>
            <li className="hover:text-white transition-colors">Neighbourhoods</li>
            <li className="hover:text-white transition-colors">Hidden gems</li>
            <li className="hover:text-white transition-colors">Beaches</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
          <ul className="space-y-2 text-white/90">
            <li>Email: <a href="mailto:info@mumbai.com" className="underline hover:text-white">info@mumbai.com</a></li>
            <li>Phone: <a href="tel:+919876543210" className="underline hover:text-white">+91 98765 43210</a></li>
            <li className="mt-4 text-sm text-white/80">Follow us for local tips and updates.</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20 py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-white/80">
          <p>© 2026 Explore Mumbai. All rights reserved.</p>
          <p className="font-semibold">Made by Aarya</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
