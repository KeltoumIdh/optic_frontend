import React from "react";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
// import LanguagePicker from "./language_picker";


const NavBar = ({ open, toggleOpen }) => {
    const { authUser, logout } = useAuth()

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/profile");
        console.log(user.email);
    };

    const { name, email, role } = authUser?.data ?? {};

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
                        <div className="flex items-center gap-2">
                            {/* <LanguagePicker /> */}
                            <Avatar>
                                <AvatarImage className=' border-2 border-red-400 rounded-full' src="http://localhost:8000/assets/uploads/clients/default.jpg" />
                                <AvatarFallback>Admin</AvatarFallback>
                            </Avatar>
                            <p>{email}</p>
                        </div>
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
                            onClick={() => {
                                logout()
                            }}
                        >
                            <LogOutIcon />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default NavBar;
