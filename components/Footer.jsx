import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <Container className="py-10 grid sm:grid-cols-3 gap-8 text-sm text-slate-600">
        <div>
          <div className="text-lg font-semibold mb-2"><span className="text-brand-600">Travel</span>Go</div>
          <p>Curated tours, local experts, and seamless bookings.</p>
        </div>
        <div>
          <div className="font-medium mb-2">Company</div>
          <ul className="space-y-1">
            <li><a href="/why-us" className="hover:text-slate-800">Why us</a></li>
            <li><a href="/tours" className="hover:text-slate-800">Tours</a></li>
            <li><a href="/contact" className="hover:text-slate-800">Contact</a></li>
          </ul>
        </div>
        <div id="contact">
          <div className="font-medium mb-2">Get in touch</div>
          <div>Email: hello@travelgo.test</div>
          <div className="mt-4">© {new Date().getFullYear()} TravelGo</div>
        </div>
      </Container>
    </footer>
  );
}


