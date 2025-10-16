export const metadata = {
  title: "About Us – TravelGo",
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
          About TravelGo
        </h1>
        <p className="max-w-3xl text-gray-300 text-lg leading-relaxed">
          Welcome to <span className="text-blue-400 font-semibold">TravelGo</span> – 
          your trusted travel companion. We believe travel is more than just visiting places — 
          it’s about creating experiences, embracing cultures, and making memories that last forever.
        </p>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-slate-800/60 p-10 rounded-2xl shadow-lg border border-slate-700">
          <h2 className="text-3xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">
            Our Story
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Founded with a passion for exploration, TravelGo was created to make discovering 
            the world easier, more enjoyable, and stress-free. From breathtaking landscapes 
            to cultural adventures, we strive to bring you closer to the wonders of our planet. 
            Our team works tirelessly to provide curated experiences that inspire and connect people.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        <div className="bg-slate-800/60 p-8 rounded-2xl shadow-lg border border-slate-700 hover:border-blue-400 transition">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Our Mission
          </h2>
          <p className="text-gray-300 leading-relaxed">
            To make travel simple, enjoyable, and memorable by offering 
            personalized itineraries, trusted guides, and seamless services 
            tailored to every traveler’s needs.
          </p>
        </div>
        <div className="bg-slate-800/60 p-8 rounded-2xl shadow-lg border border-slate-700 hover:border-teal-400 transition">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">
            Our Vision
          </h2>
          <p className="text-gray-300 leading-relaxed">
            To become the most loved and trusted travel companion, inspiring 
            people to explore the world responsibly and sustainably for generations to come.
          </p>
        </div>
      </section>

      {/* Closing Section */}
      <section className="text-center py-20 px-6 border-t border-slate-700">
        <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
          Let’s Explore Together!
        </h2>
        <p className="max-w-2xl mx-auto text-gray-300 text-lg leading-relaxed">
          With <span className="text-blue-400 font-semibold">TravelGo</span>, 
          every journey becomes a story worth sharing. 
          Let’s make your next adventure unforgettable.
        </p>
      </section>
    </div>
  );
}
