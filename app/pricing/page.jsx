import DynamicPricing from "../../components/DynamicPricing";

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-900">
        Plan Your Trip Pricing
      </h1>
      <DynamicPricing basePrice={120} />
    </div>
  );
}
