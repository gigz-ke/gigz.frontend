import React from "react";

const TrustedBy: React.FC = () => {
  const logos = [
    "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/facebook2x.188a797.png",
    "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/google2x.06d74c8.png",
    "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/netflix2x.887e47e.png",
    "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/pandg2x.6dc32e4.png",
    "https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/paypal2x.22728be.png"
  ];

  return (
    <div className="bg-gray-50 h-24 flex justify-center">
      <div className="flex items-center gap-5 max-w-3xl w-full px-4 text-gray-400 font-medium">
        <span>Trusted by:</span>
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index + 1}`}
            className="h-12 object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default TrustedBy;
