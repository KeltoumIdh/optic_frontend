import "./App.css";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AuthContext from "./context/AuthContext";
import { useEffect } from "react";

function App() {
  // Initialize dark mode based on localStorage or system preference
  useEffect(() => {
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (localStorage.getItem("theme") === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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
