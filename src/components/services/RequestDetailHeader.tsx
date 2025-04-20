
import React from 'react';
import { format } from 'date-fns';
import StatusBadge from '@/components/StatusBadge';
import { Clock, Calendar } from 'lucide-react';

interface RequestDetailHeaderProps {
  serviceName: string;
  status: string | null;
  preferredTime: string | null;
  createdAt: string | null;
}

const RequestDetailHeader: React.FC<RequestDetailHeaderProps> = ({
  serviceName,
  status,
  preferredTime,
  createdAt,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-3">
        <h2 className="font-serif text-darcare-gold text-xl">{serviceName}</h2>
        <StatusBadge status={status} />
      </div>
      
      <div className="space-y-3">
        {preferredTime && (
          <div className="flex items-center gap-3 text-darcare-beige/80">
            <Clock className="h-5 w-5 text-darcare-gold" />
            <p>{format(new Date(preferredTime), "PPP p")}</p>
          </div>
        )}
        
        {createdAt && (
          <div className="flex items-center gap-3 text-darcare-beige/80">
            <Calendar className="h-5 w-5 text-darcare-gold" />
            <div>
              <p className="text-sm text-darcare-beige/60">
                Submitted on {format(new Date(createdAt), "PPP")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetailHeader;
