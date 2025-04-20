
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import MainHeader from "@/components/MainHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Mail, Phone, User, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

const StayDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: stay, isLoading, error } = useQuery({
    queryKey: ['stay', id],
    queryFn: async () => {
      if (!id) throw new Error("Stay ID is required");
      
      const { data, error } = await supabase
        .from('stays')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Tables<"stays">;
    },
    enabled: !!id && !!user
  });

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title="Stay Details" onBack={handleBack} />
        <div className="p-4 space-y-4">
          <Skeleton className="h-40 w-full bg-darcare-gold/20 rounded-xl" />
          <Skeleton className="h-8 w-2/3 bg-darcare-gold/20 rounded" />
          <Skeleton className="h-6 w-1/2 bg-darcare-gold/20 rounded" />
          <Skeleton className="h-24 w-full bg-darcare-gold/20 rounded-xl" />
        </div>
        <BottomNavigation activeTab="home" />
      </div>
    );
  }

  if (error || !stay) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title="Stay Details" onBack={handleBack} />
        <div className="p-4 flex flex-col items-center justify-center h-[50vh] text-center">
          <AlertTriangle className="h-12 w-12 text-darcare-gold mb-4" />
          <h2 className="text-xl font-serif text-darcare-gold mb-2">Stay Not Found</h2>
          <p className="text-darcare-beige mb-6">We couldn't find the stay information you're looking for.</p>
          <Button 
            onClick={handleBack}
            className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
          >
            Back to Home
          </Button>
        </div>
        <BottomNavigation activeTab="home" />
      </div>
    );
  }

  const checkIn = new Date(stay.check_in || "");
  const checkOut = new Date(stay.check_out || "");
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title="Stay Details" onBack={handleBack} />
      
      <div className="p-4 pb-24 space-y-4">
        <div className="luxury-card">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-serif text-darcare-gold text-2xl">{stay.villa_number}</h2>
            <div className="flex items-center gap-1 text-sm bg-darcare-gold/10 rounded-full px-3 py-1 text-darcare-gold">
              <Calendar size={14} />
              <span>
                {stay.status === 'current' 
                  ? 'Currently Staying' 
                  : 'Upcoming Stay'}
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-darcare-beige/80 text-sm mb-2">{stay.city}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-darcare-beige/70">Check-in</p>
                  <p className="text-darcare-white">{checkIn.toLocaleDateString(undefined, { 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-darcare-beige/70">Check-out</p>
                  <p className="text-darcare-white">{checkOut.toLocaleDateString(undefined, { 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-darcare-gold/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-2 items-center">
                  <Calendar className="text-darcare-gold h-5 w-5" />
                  <div>
                    <p className="text-sm text-darcare-beige/70">Duration</p>
                    <p className="text-darcare-white">{nights} nights</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <User className="text-darcare-gold h-5 w-5" />
                  <div>
                    <p className="text-sm text-darcare-beige/70">Guests</p>
                    <p className="text-darcare-white">{stay.guests || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-darcare-gold/10">
              <h3 className="text-darcare-gold mb-2">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Home className="text-darcare-gold h-5 w-5 mt-0.5" />
                  <div>
                    <p className="text-sm text-darcare-beige/70">Property</p>
                    <p className="text-darcare-white">Villa {stay.villa_number}, {stay.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="text-darcare-gold h-5 w-5 mt-0.5" />
                  <div>
                    <p className="text-sm text-darcare-beige/70">Resort Phone</p>
                    <p className="text-darcare-white">+212 555-234-567</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="text-darcare-gold h-5 w-5 mt-0.5" />
                  <div>
                    <p className="text-sm text-darcare-beige/70">Resort Email</p>
                    <p className="text-darcare-white">reception@darcare.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-darcare-gold/10">
              <Button 
                className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
                onClick={() => navigate('/services')}
              >
                Request Services
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default StayDetailsPage;
