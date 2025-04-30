
import React from 'react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { formatFieldKey, renderSelectedOptions } from '@/utils/formattingUtils';
import { Clock, Calendar, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequestDetailsContentProps {
  note: string | null;
  parsedNote: any | null;
  imageUrl: string | null;
  staffAssignments: Array<{
    staff_name: string | null;
  }> | null;
  selectedOptions: Record<string, any> | null;
  preferredTime: string | null;
  createdAt: string | null;
}

const RequestDetailsContent: React.FC<RequestDetailsContentProps> = ({
  note,
  parsedNote,
  imageUrl,
  staffAssignments,
  selectedOptions,
  preferredTime,
  createdAt
}) => {
  const { t } = useTranslation();
  const hasStaffAssigned = staffAssignments && staffAssignments.length > 0;
  
  // Format the selected options into readable format
  const formattedOptions = selectedOptions ? renderSelectedOptions(selectedOptions) : [];

  return (
    <div className="space-y-6">
      {/* Scheduling info section */}
      <div className="space-y-4">
        <h3 className="text-darcare-white font-medium">{t('services.schedulingDetails')}</h3>
        
        <div className="rounded-lg bg-darcare-navy/40 p-4 space-y-3">
          {preferredTime && (
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-darcare-gold" />
              <div>
                <p className="text-sm text-darcare-beige/80">{t('services.scheduledFor')}</p>
                <p className="text-darcare-beige">{format(new Date(preferredTime), "PPP p")}</p>
              </div>
            </div>
          )}
          
          {createdAt && (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-darcare-gold" />
              <div>
                <p className="text-sm text-darcare-beige/80">{t('services.submittedOn')}</p>
                <p className="text-darcare-beige">{format(new Date(createdAt), "PPP")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Selected preferences section */}
      {formattedOptions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-darcare-white font-medium">{t('services.yourPreferences')}</h3>
          
          <div className="rounded-lg bg-darcare-navy/40 p-4 space-y-3">
            {formattedOptions.map((option, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-darcare-gold mt-0.5" />
                <div>
                  <p className="text-sm text-darcare-beige/80">{option.label}</p>
                  <p className="text-darcare-beige">
                    {Array.isArray(option.value) 
                      ? option.value.join(', ')
                      : typeof option.value === 'boolean' 
                        ? (option.value ? t('common.yes') : t('common.no'))
                        : String(option.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Staff assigned */}
      {hasStaffAssigned && (
        <div className="space-y-4">
          <h3 className="text-darcare-white font-medium">{t('services.assignedStaff')}</h3>
          <div className="rounded-lg bg-darcare-navy/40 p-4">
            <p className="text-darcare-beige">{staffAssignments[0].staff_name || t('services.assigned')}</p>
          </div>
        </div>
      )}
      
      {/* Notes section */}
      {(note || parsedNote) && (
        <div className="space-y-4">
          <h3 className="text-darcare-white font-medium">{t('services.additionalNotes')}</h3>
          
          {/* If note is JSON, display structured data */}
          {parsedNote && (
            <div className="rounded-lg bg-darcare-navy/40 p-4 space-y-3">
              {Object.entries(parsedNote).map(([key, value], index) => {
                if (key === 'notes' || key === 'note') {
                  return (
                    <div key={index} className="space-y-1">
                      <p className="text-sm text-darcare-beige/80">{t('services.additionalNotes')}</p>
                      <p className="text-darcare-beige bg-darcare-navy/60 p-2 rounded-md">{String(value)}</p>
                    </div>
                  );
                } else if (value && typeof value !== 'object') {
                  return (
                    <div key={index} className="space-y-1">
                      <p className="text-sm text-darcare-beige/80">{formatFieldKey(key)}</p>
                      <p className="text-darcare-beige">{String(value)}</p>
                    </div>
                  );
                } else if (Array.isArray(value) && value.length > 0) {
                  return (
                    <div key={index} className="space-y-1">
                      <p className="text-sm text-darcare-beige/80">{formatFieldKey(key)}</p>
                      <p className="text-darcare-beige">{value.map(formatFieldKey).join(', ')}</p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
          
          {/* If note is not JSON, display as text */}
          {!parsedNote && note && (
            <div className="rounded-lg bg-darcare-navy/40 p-4">
              <p className="text-darcare-beige">{note}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Image preview if available */}
      {imageUrl && (
        <div className="space-y-4">
          <h3 className="text-darcare-white font-medium">{t('common.image')}</h3>
          <div className="rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt={t('services.requestAttachment')} 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetailsContent;
