
// This file now redirects to the useServiceRequest.tsx implementation
// It's a compatibility layer for existing imports
import { useServiceRequestById, useServiceRequest } from './useServiceRequest.tsx';
import type { ServiceLocationState } from './useServiceRequest.tsx';

export type { ServiceLocationState };
export { useServiceRequestById };
export const useServiceRequestForForm = useServiceRequest;
export default useServiceRequestById;
