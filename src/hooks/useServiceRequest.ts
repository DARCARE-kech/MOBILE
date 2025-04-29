
// This file now redirects to the useServiceRequest.tsx implementation
// It's a compatibility layer for existing imports
import { useServiceRequestById, useServiceRequest as useServiceRequestForForm } from './useServiceRequest.tsx';
import type { ServiceLocationState } from './useServiceRequest.tsx';

export type { ServiceLocationState };
export { useServiceRequestById, useServiceRequestForForm };
export const useServiceRequest = useServiceRequestById;
export default useServiceRequestById;
