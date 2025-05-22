import {
  Glasses,
  LayoutDashboardIcon,
  Users,
  Mailbox,
  UserPlus,
  FileCheck,
  Files,
  Banknote,
} from "lucide-react";
import { Button } from "./button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { backEndUrl } from "@/helpers/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

const LINKS = [
  {
    id: 1,
    label: "sidebar.dashboard",
    path: "/",
    icon: LayoutDashboardIcon,
  },
  {
    id: 2,
    label: "sidebar.products",
    path: "/products",
    icon: Glasses,
  },
  {
    id: 3,
    label: "sidebar.orders",
    path: "/orders",
    icon: Mailbox,
  },
  {
    id: 4,
    label: "sidebar.clients",
    path: "/clients",
    icon: Users,
  },
  {
    id: 5,
    label: "sidebar.users",
    path: "/user/list",
    icon: UserPlus,
  },
  {
    id: 6,
    label: "sidebar.invoice",
    path: "/Facture/list",
    icon: Files,
  },
  {
    id: 7,
    label: "sidebar.bank",
    path: "/check/list",
    icon: Banknote,
  },
  {
    id: 8,
    label: "sidebar.activities",
    path: "/activities",
    icon: FileCheck,
  },
];

const SideBar = ({ open }) => {
  const { authUser } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isOwner = authUser?.data?.role === "owner";
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={cn(
        "h-full bg-white   border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-20",
        isRTL ? "border-l border-r-0" : "border-r"
      )}
    >
      <div className="flex flex-col h-full p-4">
        <div className={cn("flex justify-center ")}>
          <Link to="/" className="flex items-center">
            <img
              src={`${backEndUrl}/assets/logo/logo.png`}
              className={cn("h-auto", open ? "h-24" : "h-8")}
              alt="app-logo"
            />
          </Link>
        </div>

        <div className="space-y-1 flex-1">
          {LINKS.map((link) => {
            if (!isOwner && (link.id === 5 || link.id === 8)) return null;

            const isActive = pathname === link.path;

            return (
              <Button
                key={link.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full flex items-center justify-between",
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700",
                  !open && "justify-center",
                  "group relative"
                )}
                onClick={() => navigate(link.path)}
              >
                <div
                  className={cn(
                    "flex items-center gap-2 w-full",
                    isRTL && "flex-reverse "
                  )}
                >
                  <link.icon
                    size={20}
                    className={cn(isActive ? "text-primary" : "text-gray-500")}
                    strokeWidth={1.5}
                  />
                  {open && <span>{t(link.label)}</span>}
                </div>

                {!open && (
                  <div
                    className={cn(
                      "absolute rounded-md px-2 py-1 bg-gray-900 text-white text-xs invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300",
                      isRTL
                        ? "right-full mr-2 translate-x-3 group-hover:translate-x-0"
                        : "left-full ml-2 -translate-x-3 group-hover:translate-x-0"
                    )}
                  >
                    {t(link.label)}
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

SideBar.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default SideBar;

export const MobileMenu = ({ toggleMobileSideBar }) => {
  const { authUser } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isOwner = authUser?.data?.role === "owner";
  const isRTL = i18n.language === "ar";

  const jump = (path) => {
    navigate(path);
    toggleMobileSideBar();
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col bg-white  ">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <Link
            to="/"
            className="flex items-center"
            onClick={toggleMobileSideBar}
          >
            <img
              src={`${backEndUrl}/assets/logo/logo.png`}
              className="h-8 w-auto"
              alt="app-logo"
            />
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-1">
        {LINKS.map((link) => {
          if (!isOwner && (link.id === 5 || link.id === 8)) return null;

          const isActive = pathname === link.path;

          return (
            <Button
              key={link.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full flex items-center justify-between",
                isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : ""
              )}
              onClick={() => jump(link.path)}
            >
              <div
                className={cn(
                  "flex items-center gap-2 w-full",
                  isRTL && "flex-row-reverse justify-between"
                )}
              >
                <link.icon
                  size={20}
                  className={cn(isActive ? "text-primary" : "text-gray-500")}
                  strokeWidth={1.5}
                />
                <span>{t(link.label)}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  toggleMobileSideBar: PropTypes.func.isRequired,
};
