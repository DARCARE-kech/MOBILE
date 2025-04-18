
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationReservationProps {
  recommendation: Recommendation;
}

export const RecommendationReservation = ({ recommendation }: RecommendationReservationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [peopleCount, setPeopleCount] = useState(2);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make a reservation",
        variant: "destructive",
      });
      return;
    }

    if (!date || !time) {
      toast({
        title: "Missing information",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Use service_requests table instead of reservations
      const { error } = await supabase
        .from('service_requests')
        .insert({
          service_id: null, // We don't have a specific service for recommendations
          user_id: user.id,
          preferred_time: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            parseInt(time.split(':')[0]),
            parseInt(time.split(':')[1] || "0"),
            0
          ).toISOString(),
          note: JSON.stringify({
            recommendation_id: recommendation.id,
            time: time,
            people_count: peopleCount,
            note: note || null,
            type: 'recommendation_reservation'
          }),
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Reservation confirmed",
        description: "Your reservation has been successfully submitted",
      });

      // Reset form
      setDate(undefined);
      setTime(undefined);
      setPeopleCount(2);
      setNote("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not submit reservation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ];

  return (
    <div className="space-y-6">
      <div className="bg-darcare-navy border border-darcare-gold/20 rounded-xl p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="text-darcare-white"
          classNames={{
            day_selected: "bg-darcare-gold text-darcare-navy",
            day_today: "bg-darcare-gold/20 text-darcare-gold",
          }}
        />
      </div>

      <div className="space-y-4">
        <Select onValueChange={setTime}>
          <SelectTrigger className="w-full bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          value={peopleCount}
          onChange={(e) => setPeopleCount(parseInt(e.target.value))}
          min={1}
          max={10}
          className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
        />

        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige placeholder:text-darcare-beige/50"
        />

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !date || !time}
          className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
        >
          Confirm Reservation
        </Button>
      </div>
    </div>
  );
};
