import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-black -z-10" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />

      <Container className="py-12 sm:py-16 lg:py-24 xl:py-32">
        <div className="grid gap-8 lg:gap-16 xl:gap-20 lg:grid-cols-2 items-center relative">
          {/* Text Section */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Trusted by 10,000+ travelers worldwide
            </div>

            <h1 className="text-responsive-3xl lg:text-responsive-4xl font-extrabold leading-tight tracking-tight">
              <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 bg-clip-text text-transparent animate-gradient">
                Explore the World
              </span>
              <span className="block mt-2 lg:mt-3 text-gray-900 dark:text-white">
                Adventures Await You
              </span>
            </h1>

            <p className="text-responsive-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              From breathtaking beaches to hidden gems, we bring you handpicked 
              destinations and seamless travel experiences. Start your unforgettable 
              journey with us today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Link
                href="/tours"
                className="btn-primary btn-mobile bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 hover:from-blue-700 hover:via-cyan-600 hover:to-emerald-500 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">🌍</span>
                Explore Tours
              </Link>
              <Link
                href="/contact"
                className="btn-secondary btn-mobile border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">📩</span>
                Contact Us
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 lg:pt-12">
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Destinations</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Travelers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">4.9★</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative h-80 sm:h-96 lg:h-[32rem] xl:h-[36rem] group order-first lg:order-last">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-emerald-400/20 blur-2xl opacity-70 group-hover:opacity-90 transition duration-500" />
            
            {/* Main image */}
            <div className="relative h-full w-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhdmVsJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww"
                alt="Tropical Beach Paradise"
                fill
                className="object-cover transform group-hover:scale-105 transition duration-700"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80 animate-bounce-slow hidden lg:block" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-80 animate-pulse-slow hidden lg:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}
