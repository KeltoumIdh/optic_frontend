import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
  LogOut,
  Bell,
  Languages,
} from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { axiosUser } from "@/api/axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const NavBar = ({ open, toggleOpen, toggleMobileSideBar }) => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { i18n, t } = useTranslation();

  const isOwner = authUser?.data?.role === "owner";
  const isRTL = i18n.language === "ar";

  const toggleLanguage = () => {
    const newLang = i18n.language === "fr" ? "ar" : "fr";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    if (isOwner) {
      fetchNotifications();
      // Poll for new notifications every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isOwner]);

  const fetchNotifications = async () => {
    try {
      const response = await axiosUser.get("/notifications");
      setNotifications(response.data.notifications || []);
      setUnreadCount(
        response.data.notifications?.filter((n) => !n.read_at).length || 0
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axiosUser.post(`/notifications/${notificationId}/mark-as-read`);
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNavigate = () => {
    navigate("/profile");
  };

  const { name, email, role } = authUser?.data ?? {};

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}${t("time.minutesAgo")}`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}${t("time.hoursAgo")}`;
    } else {
      return date.toLocaleDateString(isRTL ? "ar-SA" : "fr-FR");
    }
  };

  return (
    <div
      className={cn(
        "flex h-16 items-center border-b border-gray-200 bg-white",
        isRTL ? "px-4 py-3 flex-reverse" : "px-4 py-3"
      )}
    >
      <div className={cn("flex items-center gap-2", isRTL && "flex-reverse")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleOpen}
          className="hidden lg:flex hover:bg-gray-100"
        >
          {open ? (
            isRTL ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileSideBar}
          className="lg:hidden hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1
          className={cn(
            "text-lg md:text-xl font-semibold hidden sm:block",
            isRTL && "mr-2"
          )}
        >
          {t("dashboard.title")}
        </h1>
      </div>

      <div
        className={cn("flex items-center gap-4", isRTL ? "mr-auto" : "ml-auto")}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          className="hover:bg-gray-100"
        >
          <Languages className="h-5 w-5" />
          <span className="sr-only">
            {isRTL ? "Passer en français" : "التبديل إلى العربية"}
          </span>
        </Button>

        {isOwner && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span
                    className={cn(
                      "absolute -top-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center",
                      isRTL ? "-left-1" : "-right-1"
                    )}
                  >
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0"
              align={isRTL ? "start" : "end"}
              side={isRTL ? "right" : "left"}
            >
              <div
                className={cn(
                  "p-4 border-b border-gray-200",
                  isRTL && "text-right"
                )}
              >
                <h3 className="font-semibold">{t("notifications.title")}</h3>
              </div>
              <ScrollArea className="h-[300px]">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                        !notification.read_at && "bg-blue-50",
                        isRTL && "text-right"
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div
                        className={cn(
                          "flex justify-between items-start mb-1",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatNotificationTime(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div
                    className={cn(
                      "p-4 text-center text-gray-500",
                      isRTL && "text-right"
                    )}
                  >
                    {t("notifications.empty")}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "relative flex items-center gap-2 p-1 px-2 rounded-full hover:bg-gray-100",
                isRTL && "flex-row-reverse"
              )}
            >
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage src="http://localhost:8000/assets/uploads/clients/default.jpg" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {name?.charAt(0) || email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "flex-col max-w-[150px] truncate hidden md:flex",
                  isRTL ? "items-end" : "items-start"
                )}
              >
                <span className="text-sm font-medium truncate">
                  {name || email}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {t(`roles.${role}`) || t("roles.user")}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
            <DropdownMenuLabel>{t("account.myAccount")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleNavigate}
              className={cn("cursor-pointer", isRTL && "flex-row-reverse")}
            >
              <User className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              <span>{t("account.profile")}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={cn(
                "text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-50",
                isRTL && "flex-row-reverse"
              )}
              onClick={() => logout()}
            >
              <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              <span>{t("account.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
  toggleMobileSideBar: PropTypes.func.isRequired,
};

export default NavBar;
