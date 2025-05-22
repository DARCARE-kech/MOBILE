
import React from "react";
import { Bell, Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WeatherDisplay from "./weather/WeatherDisplay";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Logo from "./Logo";

export interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showLogo?: boolean;
  showNotifications?: boolean;
  showWeather?: boolean;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  rightContent?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showLogo = true,
  showNotifications = true,
  showWeather = true,
  showFavorite = true,
  isFavorite = false,
  onToggleFavorite,
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

  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite();
    } else {
      navigate("/explore/favorites");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-darcare-navy border-b border-darcare-gold/10">
      <div className="flex items-center justify-between p-3 h-16">
        <div className="flex items-center flex-1 gap-1 overflow-hidden">
  {showBack && (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBack}
      className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
      aria-label={t("common.back")}
    >
      <ArrowLeft size={20} />
    </Button>
  )}

  {showLogo && !title && (
    <div className="ml-2">
      <Logo size="sm" color="gold" />
    </div>
  )}

  {title && (
    <h1 className="text-darcare-gold text-lg font-serif truncate ml-4">
      {title}
    </h1>
  )}
</div>


        <div className="flex items-center space-x-2">
          {rightContent ? (
            rightContent
          ) : (
            <>
              {showWeather && <WeatherDisplay />}

              {showFavorite && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteClick}
                  className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
                  aria-label={t("common.favorite")}
                >
                  <Heart size={20} className={isFavorite ? "fill-darcare-gold" : ""} />
                </Button>
              )}

              {showNotifications && (
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
