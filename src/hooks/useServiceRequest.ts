
// This file now redirects to the useServiceRequest.tsx implementation
// It's a compatibility layer for existing imports
import { useServiceRequest } from './services/useServiceRequest';
import { useServiceRequestById } from './services/useServiceRequestById';
import type { ServiceLocationState, UseServiceRequestResult, ServiceDetail, ServiceFormData } from './services/types';

export type { ServiceLocationState, UseServiceRequestResult, ServiceDetail, ServiceFormData };
export { useServiceRequest, useServiceRequestById };
export const useServiceRequestForForm = useServiceRequest;
export default useServiceRequestById;
