
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { CalendarClock, Baby, Loader2 } from 'lucide-react';
import FormSectionTitle from '@/components/services/FormSectionTitle';
import { DateTimeSelector } from '@/components/services/space-booking/DateTimeSelector';
import ServiceRequestForm from './ServiceRequestForm';
import { ServiceDetail } from '@/hooks/services/types';

interface KidsClubServiceProps {
  serviceData: ServiceDetail;
  existingRequest?: any;
  editMode?: boolean;
}

const KidsClubService: React.FC<KidsClubServiceProps> = ({ 
  serviceData, 
  existingRequest,
  editMode = false
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  console.log('KidsClub service data:', serviceData);
  console.log('Service ID:', serviceData.service_id);
  
  if (!serviceData || !serviceData.service_id) {
    console.error('No service data or service_id provided to KidsClubService');
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <p className="text-darcare-gold">Service information not available.</p>
          <Button 
            onClick={() => navigate('/services')}
            className="mt-4"
          >
            Back to Services
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <ServiceRequestForm 
      serviceType="kids"
      serviceId={serviceData.service_id}
      existingRequest={existingRequest}
      editMode={editMode}
    />
  );
};

export default KidsClubService;
