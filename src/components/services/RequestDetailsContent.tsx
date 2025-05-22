
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { formatFieldKey } from '@/utils/formattingUtils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import StatusTimeline from './StatusTimeline';

interface RequestDetailsContentProps {
  note: string | null;
  parsedNote: Record<string, any> | null;
  imageUrl: string | null;
  staffAssignments: any[] | null;
  selectedOptions: Record<string, any> | null;
  preferredTime: string | null;
  createdAt: string | null;
  spaceId?: string | null;
  status: string | null;
}

const RequestDetailsContent: React.FC<RequestDetailsContentProps> = ({
  note,
  parsedNote,
  imageUrl,
  staffAssignments,
  selectedOptions,
  preferredTime,
  createdAt,
  spaceId,
  status,
}) => {
  const { t } = useTranslation();
  
  // Fetch space details if space_id is present (either from props or parsedNote)
  const finalSpaceId = spaceId || parsedNote?.space_id;
  
  const { data: spaceData } = useQuery({
    queryKey: ['space', finalSpaceId],
    queryFn: async () => {
      if (!finalSpaceId) return null;
      
      const { data, error } = await supabase
        .from('spaces')
        .select('name')
        .eq('id', finalSpaceId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!finalSpaceId
  });

  // Format the date and time for display
  const formattedDate = preferredTime 
    ? format(new Date(preferredTime), 'PPP') 
    : null;
  
  const formattedTime = preferredTime 
    ? format(new Date(preferredTime), 'p') 
    : null;

  return (
    <div className="space-y-6 mt-4">
      {/* Display image if available */}
      {imageUrl && (
        <div className="rounded-md overflow-hidden">
          <img 
            src={imageUrl} 
            alt={t('services.requestImage')} 
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      {/* Scheduling Details */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-darcare-gold uppercase">
          {t('services.schedulingDetails', 'Scheduling Details')}
        </h3>
        
        {formattedDate && (
          <div className="flex justify-between">
            <span className="text-darcare-beige/80">{t('services.preferredDate', 'Preferred Date')}</span>
            <span className="text-darcare-beige font-medium">{formattedDate}</span>
          </div>
        )}
        
        {formattedTime && (
          <div className="flex justify-between">
            <span className="text-darcare-beige/80">{t('services.preferredTime', 'Preferred Time')}</span>
            <span className="text-darcare-beige font-medium">{formattedTime}</span>
          </div>
        )}
      </div>
      
      {/* For space bookings, show space details */}
      {(finalSpaceId || parsedNote?.people) && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-darcare-gold uppercase">
            {t('services.spaceDetails', 'Space Details')}
          </h3>
          
          
          
          {parsedNote?.people && (
            <div className="flex justify-between">
              <span className="text-darcare-beige/80">{t('services.numberOfPeople', 'Number of People')}</span>
              <span className="text-darcare-beige font-medium">
                {parsedNote.people} {parsedNote.people === 1 
                  ? t('services.person', 'Person') 
                  : t('services.people', 'People')}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Selected Options */}
      {selectedOptions && Object.keys(selectedOptions).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-darcare-gold uppercase">
            {t('services.yourPreferences', 'Your Preferences')}
          </h3>
          
          {Object.entries(selectedOptions).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-darcare-beige/80">{formatFieldKey(key)}</span>
              <span className="text-darcare-beige font-medium">
                {Array.isArray(value) 
                  ? value.join(', ') 
                  : typeof value === 'boolean'
                    ? (value ? t('common.yes') : t('common.no'))
                    : typeof value === 'object' 
                      ? JSON.stringify(value) // Convert objects to string to prevent React errors
                      : String(value)} {/* Ensure all values are converted to strings */}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Notes */}
      {(note || parsedNote?.notes) && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-darcare-gold uppercase">
            {t('services.notesTitle', 'Notes')}
          </h3>
          <p className="text-darcare-beige whitespace-pre-wrap">
            {parsedNote?.notes || note}
          </p>
        </div>
      )}
      
      {/* Staff Assignments */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-darcare-gold uppercase">
          {t('services.assignedStaff', 'Assigned Staff')}
        </h3>
        
        {staffAssignments && staffAssignments.length > 0 && 
         staffAssignments[0] && staffAssignments[0].staff_name ? (
          <div className="text-darcare-beige">
            {[...new Map(
  staffAssignments.map((s) => [s.staff_name, s])
).values()].map((staff) => (
  <div key={staff.staff_id} className="py-1">
    {staff.staff_name}
  </div>
))}
          </div>
        ) : (
          <p className="text-darcare-beige/70">{t('services.noStaffAssigned', 'No staff assigned yet.')}</p>
        )}
      </div>
      
      {/* Status Timeline */}
      <StatusTimeline currentStatus={status} />
    </div>
  );
};

export default RequestDetailsContent;
