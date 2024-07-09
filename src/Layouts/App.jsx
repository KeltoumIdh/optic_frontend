import React, { useState, useEffect } from "react";
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

  const [open, setOpen] = useState(true);
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1011px)" })

  const toggleOpen = () => {
    setOpen(!open);
  };

  const [openMobileSideBar, setOpenMobileSideBar] = useState(false);
  const toggleMobileSideBar = () => setOpenMobileSideBar(!openMobileSideBar);

  useEffect(() => {
    if (!authUser.isLoading) {
      if (!authUser.data) {
        if (path != "/login") {
          navigate("/login", { replace: true });
        }
      }
    }
  }, [authUser]);

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out ">
      <div className=" border-r ">
        
        {/* SideBar for Large Devices */}
        <SideBar open={open} />

        {/* SideBar for Small Devices */}
        {openMobileSideBar && <MobileMenu toggleMobileSideBar={toggleMobileSideBar} />}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header>
          <NavBar open={open} toggleOpen={toggleOpen} openMobileSideBar={openMobileSideBar} toggleMobileSideBar={toggleMobileSideBar} />
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto  p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;
