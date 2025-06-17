
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
      
      console.log("🔍 Fetching unified request data for ID:", id);
      
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
      
      console.log("📝 Request type determined:", requestType);
      
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
        
        console.log("📊 Service ratings fetched:", serviceRatings);
        console.log("👨‍💼 Staff assignments fetched:", staffAssignments);
        
        const result = {
          ...data,
          type: 'service' as const,
          staff_assignments: staffAssignments,
          service_ratings: serviceRatings,
          name: data.services?.name || 'Service'
        };
        
        console.log("🎯 Final unified request data for service:", result);
        return result;
      } else {
        const { data, error } = await supabase
          .from('space_reservations')
          .select(`
            *,
            spaces!space_reservations_space_id_fkey(*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        const result = {
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
        
        console.log("🏢 Final unified request data for space:", result);
        return result;
      }
    },
    enabled: !!id
  });
};
