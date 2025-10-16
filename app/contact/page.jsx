export const metadata = { 
  title: "Contact Us – TravelGo" 
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center px-6 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
          Contact Us
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          We’d love to hear from you! Whether you have questions, feedback, or
          ideas, our team is here to help. Just drop us a message below.
        </p>
      </div>

      {/* Contact Form */}
      <form className="w-full max-w-2xl bg-slate-800/60 p-8 rounded-2xl shadow-xl border border-slate-700 backdrop-blur-md space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <input
            placeholder="Full Name"
            className="w-full rounded-lg border border-slate-600 bg-slate-900/50 p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none transition"
          />
          <input
            placeholder="Email"
            type="email"
            className="w-full rounded-lg border border-slate-600 bg-slate-900/50 p-3 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400 outline-none transition"
          />
        </div>

        <input
          placeholder="Subject"
          className="w-full rounded-lg border border-slate-600 bg-slate-900/50 p-3 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 outline-none transition"
        />

        <textarea
          placeholder="Your Message"
          rows={5}
          className="w-full rounded-lg border border-slate-600 bg-slate-900/50 p-3 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400 outline-none transition"
        ></textarea>

        <button className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold py-3 rounded-lg shadow-lg hover:opacity-90 transition">
          Send Message
        </button>
      </form>

      {/* Extra Info */}
      <div className="mt-12 text-center text-gray-400">
        <p>📍 123 Travel Street, Adventure City</p>
        <p>📧 support@travelgo.com</p>
        <p>📞 +1 (555) 123-4567</p>
      </div>
    </div>
  );
}
