
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, CalendarDays, Users, Building, Clock } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';

const StayDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentStay, isLoading } = useUserProfile();

  if (isLoading) {
    return <div className="min-h-screen bg-darcare-navy flex items-center justify-center">
      <div className="animate-pulse">Loading stay details...</div>
    </div>;
  }

  if (!currentStay) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title="Stay Details" onBack={() => navigate('/profile')} />
        <div className="pt-20 pb-24 px-4 flex flex-col items-center justify-center">
          <div className="text-darcare-beige text-center">
            <h3 className="text-xl font-serif text-darcare-gold mb-2">No Active Stay</h3>
            <p>You don't have any active stay information.</p>
          </div>
          <Button 
            className="mt-6 bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
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
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title="Stay Details" onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <Card className="p-6 bg-darcare-navy/50 border-darcare-gold/20 mb-6">
          <h2 className="text-2xl font-serif text-darcare-gold mb-4">Villa {currentStay.villa_number}</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-darcare-gold" />
              <span className="text-darcare-beige">Marrakech, Morocco</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-darcare-gold" />
              <span className="text-darcare-beige">Premium Suite</span>
            </div>
            
            <Separator className="my-3 bg-darcare-gold/10" />
            
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-darcare-gold" />
              <div className="text-darcare-beige">
                <div>{format(checkInDate, 'MMMM d, yyyy')} - {format(checkOutDate, 'MMMM d, yyyy')}</div>
                <div className="text-darcare-beige/60 text-sm">Check-in: 2:00 PM | Check-out: 12:00 PM</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-darcare-gold" />
              <span className="text-darcare-beige">{stayDuration} nights</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-darcare-gold" />
              <span className="text-darcare-beige">2 Guests</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-darcare-navy/50 border-darcare-gold/20">
          <h3 className="text-lg font-serif text-darcare-gold mb-3">Amenities</h3>
          <ul className="space-y-2 text-darcare-beige">
            <li>• Private Pool</li>
            <li>• 24/7 Concierge</li>
            <li>• Daily Housekeeping</li>
            <li>• Complimentary Breakfast</li>
            <li>• High-Speed WiFi</li>
            <li>• Premium Entertainment System</li>
          </ul>
        </Card>
        
        <div className="mt-6">
          <Button 
            className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
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
