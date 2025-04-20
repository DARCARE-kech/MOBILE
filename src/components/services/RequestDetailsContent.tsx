
import React from 'react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface RequestDetailsContentProps {
  note: string | null;
  parsedNote: any | null;
  imageUrl: string | null;
  staffAssignments: Array<{
    staff_name: string | null;
  }> | null;
}

const RequestDetailsContent: React.FC<RequestDetailsContentProps> = ({
  note,
  parsedNote,
  imageUrl,
  staffAssignments
}) => {
  const { t } = useTranslation();
  const hasStaffAssigned = staffAssignments && staffAssignments.length > 0;

  return (
    <div className="luxury-card">
      {/* Staff assigned */}
      {hasStaffAssigned && (
        <div className="mt-4 pt-4 border-t border-darcare-gold/10">
          <h3 className="text-darcare-white font-medium mb-2">{t('services.assignedStaff')}</h3>
          <p className="text-darcare-beige">{staffAssignments[0].staff_name || t('services.assigned')}</p>
        </div>
      )}
      
      {/* Notes section */}
      {(note || parsedNote) && (
        <div className="mt-4 pt-4 border-t border-darcare-gold/10">
          <h3 className="text-darcare-white font-medium mb-2">{t('services.requestDetails')}</h3>
          
          {/* If note is JSON, display structured data */}
          {parsedNote && (
            <div className="space-y-2 text-darcare-beige/80">
              {parsedNote.cleaningType && (
                <p>{t('services.cleaningType')}: <span className="text-darcare-beige">{parsedNote.cleaningType}</span></p>
              )}
              {parsedNote.frequency && (
                <p>{t('services.frequency')}: <span className="text-darcare-beige">{parsedNote.frequency}</span></p>
              )}
              {parsedNote.rooms && parsedNote.rooms.length > 0 && (
                <p>{t('services.selectedRooms')}: <span className="text-darcare-beige">{parsedNote.rooms.join(', ')}</span></p>
              )}
              {parsedNote.notes && (
                <div>
                  <p className="mb-1">{t('services.additionalNotes')}:</p>
                  <p className="text-darcare-beige bg-darcare-navy/40 p-2 rounded-md">{parsedNote.notes}</p>
                </div>
              )}
            </div>
          )}
          
          {/* If note is not JSON, display as text */}
          {!parsedNote && note && (
            <p className="text-darcare-beige/80 bg-darcare-navy/40 p-3 rounded-md">{note}</p>
          )}
        </div>
      )}
      
      {/* Image preview if available */}
      {imageUrl && (
        <div className="mt-4 pt-4 border-t border-darcare-gold/10">
          <h3 className="text-darcare-white font-medium mb-2">{t('common.image')}</h3>
          <div className="rounded-md overflow-hidden">
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
