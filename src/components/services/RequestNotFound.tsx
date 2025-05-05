
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RequestNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-4 text-center text-darcare-beige">
      <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-darcare-gold" />
      <h2 className="text-xl font-medium text-darcare-white mb-2">Request Not Found</h2>
      <p>The requested service request could not be found or has been deleted.</p>
      <Button 
        className="mt-8 bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
        onClick={() => navigate('/services')}
      >
        Back to Services
      </Button>
    </div>
  );
};

export default RequestNotFound;
