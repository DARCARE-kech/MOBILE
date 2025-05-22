
import React from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";

export interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showLogo?: boolean;
  showNotifications?: boolean;
  rightContent?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showLogo = true,
  showNotifications = true,
  rightContent,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-darcare-navy border-b border-darcare-gold/10">
      <div className="flex items-center justify-between p-3 h-16">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
              aria-label={t("common.back")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
          )}

          {showLogo && !title && (
            <div className="flex-1 ml-2">
              <Logo size="sm" color="gold" />
            </div>
          )}

          {title && (
            <h1 className="text-darcare-gold text-lg font-serif">{title}</h1>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {rightContent
            ? rightContent
            : showNotifications && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNotificationsClick}
                  className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
                  aria-label={t("common.notifications")}
                >
                  <Bell size={20} />
                </Button>
              )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
