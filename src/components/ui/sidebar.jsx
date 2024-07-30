import {
    BookCopy,
    Glasses,
    LayoutDashboardIcon,
    MessageSquareCodeIcon,
    Users,
    Mailbox,
    UserPlus,
    FileCheck,
    Files,
    Banknote,
} from "lucide-react";
import { Button } from "./button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { backEndUrl } from "@/helpers/utils";
import { useAuth } from "@/hooks/useAuth";

const LINKS = [
    {
        id: 1,
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboardIcon,
    },
    {
        id: 2,
        label: "Produits",
        path: "/products",
        icon: Glasses,
    },
    {
        id: 3,
        label: "Commandes",
        path: "/orders",
        icon: Mailbox,
    },
    {
        id: 4,
        label: "clients",
        path: "/clients",
        icon: Users,
    },
    {
        id: 5,
        label: "Users",
        path: "/user/list",
        icon: UserPlus,
    },
    {
        id: 6,
        label: "Facture",
        path: "/Facture/list",
        icon: Files,
    },
    {
        id: 7,
        label: "Banque ",
        path: "/check/list",
        icon: Banknote,
    },
    {
        id: 8,
        label: "Activities",
        path: "/activities",
        icon: Files
    },
];

const SideBar = ({ open }) => {
    const { authUser } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const sideBarStyle = useMemo(() => {
        return open
            ? `w-[200px] flex flex-col justify-start items-start gap-5`
            : `w-[50px] flex flex-col justify-center items-center gap-5`;
    }, [open]);


    const isOwner = authUser?.data?.role === "owner";


    return (
        <div
            className={`${sideBarStyle} max-lg:hidden m-2 transition-width  duration-200 ease-linear`}
        >
            {open ? (
                <div className="flex  w-full h-12 items-center justify-center">
                    <Link to="/">
                        <img
                            src={`${backEndUrl}/assets/logo/logo.png`}
                            className="w-28"
                            alt="app-logo"
                        />
                    </Link>
                </div>
            ) : (
                <img
                    src={`${backEndUrl}/assets/logo/logo.png`}
                    alt="app-logo"
                    className="w-16  px-1"
                />
            )}
            <div className="flex flex-col justify-start items-start gap-5 w-full">
                {LINKS.map((link) => {
                    if (!isOwner && (link.id === 5 || link.id === 8)) return null;
                    return (
                        <Button
                            key={link.id}
                            variant={`${pathname === link.path ? "default" : "ghost"}`}
                            className="text-md gap-2 flex justify-start items-center w-full"
                            onClick={() => navigate(link.path)}
                        >
                            <link.icon size={25} strokeWidth={1.25} />
                            <span className={`${!open ? "hidden" : "block"}`}>
                                {link.label}
                            </span>
                        </Button>
                    )
                })}
            </div>
        </div>
    );
};

export default SideBar;



export const MobileMenu = ({ toggleMobileSideBar }) => {
    const { authUser } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();


    // jump to the selected page
    const jump = (path) => {
        navigate(path)
        toggleMobileSideBar()
    }

    const isOwner = authUser?.data?.role === "owner";

    return (
        <>
            <div onClick={toggleMobileSideBar} className="lg:hidden fixed top-0 left-0 z-[1000] h-full w-full bg-black/40"></div>
            <div
                className={`lg:hidden w-[200px] h-dvh overflow-y-auto flex flex-col justify-start items-start gap-5 duration-200 ease-linear bg-white
                fixed top-0 left-0 z-[1001]
                `}
            >
                <div className="w-full px-2">
                    <div className="flex items-center justify-center p-2 w-full h-[100px]">
                        <img
                            src={`${backEndUrl}/assets/logo/logo.png`}
                            className="h-full w-auto"
                            alt="app-logo"
                        />
                    </div>
                    <div className="w-full flex flex-col justify-start items-start gap-5">
                        {LINKS.map((link) => {
                            if (!isOwner && (link.id === 5 || link.id === 8)) return null;
                            return (
                                <Button
                                    key={link.id}
                                    variant={`${pathname === link.path ? "default" : "ghost"}`}
                                    className="text-sm gap-2 flex justify-start items-center w-full "
                                    onClick={() => jump(link.path)}
                                >
                                    {link.icon && <link.icon size={20} />}
                                    <span>{link.label}</span>
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};
