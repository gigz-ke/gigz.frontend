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

  // Filter gigs and categories
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

  // Close dropdown on outside click
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
    <section className="relative bg-green-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between py-16 md:py-24 relative z-10">
        {/* Left */}
        <div className="w-full md:w-1/2 max-w-full md:max-w-lg mb-10 md:mb-0 flex flex-col">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Find the perfect{" "}
            <span className="font-serif italic text-green-300">bluecollar</span>{" "}
            services for you
          </h1>

          {/* Search */}
          <div className="mt-8 relative w-full" ref={dropdownRef}>
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-0">
              <input
                type="text"
                placeholder='Try "laundry"'
                className="flex-1 p-4 text-black text-lg border-2 border-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 w-full sm:rounded-r-none sm:rounded-l-md"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => searchTerm && setShowDropdown(true)}
              />
              <button
                className="w-full sm:w-auto px-6 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-md sm:rounded-l-none sm:rounded-r-md transition duration-300"
                onClick={() => {
                  if (results.length > 0) handleSelect(results[0]);
                }}
              >
                Search
              </button>
            </div>

            {showDropdown && results.length > 0 && (
              <ul className="absolute left-0 right-0 w-full bg-white text-black mt-1 rounded-md shadow-xl max-h-60 overflow-y-auto z-20">
                {results.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    className="px-4 py-2 hover:bg-green-100 cursor-pointer transition"
                    onClick={() => handleSelect(item)}
                  >
                    <span className="font-semibold">{item.name}</span>{" "}
                    <span className="text-sm text-gray-500">({item.type})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Popular Tags */}
          <div className="mt-4 flex flex-wrap items-center">
            <span className="text-sm font-semibold mr-2">Popular:</span>
            {popularServices.map((service, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-sm border border-green-500 rounded-full cursor-pointer hover:bg-green-700 hover:text-white transition duration-150 mr-2 mt-2"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img
            src={ManImage}
            alt="Smiling man ready for service"
            className="w-full max-w-sm h-auto object-cover"
          />
        </div>
      </div>

      {/* Background overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-green-900 opacity-80 z-0"></div>
    </section>
  );
};

export default Hero;
