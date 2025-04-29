
// This file now redirects to the useServiceRequest.tsx implementation
// It's a compatibility layer for existing imports
import { useServiceRequestById } from './useServiceRequest.tsx';

export const useServiceRequest = useServiceRequestById;
export default useServiceRequestById;
