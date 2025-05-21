
import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { Clock, User, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { StaffAssignment } from "@/integrations/supabase/rpc";

interface RequestDetailsContentProps {
  note: string | null;
  parsedNote: any | null;
  imageUrl: string | null;
  staffAssignments: StaffAssignment[] | null | undefined;
  selectedOptions: Record<string, any> | null;
  preferredTime: string | null;
  createdAt: string | null;
  spaceId?: string | null;
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
}) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  // Check if there's an assigned staff member
  const assignedStaff = staffAssignments && staffAssignments.length > 0 ? staffAssignments[0] : null;
  const staffName = assignedStaff?.staff_name;
  const staffPhone = assignedStaff?.staff_services?.phone_number;

  // Format dates if present
  const formattedPreferredTime = preferredTime 
    ? format(new Date(preferredTime), "PPP 'at' p")
    : t('services.notSpecified', 'Not specified');
    
  const formattedCreatedAt = createdAt
    ? format(new Date(createdAt), "PPP 'at' p")
    : '';

  // Render note content based on format
  const renderNoteContent = () => {
    if (parsedNote && typeof parsedNote === 'object') {
      return (
        <div className="space-y-2">
          {Object.entries(parsedNote).map(([key, value]) => {
            // Skip empty values or null/undefined
            if (!value) return null;
            return (
              <div key={key} className="space-y-1">
                <h4 className="font-medium text-sm">
                  {t(`services.${key}`, key.replace(/_/g, ' '))}:
                </h4>
                <p className="text-sm">
                  {String(value)}
                </p>
              </div>
            );
          })}
        </div>
      );
    } else if (note) {
      return <p className="text-sm">{note}</p>;
    } else {
      return <p className="text-sm italic">{t('services.noNoteProvided', 'No additional information provided.')}</p>;
    }
  };

  // Render selected options if present
  const renderSelectedOptions = () => {
    if (!selectedOptions) return null;
    
    return (
      <div className="space-y-3 mt-4">
        <h3 className={cn(
          "font-serif",
          isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
        )}>
          {t('services.selectedOptions', 'Selected Options')}
        </h3>
        <div className="space-y-2">
          {Object.entries(selectedOptions).map(([key, value]) => {
            // Skip empty values or null/undefined
            if (!value) return null;
            
            // Handle boolean values
            if (typeof value === 'boolean') {
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center",
                    value
                      ? isDarkMode ? "bg-darcare-gold" : "bg-darcare-deepGold" 
                      : "bg-gray-300"
                  )}>
                    {value && <span className={isDarkMode ? "text-darcare-navy text-xs" : "text-white text-xs"}>✓</span>}
                  </div>
                  <span className={cn(
                    "text-sm",
                    isDarkMode ? "text-darcare-beige" : "text-foreground"
                  )}>
                    {t(`services.${key}`, key.replace(/_/g, ' '))}
                  </span>
                </div>
              );
            }
            
            // Handle other types of values
            return (
              <div key={key} className="space-y-1">
                <h4 className={cn(
                  "font-medium text-sm",
                  isDarkMode ? "text-darcare-beige" : "text-foreground"
                )}>
                  {t(`services.${key}`, key.replace(/_/g, ' '))}:
                </h4>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-darcare-beige/80" : "text-foreground/80"
                )}>
                  {String(value)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Schedule information */}
      <div className={cn(
        "space-y-3 pt-4 border-t",
        isDarkMode ? "border-darcare-gold/20" : "border-primary/10"
      )}>
        <h3 className={cn(
          "font-serif",
          isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
        )}>
          {t('services.schedule', 'Schedule')}
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock 
              className={cn(
                "mt-0.5",
                isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
              )}
              size={16} 
            />
            <div>
              <p className={cn(
                "font-medium",
                isDarkMode ? "text-darcare-beige" : "text-foreground"
              )}>
                {t('services.preferredTime', 'Preferred Time')}
              </p>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
              )}>
                {formattedPreferredTime}
              </p>
            </div>
          </div>
          
          {createdAt && (
            <div className={cn(
              "text-xs mt-2",
              isDarkMode ? "text-darcare-beige/50" : "text-foreground/50"
            )}>
              {t('services.requestedOn', 'Requested on')} {formattedCreatedAt}
            </div>
          )}
        </div>
      </div>
      
      {/* Staff assignment */}
      <div className={cn(
        "space-y-3 pt-4 border-t",
        isDarkMode ? "border-darcare-gold/20" : "border-primary/10"
      )}>
        <h3 className={cn(
          "font-serif",
          isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
        )}>
          {t('services.assignment', 'Assignment')}
        </h3>
        
        {staffName ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User 
                className={cn(
                  "mt-0.5",
                  isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
                )}
                size={16} 
              />
              <div>
                <p className={cn(
                  "font-medium",
                  isDarkMode ? "text-darcare-beige" : "text-foreground"
                )}>
                  {staffName}
                </p>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
                )}>
                  {t('services.assignedStaff', 'Assigned Staff')}
                </p>
              </div>
            </div>
            
            {staffPhone && (
              <div className="flex items-start gap-3">
                <Phone 
                  className={cn(
                    "mt-0.5",
                    isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
                  )}
                  size={16} 
                />
                <div>
                  <a 
                    href={`tel:${staffPhone}`}
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-darcare-beige" : "text-foreground"
                    )}
                  >
                    {staffPhone}
                  </a>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
                  )}>
                    {t('services.contactPhone', 'Contact Phone')}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <User 
              className={cn(
                "mt-0.5",
                isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
              )}
              size={16} 
            />
            <p className={cn(
              "text-sm italic",
              isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
            )}>
              {t('services.notYetAssigned', 'Not yet assigned to any staff member')}
            </p>
          </div>
        )}
      </div>
      
      {/* Note or additional information */}
      <div className={cn(
        "space-y-3 pt-4 border-t",
        isDarkMode ? "border-darcare-gold/20" : "border-primary/10"
      )}>
        <h3 className={cn(
          "font-serif",
          isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
        )}>
          {t('services.additionalInformation', 'Additional Information')}
        </h3>
        <div className={cn(
          "p-3 rounded-md",
          isDarkMode 
            ? "bg-darcare-navy/40 text-darcare-beige/90" 
            : "bg-gray-50 text-foreground/90"
        )}>
          {renderNoteContent()}
        </div>
      </div>
      
      {/* Selected options if present */}
      {selectedOptions && renderSelectedOptions()}
      
      {/* Image if present */}
      {imageUrl && (
        <div className={cn(
          "space-y-3 pt-4 border-t",
          isDarkMode ? "border-darcare-gold/20" : "border-primary/10"
        )}>
          <h3 className={cn(
            "font-serif",
            isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
          )}>
            {t('services.attachedImage', 'Attached Image')}
          </h3>
          <img 
            src={imageUrl} 
            alt={t('services.requestImage', 'Request image')}
            className="w-full rounded-md object-cover max-h-64" 
          />
        </div>
      )}
    </div>
  );
};

export default RequestDetailsContent;
