
const ManImage = "/hero.png";

const Hero = () => {
  const popularServices = [
    "House Cleaning",
    "Plumbing",
    "Electrical Work",
    "Carpentry",
  ];

  return (
    <div className="bg-green-900 text-white min-h-[500px] flex items-center relative overflow-hidden">
      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between w-full py-16 relative z-10">
        
        {/* Left Side: Text and Search */}
        <div className="max-w-lg mb-10 md:mb-0">
          <h1 className="text-5xl font-extrabold leading-tight">
            Find the perfect{" "}
            <span className="font-serif italic text-green-300">bluecollar</span>{" "}
            services for you
          </h1>

          {/* Search Bar */}
          <div className="mt-8">
            <div className="flex w-full">
              <input
                type="text"
                placeholder='Try "laundry"'
                className="grow p-4 text-black text-lg border-2 border-r-0 border-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
              <button className="px-6 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-r-md transition duration-300">
                Search
              </button>
            </div>
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

        {/* Right Side: Image */}
        <div className="md:w-1/2 relative flex justify-end">
          <img
            src={ManImage}
            alt="Smiling man ready for service"
            className="w-[500px] max-w-none h-auto object-cover absolute -right-16 md:relative md:right-0 md:w-full md:max-w-sm"
          />
        </div>
      </div>

      {/* Optional: Decorative background for extra design */}
      <div className="absolute top-0 left-0 w-full h-full bg-green-900 opacity-80 z-0"></div>
    </div>
  );
};

export default Hero;
