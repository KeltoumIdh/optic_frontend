import "./App.css";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AuthContext from "./context/AuthContext";

function App() {
  return (
    <AuthContext>
        <Toaster />
        <RouterProvider router={router} />
    </AuthContext>
  );
}

export default App;
