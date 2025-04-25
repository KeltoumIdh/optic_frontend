import { Informations } from "./profile/CardInformations";
import { Update } from "./profile/CardPassword";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className={cn("max-w-6xl mx-auto px-4 py-8", isRTL && "text-right")}>
      <h1 className="text-2xl font-bold mb-8">{t("profile.title")}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Informations />
        <Update />
      </div>
    </div>
  );
};

export default Profile;
