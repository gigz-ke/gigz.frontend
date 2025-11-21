import { FaTwitter, FaFacebookF, FaLinkedinIn, FaPinterestP, FaInstagram } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { MdAccessibility } from "react-icons/md";

function Footer() {
  return (
    <footer className="bg-white text-gray-600">
      <div className="max-w-[1400px] mx-auto px-4 py-6">

        {/* Top Section */}
        <div className="top flex justify-between flex-wrap gap-8 text-xs">
          {/* Categories */}
          <div className="flex flex-col gap-2 min-w-[120px]">
            <h2 className="font-semibold text-gray-700">Categories</h2>
            <span>Plumbing</span>
            <span>Electrical Work</span>
            <span>Carpentry & Woodwork</span>
            {/* ...other items */}
          </div>

          {/* About */}
          <div className="flex flex-col gap-2 min-w-[120px]">
            <h2 className="font-semibold text-gray-700">About</h2>
            <span>Press & News</span>
            <span>Partnerships</span>
            {/* ...other items */}
          </div>

          {/* Support */}
          <div className="flex flex-col gap-2 min-w-[120px]">
            <h2 className="font-semibold text-gray-700">Support</h2>
            <span>Help & Support</span>
            <span>Trust & Safety</span>
          </div>

          {/* Community */}
          <div className="flex flex-col gap-2 min-w-[120px]">
            <h2 className="font-semibold text-gray-700">Community</h2>
            <span>Customer Success Stories</span>
            <span>Community hub</span>
          </div>

          {/* More From Gigz */}
          <div className="flex flex-col gap-2 min-w-[120px]">
            <h2 className="font-semibold text-gray-700">More From Gigz</h2>
            <span>Gigz Business</span>
            <span>Gigz Pro</span>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Bottom Section */}
        <div className="bottom flex justify-between items-center flex-wrap gap-4 text-xs">
          <div className="left flex items-center gap-3">
            <h2 className="text-sm font-medium">Gigz</h2>
            <span>© Gigz International Ltd. 2025</span>
          </div>

          <div className="right flex items-center gap-4 text-lg">
            {/* Social Icons */}
            <div className="social flex gap-3">
              <FaTwitter />
              <FaFacebookF />
              <FaLinkedinIn />
              <FaPinterestP />
              <FaInstagram />
            </div>

            {/* Language */}
            <IoLanguage />

            {/* Accessibility */}
            <MdAccessibility />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
