import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCog, FaBolt, FaLeaf, FaLightbulb, FaStar, FaPaintBrush, FaTruck, FaTree, FaUserFriends } from "react-icons/fa";

import Hero from "./Hero";
import TrustedBy from "./TrustedBy";
import GigsSlider from "./gigs/GigSlider";
import { useCategory } from "../hooks/useCategory";

const featureIcon = "/hero.png"; 

function Home() {
  const { categories, fetchCategories } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const benefits = [
    { title: "Affordable hiring", desc: "Hire workers based on your budget — no hidden fees." },
    { title: "Fast connections", desc: "Contact workers instantly for urgent jobs or quick tasks." },
    { title: "Verified profiles", desc: "Workers showcase basic skills, experience, and location." },
    { title: "Secure communication", desc: "Chat safely inside Gigz without exposing personal contacts." },
  ];

  const workhubFeatures = [
    "Find workers with verified skills and experience",
    "Match with reliable talent guided by your job needs",
    "Coordinate, communicate, and manage hires effortlessly",
  ];

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("construction")) return <FaCog />;
    if (lower.includes("plumbing")) return <FaBolt />;
    if (lower.includes("cleaning")) return <FaLeaf />;
    if (lower.includes("electrician")) return <FaLightbulb />;
    if (lower.includes("welding")) return <FaStar />;
    if (lower.includes("painting")) return <FaPaintBrush />;
    if (lower.includes("driving")) return <FaTruck />;
    if (lower.includes("farming")) return <FaTree />;
    return <FaUserFriends />; // default
  };

  return (
    <div className="home w-full">
      {/* Hero Section */}
      <Hero />

      {/* Trusted By Section */}
      <TrustedBy />

      {/* Trending Workers */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center md:text-left">
            Trending Workers
          </h2>
          <GigsSlider />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-green-50 py-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-4">
          {/* Left Text */}
          <div className="flex-1 flex flex-col gap-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
              Skilled workers at your fingertips
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-gray-700 font-medium text-lg">
                    <img src={featureIcon} alt="" className="w-6 h-6" />
                    {item.title}
                  </div>
                  <p className="text-gray-500 text-base leading-7">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Video */}
          <div className="flex-1">
            <video
              src="/hero.png"
              controls
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-12 text-center">
            Explore Job Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {!categories || categories.length === 0 ? (
              <p className="text-gray-500 text-center col-span-full">Loading categories...</p>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.id}/gigs`}
                  className="bg-gray-50 flex flex-col items-center justify-center text-center p-6 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 hover:scale-105"
                >
                  <div className="w-16 h-16 flex items-center justify-center text-3xl text-green-600 mb-4">
                    {getIcon(cat.name)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.gigs?.length || 0} gigs</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Gigz WorkHub */}
      <section className="bg-[#0b1536] py-24 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-4">
          {/* Left Text */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-4xl font-semibold">
              Gigz <span className="font-light">WorkHub</span>
            </h2>
            <h3 className="text-3xl md:text-4xl font-semibold">
              A hiring solution built for <span className="font-light">real work</span>
            </h3>
            <p className="text-lg font-light mb-4 text-gray-200">
              Whether you're managing a construction site, running a business,
              or need help at home — find the right worker fast.
            </p>
            <div className="flex flex-col gap-3">
              {workhubFeatures.map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-white text-sm">
                  <img src={featureIcon} alt="" className="w-6 h-6" />
                  {text}
                </div>
              ))}
            </div>
            <Link
              to="/gigs/hub"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-md mt-6 hover:bg-green-600 transition text-center"
            >
              Explore Gigz WorkHub
            </Link>
          </div>

          {/* Right Image */}
          <div className="flex-1">
            <img
              src="/hero.png"
              alt="Gigz WorkHub"
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
