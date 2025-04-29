import "./App.css";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AuthContext from "./context/AuthContext";
import { useEffect } from "react";

function App() {
  // Initialize dark mode based on localStorage or system preference
  useEffect(() => {
    // Get theme from localStorage, defaulting to 'light' if not set
    const savedTheme = localStorage.getItem("theme");

    // Only use dark mode if explicitly set to "dark" in localStorage
    const isDarkMode = savedTheme === "dark";

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      // Ensure light mode is set in localStorage
      if (!savedTheme) localStorage.setItem("theme", "light");
    }
  }, []);

  return (
    <AuthContext>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Toaster />
        <RouterProvider router={router} />
      </div>
    </AuthContext>
  );
}

export default App;
