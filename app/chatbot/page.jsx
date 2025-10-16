import Chatbot from "../../components/Chatbot";

export default function ChatbotPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        AI Travel Assistant
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        Tell our assistant your <span className="font-semibold">budget</span> and{" "}
        <span className="font-semibold">interests</span> to get personalized travel suggestions!
      </p>
      <Chatbot />
    </div>
  );
}
