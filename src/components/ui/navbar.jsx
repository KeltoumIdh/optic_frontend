import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, LogOutIcon, Menu } from "lucide-react";

import { Button } from "./button";
import { useUserContext } from "../../context/AuthContext";
import Profile from "../../pages/profile";
import { Navigate, useNavigate } from "react-router-dom";
// import LanguagePicker from "./language_picker";

const NavBar = ({ open, toggleOpen }) => {
    const { logout: contextLogout, user } = useUserContext();
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate("/profile");
        console.log(user.email);
    };
    const { name, email, role } = user;
    return (
        <div className="sticky top-0 mb-3 p-2 h-[4em] w-full shadow-md flex justify-between items-center">
            <div className="flex flex-row justify-center items-center">
                <Button variant={"ghost"} onClick={toggleOpen}>
                    {open ? <ChevronLeft /> : <Menu />}
                </Button>
            </div>
            <div className="flex justify-center items-center flex-row gap-3 mr-3">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        {/* <LanguagePicker /> */}
                        <Avatar>
                            <AvatarImage className=' border-2 border-red-400 rounded-full' src="http://localhost:8000/assets/uploads/clients/default.jpg" />
                            <AvatarFallback>Admin</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleNavigate}>
                            profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 text-red-500 cursor-pointer"
                            onClick={contextLogout}
                        >
                            <LogOutIcon />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <p>{email}</p>
            </div>
        </div>
    );
};

export default NavBar;
