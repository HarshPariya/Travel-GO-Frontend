import Container from "./Container";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white">
      <Container className="py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Text Section */}
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to explore?
          </h2>
          <p className="text-indigo-100 mt-2 text-lg">
            Find your perfect tour and book in minutes.
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/tours"
          className="inline-block rounded-xl bg-white px-6 py-3 text-base font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50 hover:shadow-xl transition-all duration-300"
        >
          Browse Tours
        </Link>
      </Container>
    </section>
  );
}
