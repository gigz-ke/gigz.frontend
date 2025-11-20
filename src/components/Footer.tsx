import { FaTwitter, FaFacebookF, FaLinkedinIn, FaPinterestP, FaInstagram } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5"; // language icon
import { MdAccessibility } from "react-icons/md"; // accessibility icon

function Footer() {
  return (
    <div className="footer flex justify-center text-gray-600 my-12">
      <div className="max-w-[1400px] w-full">

        {/* Top Section */}
        <div className="top flex justify-between flex-wrap gap-8">
          {/* Categories */}
          <div className="flex flex-col gap-5 min-w-[150px]">
            <h2 className="text-sm text-gray-700">Categories</h2>
            <span className="font-light">Plumbing</span>
            <span className="font-light">Electrical Work</span>
            <span className="font-light">Carpentry & Woodwork</span>
            <span className="font-light">Home & Office Cleaning</span>
            <span className="font-light">Construction & Masonry</span>
            <span className="font-light">Vehicle Repair & Mechanics</span>
            <span className="font-light">Landscaping & Gardening</span>
            <span className="font-light">Painting & Renovation</span>
            <span className="font-light">Moving Services</span>
            <span className="font-light">Security Services</span>
            <span className="font-light">Sitemap</span>
          </div>

          {/* About */}
          <div className="flex flex-col gap-5 min-w-[150px]">
            <h2 className="text-sm text-gray-700">About</h2>
            <span className="font-light">Press & News</span>
            <span className="font-light">Partnerships</span>
            <span className="font-light">Privacy Policy</span>
            <span className="font-light">Terms of Service</span>
            <span className="font-light">Intellectual Property Claims</span>
            <span className="font-light">Investor Relations</span>
            <span className="font-light">Contact Sales</span>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-5 min-w-[150px]">
            <h2 className="text-sm text-gray-700">Support</h2>
            <span className="font-light">Help & Support</span>
            <span className="font-light">Trust & Safety</span>
            <span className="font-light">Selling on Gigz</span>
            <span className="font-light">Buying on Gigz</span>
          </div>

          {/* Community */}
          <div className="flex flex-col gap-5 min-w-[150px]">
            <h2 className="text-sm text-gray-700">Community</h2>
            <span className="font-light">Customer Success Stories</span>
            <span className="font-light">Community hub</span>
            <span className="font-light">Forum</span>
            <span className="font-light">Events</span>
            <span className="font-light">Blog</span>
            <span className="font-light">Influencers</span>
            <span className="font-light">Affiliates</span>
            <span className="font-light">Podcast</span>
            <span className="font-light">Invite a Friend</span>
            <span className="font-light">Become a Seller</span>
            <span className="font-light">Community Standards</span>
          </div>

          {/* More From Gigz */}
          <div className="flex flex-col gap-5 min-w-[150px]">
            <h2 className="text-sm text-gray-700">More From Gigz</h2>
            <span className="font-light">Gigz Business</span>
            <span className="font-light">Gigz Pro</span>
            <span className="font-light">Gigz Logo Maker</span>
            <span className="font-light">Gigz Guides</span>
            <span className="font-light">Get Inspired</span>
            <span className="font-light">Gigz Select</span>
            <span className="font-light">ClearVoice</span>
            <span className="font-light">Gigz Workspace</span>
            <span className="font-light">Learn</span>
            <span className="font-light">Working Not Working</span>
          </div>
        </div>

        <hr className="my-12 border-gray-200" />

        {/* Bottom Section */}
        <div className="bottom flex justify-between items-center flex-wrap gap-6">
          {/* Left */}
          <div className="left flex items-center gap-5">
            <h2 className="text-lg font-medium">Gigz</h2>
            <span className="text-xs whitespace-nowrap">© Gigz International Ltd. 2025</span>
          </div>

          {/* Right */}
          <div className="right flex items-center gap-8">
            {/* Social Icons */}
            <div className="social flex gap-5 text-gray-600 text-lg">
              <FaTwitter />
              <FaFacebookF />
              <FaLinkedinIn />
              <FaPinterestP />
              <FaInstagram />
            </div>

            {/* Language */}
            <div className="link flex items-center gap-2 text-gray-600 text-lg">
              <IoLanguage />
            </div>

            {/* Accessibility */}
            <MdAccessibility className="text-gray-600 text-lg" />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Footer;
