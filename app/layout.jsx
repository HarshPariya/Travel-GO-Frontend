import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ThemeProvider } from "../components/ThemeProvider";
import Chatbot from "../components/Chatbot";
import AuthGuard from "../components/AuthGuard";

export const metadata = {
  title: "Travel Agency",
  description: "Explore amazing tours and book your next adventure",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-6">
            <AuthGuard>{children}</AuthGuard>
          </main>
          <Footer />
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
