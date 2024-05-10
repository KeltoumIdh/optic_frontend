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
    Banknote
    
} from "lucide-react";
import { Button } from "./button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
// import { DashIcon, DashboardIcon, FileTextIcon, PersonIcon} from '@radix-ui/react-icons'
// import logo from '../../../../public/assets/uploads/photo/logo'
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
        icon: Files ,
    },
    {
        id: 7,
        label: "Check ",
        path: "/check/list",
        icon: Banknote ,
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
                            src={`http://localhost:8000/assets/logo/logo.png`}
                            className="w-28
         "
                            alt="app-logo"
                        />
                    </Link>
                </div>
            ) : (
                <img
                    src={`http://localhost:8000/assets/logo/logo.png`}
                    alt="app-logo"
                    className="w-16  px-1"
                />
            )}
            <div className="flex flex-col justify-start items-start gap-5 w-full">
                {LINKS.map((link) => (
                    <Button
                        key={link.id}
                        variant={`${
                            pathname === link.path ? "default" : "ghost"
                        }`}
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

export const MobileMenu = ({ open }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const sideBarStyle = useMemo(() => {
        return open
            ? "w-[200px] flex flex-col justify-start items-start gap-5"
            : "w-[0px]";
    }, [open]);

    return (
        <div
            className={`${sideBarStyle}  transition-width duration-200 ease-linear w-full`}
        >
            {open ? (
                <div>
                    <div className="flex items-center p-2 w-full">
                        <img
                            src={`http://localhost:8000/assets/logo/logo.png`}
                            className="w-16 "
                            alt="app-logo"
                        />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-5 w-full ">
                        {LINKS.map((link) => (
                            <Button
                                key={link.id}
                                variant={`${
                                    pathname === link.path ? "default" : "ghost"
                                }`}
                                className="text-sm gap-2 flex justify-start items-center w-full "
                                onClick={() => navigate(link.path)}
                            >
                                {link.icon && <link.icon size={20} />}
                                <span>{link.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
