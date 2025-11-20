import GigsSlider from "./gigs/GigSlider";
import Hero from "./Hero";
import TrustedBy from "./TrustedBy";

function Home() {
  return (
    <div className="home w-full">

      {/* Hero Section */}
      <Hero />

      {/* Trusted By Section */}
      <TrustedBy />

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Trending Gigs</h2>
          <GigsSlider />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-green-50 py-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-4">
          {/* Left Features */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-3xl font-semibold">
              A whole world of freelance talent at your fingertips
            </h2>

            {[
              "The best for every budget",
              "Quality work done quickly",
              "Protected payments, every time",
              "24/7 support"
            ].map((text, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-gray-700 font-medium text-lg">
                  <img src="./img/check.png" alt="" className="w-6 h-6" />
                  {text}
                </div>
                <p className="text-gray-500 text-base font-light leading-7">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. This is description for "{text}".
                </p>
              </div>
            ))}
          </div>

          {/* Right Video */}
          <div className="flex-1">
            <video src="./img/video.mp4" controls className="w-full rounded-md shadow-lg" />
          </div>
        </div>
      </section>

      {/* Explore Marketplace */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-gray-700 text-3xl font-semibold mb-12 text-center">Explore the marketplace</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              "Graphics & Design",
              "Digital Marketing",
              "Writing & Translation",
              "Video & Animation",
              "Music & Audio",
              "Programming & Tech",
              "Business",
              "Lifestyle",
              "Data",
              "Photography"
            ].map((name, index) => (
              <div key={index} className="w-60 h-36 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50 rounded-lg p-4 hover:shadow-lg transition">
                <img src="https://via.placeholder.com/50" alt={name} className="w-12 h-12 mb-2" />
                <div className="w-12 h-0.5 bg-gray-300 transition-all duration-300 hover:w-20 hover:bg-green-500 mb-2"></div>
                <span className="font-light text-gray-700">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Features Section */}
      <section className="bg-[#0d084d] py-24 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-4">
          {/* Left */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-4xl font-medium">liverr <i className="font-light">business</i></h2>
            <h3 className="text-4xl font-medium mb-4">A business solution designed for <i className="font-light">teams</i></h3>
            <p className="text-lg font-light mb-4">
              Upgrade to a curated experience packed with tools and benefits, dedicated to businesses
            </p>

            {[
              "Connect to freelancers with proven business experience",
              "Get matched with the perfect talent by a customer success manager",
              "Manage teamwork and boost productivity with one powerful workspace"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-white font-light text-sm">
                <img src="./img/check.png" alt="" className="w-6 h-6" />
                {text}
              </div>
            ))}

            <button className="bg-green-500 text-white px-6 py-3 rounded-md mt-6 hover:bg-green-600 transition">
              Explore Liverr Business
            </button>
          </div>

          {/* Right */}
          <div className="flex-1">
            <img
              src="https://via.placeholder.com/870x400"
              alt="Business"
              className="w-full rounded-md shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Projects Slide */}
      <section className="py-12 overflow-x-auto scrollbar-hide bg-gray-50">
        <div className="flex gap-6 max-w-7xl mx-auto px-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="min-w-[300px] bg-white rounded-lg p-4 cursor-pointer shadow hover:shadow-lg transition">
              <img src="https://via.placeholder.com/300x200" alt={`Project ${index + 1}`} className="w-full h-48 object-cover rounded-md mb-2" />
              <h3 className="text-lg font-medium">Project {index + 1}</h3>
              <p className="text-gray-500 font-light text-sm mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;
