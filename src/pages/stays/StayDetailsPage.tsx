
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, CalendarDays, Users, Building, Clock } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const StayDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentStay, isLoading } = useUserProfile();
  const { isDarkMode } = useTheme();

  if (isLoading) {
    return <div className={cn(
      "min-h-screen flex items-center justify-center",
      isDarkMode ? "bg-darcare-navy" : "bg-background"
    )}>
      <div className="animate-pulse">Loading stay details...</div>
    </div>;
  }

  if (!currentStay) {
    return (
      <div className={cn(
        "min-h-screen",
        isDarkMode ? "bg-darcare-navy" : "bg-background"
      )}>
        <MainHeader title="Stay Details" onBack={() => navigate('/profile')} />
        <div className="pt-20 pb-24 px-4 flex flex-col items-center justify-center">
          <div className={cn(
            "text-center",
            isDarkMode ? "text-darcare-beige" : "text-foreground"
          )}>
            <h3 className={cn(
              "text-xl font-serif mb-2",
              isDarkMode ? "text-darcare-gold" : "text-primary"
            )}>No Active Stay</h3>
            <p>You don't have any active stay information.</p>
          </div>
          <Button 
            className={cn(
              "mt-6",
              isDarkMode 
                ? "bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
                : "bg-secondary text-white hover:bg-secondary/90"
            )}
            onClick={() => navigate('/profile')}
          >
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  const checkInDate = new Date(currentStay.check_in);
  const checkOutDate = new Date(currentStay.check_out);
  const stayDuration = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-darcare-navy" : "bg-background"
    )}>
      <MainHeader title="Stay Details" onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <Card className={cn(
          "p-6 mb-6",
          isDarkMode 
            ? "bg-darcare-navy/50 border-darcare-gold/20" 
            : "bg-white border-secondary/20"
        )}>
          <h2 className={cn(
            "text-2xl font-serif mb-4",
            isDarkMode ? "text-darcare-gold" : "text-primary"
          )}>Villa {currentStay.villa_number}</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <span className={isDarkMode ? "text-darcare-beige" : "text-foreground"}>Marrakech, Morocco</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Building className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <span className={isDarkMode ? "text-darcare-beige" : "text-foreground"}>Premium Suite</span>
            </div>
            
            <Separator className={cn(
              "my-3",
              isDarkMode ? "bg-darcare-gold/10" : "bg-secondary/10"
            )} />
            
            <div className="flex items-center gap-3">
              <CalendarDays className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <div className={isDarkMode ? "text-darcare-beige" : "text-foreground"}>
                <div>{format(checkInDate, 'MMMM d, yyyy')} - {format(checkOutDate, 'MMMM d, yyyy')}</div>
                <div className={cn(
                  "text-sm",
                  isDarkMode ? "text-darcare-beige/60" : "text-foreground/60"
                )}>Check-in: 2:00 PM | Check-out: 12:00 PM</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <span className={isDarkMode ? "text-darcare-beige" : "text-foreground"}>{stayDuration} nights</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <span className={isDarkMode ? "text-darcare-beige" : "text-foreground"}>2 Guests</span>
            </div>
          </div>
        </Card>
        
        <Card className={cn(
          "p-6",
          isDarkMode 
            ? "bg-darcare-navy/50 border-darcare-gold/20" 
            : "bg-white border-secondary/20"
        )}>
          <h3 className={cn(
            "text-lg font-serif mb-3",
            isDarkMode ? "text-darcare-gold" : "text-primary"
          )}>Amenities</h3>
          <ul className={cn(
            "space-y-2",
            isDarkMode ? "text-darcare-beige" : "text-foreground"
          )}>
            <li>• Private Pool</li>
            <li>• 24/7 Concierge</li>
            <li>• Daily Housekeeping</li>
            
            <li>• High-Speed WiFi</li>
          
          </ul>
        </Card>
        
        <div className="mt-6">
          <Button 
            className={cn(
              "w-full",
              isDarkMode
                ? "bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
                : "bg-secondary text-white hover:bg-secondary/90"
            )}
            onClick={() => navigate('/services')}
          >
            Request Services
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StayDetailsPage;
