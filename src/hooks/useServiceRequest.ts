
// This file now redirects to the useServiceRequest.tsx implementation
// It's a compatibility layer for existing imports
import { useServiceRequestById, useServiceRequest as useServiceRequestForForm, ServiceLocationState } from './useServiceRequest.tsx';

export { ServiceLocationState };
export const useServiceRequest = useServiceRequestById;
export default useServiceRequestById;
