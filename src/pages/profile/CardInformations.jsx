import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const Informations = () => {
  const { authUser } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Card>
      <CardHeader>
        <h2 className={cn("text-lg font-semibold", isRTL && "text-right")}>
          {t("profile.personalInfo")}
        </h2>
      </CardHeader>
      <CardContent className={cn("space-y-4", isRTL && "text-right")}>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("profile.fullName")}</label>
          <Input
            type="text"
            value={authUser?.data?.name || ""}
            disabled
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("profile.emailAddress")}
          </label>
          <Input
            type="email"
            value={authUser?.data?.email || ""}
            disabled
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("profile.accountRole")}
          </label>
          <Input
            type="text"
            value={t(`roles.${authUser?.data?.role}`) || t("roles.user")}
            disabled
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Informations;
