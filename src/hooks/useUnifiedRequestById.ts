
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getStaffAssignmentsForRequest, getServiceRatingsForRequest } from './services/serviceHelpers';

/**
 * Hook unifié pour récupérer les détails d'une requête (service ou espace)
 */
export const useUnifiedRequestById = (id: string | undefined, type?: 'service' | 'space') => {
  return useQuery({
    queryKey: ['unified-request', id, type],
    queryFn: async () => {
      if (!id) throw new Error("Request ID is required");
      
      // Déterminer le type automatiquement si non fourni
      let requestType = type;
      if (!requestType) {
        // Vérifier d'abord dans service_requests
        const { data: serviceCheck } = await supabase
          .from('service_requests')
          .select('id')
          .eq('id', id)
          .single();
        
        if (serviceCheck) {
          requestType = 'service';
        } else {
          requestType = 'space';
        }
      }
      
      if (requestType === 'service') {
        const { data, error } = await supabase
          .from('service_requests')
          .select(`
            *,
            services(*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;

        // Récupérer les assignations staff et ratings pour les services
        const staffAssignments = await getStaffAssignmentsForRequest(id);
        const serviceRatings = await getServiceRatingsForRequest(id);
        
        return {
          ...data,
          type: 'service' as const,
          staff_assignments: staffAssignments,
          service_ratings: serviceRatings,
          name: data.services?.name || 'Service'
        };
      } else {
        const { data, error } = await supabase
          .from('space_reservations')
          .select(`
            *,
            spaces(*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        return {
          ...data,
          type: 'space' as const,
          staff_assignments: null,
          service_ratings: null,
          name: data.spaces?.name || 'Space',
          // Mapper les champs pour compatibilité
          service_id: null,
          services: null,
          selected_options: data.custom_fields,
          image_url: null // Ajouter image_url pour les espaces
        };
      }
    },
    enabled: !!id
  });
};
