// Hero.tsx
import { useState, useEffect, useRef } from "react";
import { useGigs } from "../hooks/useGigs";
import { useCategory } from "../hooks/useCategory";
import { useNavigate } from "react-router-dom";

const ManImage = "/hero.png";

const Hero = () => {
  const { gigs } = useGigs();
  const { categories } = useCategory();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<{ type: "gig" | "category"; id: string; name: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter gigs and categories as user types
  useEffect(() => {
    if (!searchTerm) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();

    const matchedGigs = gigs
      .filter((g) => g.title.toLowerCase().includes(term))
      .map((g) => ({ type: "gig" as const, id: g._id, name: g.title }));

    const matchedCategories = categories
      .filter((c) => c.name.toLowerCase().includes(term))
      .map((c) => ({ type: "category" as const, id: c.id, name: c.name }));

    setResults([...matchedGigs, ...matchedCategories]);
  }, [searchTerm, gigs, categories]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: { type: "gig" | "category"; id: string }) => {
    if (item.type === "gig") navigate(`/gigs/${item.id}`);
    else navigate(`/categories/${item.id}/gigs`);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const popularServices = ["House Cleaning", "Plumbing", "Electrical Work", "Carpentry"];

  return (
    <div className="bg-green-900 text-white min-h-[500px] flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between w-full py-16 relative z-10">
        {/* Left Side */}
        <div className="max-w-lg mb-10 md:mb-0">
          <h1 className="text-5xl font-extrabold leading-tight">
            Find the perfect{" "}
            <span className="font-serif italic text-green-300">bluecollar</span>{" "}
            services for you
          </h1>

          {/* Search Bar */}
          <div className="mt-8 relative" ref={dropdownRef}>
            <div className="flex w-full">
              <input
                type="text"
                placeholder='Try "laundry"'
                className="grow p-4 text-black text-lg border-2 border-r-0 border-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => searchTerm && setShowDropdown(true)}
              />
              <button
                className="px-6 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-r-md transition duration-300"
                onClick={() => {
                  if (results.length > 0) handleSelect(results[0]);
                }}
              >
                Search
              </button>
            </div>

            {/* Dropdown */}
            {showDropdown && results.length > 0 && (
              <ul className="absolute w-full bg-white text-black mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto z-20">
                {results.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleSelect(item)}
                  >
                    <span className="font-semibold">{item.name}</span>{" "}
                    <span className="text-sm text-gray-500">({item.type})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Popular Services Tags */}
          <div className="mt-4 flex flex-wrap items-center">
            <span className="text-sm font-semibold mr-2">Popular:</span>
            {popularServices.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm border border-green-500 rounded-full cursor-pointer hover:bg-green-700 transition duration-150 mr-2 mt-2"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 relative flex justify-end">
          <img
            src={ManImage}
            alt="Smiling man ready for service"
            className="w-[500px] max-w-none h-auto object-cover absolute -right-16 md:relative md:right-0 md:w-full md:max-w-sm"
          />
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-green-900 opacity-80 z-0"></div>
    </div>
  );
};

export default Hero;
