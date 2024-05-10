import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar, { MobileMenu } from "../components/ui/sidebar";
import NavBar from "../components/ui/navbar";
import { useMediaQuery } from "react-responsive";
import { useUserContext } from "../context/AuthContext.jsx";
import AuthApi from "../services/Api/Auth/AuthApi.js";
import "../App.css";
const App = () => {
    const {
        authenticated,
        setUser,
        user,
        setAuthenticated,
        logout: contextLogout,
    } = useUserContext();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        if (authenticated === true) {
            setIsLoading(false);
            AuthApi.getUser()
                .then(({ data }) => {
                    setUser(data);
                    setAuthenticated(true);
                })
                .catch((reason) => {
                    contextLogout();
                });
        } else {
            navigate("/login");
        }
    }, [authenticated]);

    const [open, setOpen] = useState(true);
    const isLargeScreen = useMediaQuery({ query: "(min-width: 1011px)" });
    const isMediumScreen = useMediaQuery({
        query: "(min-width: 768px) and (max-width: 1010px)",
    });
    const isSmallScreen = useMediaQuery({ query: "(max-width: 767px)" });

    const toggleOpen = () => {
        setOpen(!open);
    };

    return (
        <div className="flex h-screen transition-all duration-300 ease-in-out ">
            <div className=" border-r ">
                {isLargeScreen && (
                    <div className="border-r">
                        <SideBar open={open} />
                    </div>
                )}

                {(isMediumScreen || isSmallScreen) && (
                    <div className="lg:hidden">
                        <MobileMenu open={open} />
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header>
                    <NavBar open={open} toggleOpen={toggleOpen} />
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto  p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default App;
