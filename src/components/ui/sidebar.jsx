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
import { useMemo } from "react";
import { backEndUrl } from "@/helpers/utils";

const LINKS = [
    {
        id: 1,
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboardIcon,
    },
    {
        id: 2,
        label: "Products",
        path: "/products",
        icon: Glasses,
    },
    {
        id: 3,
        label: "Orders",
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
        label: "Check ",
        path: "/check/list",
        icon: Banknote,
    },
];

const SideBar = ({ open }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const sideBarStyle = useMemo(() => {
        return open
            ? `w-[200px] flex flex-col justify-start items-start gap-5`
            : `w-[50px] flex flex-col justify-center items-center gap-5`;
    }, [open]);

    return (
        <div
            className={`${sideBarStyle} m-2 transition-width  duration-200 ease-linear`}
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
                {LINKS.map((link) => (
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
                ))}
            </div>
        </div>
    );
};

export default SideBar;



export const MobileMenu = ({ toggleMobileSideBar }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();


    // jump to the selected page
    const jump = (path) => {
        navigate(path)
        toggleMobileSideBar()
    }

    return (
        <>
            <div onClick={toggleMobileSideBar} className="fixed top-0 left-0 z-[1000] h-full w-full bg-black/40"></div>
            <div
                className={`lg:hidden w-[200px] h-dvh overflow-y-auto flex flex-col justify-start items-start gap-5 duration-200 ease-linear bg-white
                fixed top-0 left-0 z-[1001]
                `}
            >
                <div className="w-full px-2">
                    <div className="flex items-center p-2 w-full h-[100px]">
                        <img
                            src={`${backEndUrl}/assets/logo/logo.png`}
                            className="h-full w-auto"
                            alt="app-logo"
                        />
                    </div>
                    <div className="w-full flex flex-col justify-start items-start gap-5">
                        {LINKS.map((link) => (
                            <Button
                                key={link.id}
                                variant={`${pathname === link.path ? "default" : "ghost"}`}
                                className="text-sm gap-2 flex justify-start items-center w-full "
                                onClick={() => jump(link.path)}
                            >
                                {link.icon && <link.icon size={20} />}
                                <span>{link.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
