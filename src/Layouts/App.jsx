import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SideBar, { MobileMenu } from "../components/ui/sidebar";
import NavBar from "../components/ui/navbar";
import { useMediaQuery } from "react-responsive";
import "../App.css";
import { useAuth } from "@/hooks/useAuth";

const App = () => {
  const { authUser } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });
  const [open, setOpen] = useState(isLargeScreen);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const [openMobileSideBar, setOpenMobileSideBar] = useState(false);
  const toggleMobileSideBar = () => setOpenMobileSideBar(!openMobileSideBar);

  useEffect(() => {
    if (!authUser.isLoading) {
      if (!authUser.data) {
        if (path !== "/login") {
          navigate("/login", { replace: true });
        }
      }
    }
  }, [authUser, navigate, path]);

  // Close sidebar on small screens when resizing
  useEffect(() => {
    if (!isLargeScreen) {
      setOpen(false);
    }
  }, [isLargeScreen]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out">
      {/* Desktop sidebar - hidden on small screens */}
      <div
        className={`hidden lg:block ${
          open ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out`}
      >
        <SideBar open={open} />
      </div>

      {/* Mobile sidebar overlay */}
      {openMobileSideBar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={toggleMobileSideBar}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white   shadow-lg">
            <MobileMenu toggleMobileSideBar={toggleMobileSideBar} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 bg-white   border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <NavBar
            open={open}
            toggleOpen={toggleOpen}
            openMobileSideBar={openMobileSideBar}
            toggleMobileSideBar={toggleMobileSideBar}
          />
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;
