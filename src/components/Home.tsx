import GigsSlider from "./gigs/GigSlider";
import Hero from "./Hero";
import TrustedBy from "./TrustedBy";

function Home() {
  return (
    <div className="home w-full">

      <Hero />

      <TrustedBy />

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
            Trending Workers
          </h2>
          <GigsSlider />
        </div>
      </section>

      <section className="bg-green-50 py-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-4">

          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-3xl font-semibold text-gray-800">
              Skilled workers at your fingertips
            </h2>

            {[
              {
                title: "Affordable hiring",
                desc: "Hire workers based on your budget — no hidden fees."
              },
              {
                title: "Fast connections",
                desc: "Contact workers instantly for urgent jobs or quick tasks."
              },
              {
                title: "Verified profiles",
                desc: "Workers showcase basic skills, experience, and location."
              },
              {
                title: "Secure communication",
                desc: "Chat safely inside Gigz without exposing personal contacts."
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-gray-700 font-medium text-lg">
                  <img src="/img/check.png" alt="" className="w-6 h-6" />
                  {item.title}
                </div>
                <p className="text-gray-500 text-base leading-7">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex-1">
            <video
              src="/img/video.mp4"
              controls
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl text-gray-800 font-semibold mb-12 text-center">
            Explore Job Categories
          </h2>

          <div className="flex flex-wrap justify-center gap-8">

            {[
              "Construction",
              "House Cleaning",
              "Plumbing",
              "Electricians",
              "Welding",
              "Painting",
              "Farming & Fieldwork",
              "Driving & Delivery",
              "Repairs",
              "General Labor"
            ].map((name, index) => (
              <div
                key={index}
                className="w-52 h-36 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50 rounded-xl p-4 hover:shadow-xl transition group"
              >
                <img
                  src="https://via.placeholder.com/55"
                  alt={name}
                  className="w-12 h-12 mb-2 opacity-70 group-hover:opacity-100 transition"
                />

                <div className="w-12 h-0.5 bg-gray-300 group-hover:w-20 group-hover:bg-green-600 transition-all duration-300 mb-2"></div>

                <span className="text-gray-700 font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b1536] py-24 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-4">
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-4xl font-semibold">Gigz <span className="font-light">WorkHub</span></h2>
            <h3 className="text-3xl md:text-4xl font-semibold mb-4">
              A hiring solution built for <span className="font-light">real work</span>
            </h3>

            <p className="text-lg font-light mb-4 text-gray-200">
              Whether you're managing a construction site, running a business,
              or need help at home — find the right worker fast.
            </p>

            {[
              "Find workers with verified skills and experience",
              "Match with reliable talent guided by your job needs",
              "Coordinate, communicate, and manage hires effortlessly"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-white text-sm">
                <img src="/img/check.png" alt="" className="w-6 h-6" />
                {text}
              </div>
            ))}

            <button className="bg-green-500 text-white px-6 py-3 rounded-md mt-6 hover:bg-green-600 transition">
              Explore Gigz WorkHub
            </button>
          </div>

          <div className="flex-1">
            <img
              src="https://via.placeholder.com/850x420"
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
