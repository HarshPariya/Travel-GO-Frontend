"use client";
import { useState } from "react";
import AuthModal from "../../components/AuthModal";
import { tokenManager } from "../../lib/auth";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // if the user is already logged in, send them to the home/profile page
    if (tokenManager.getToken()) {
      router.replace("/");
    }
  }, [router]);

  const handleClose = () => {
    setIsOpen(false);
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <AuthModal isOpen={isOpen} onClose={handleClose} mode="login" />
    </div>
  );
}
