
/**
 * Types for service request hooks and components
 */

// Location state interface for service requests
export interface ServiceLocationState {
  serviceType?: string;
  serviceId?: string;
  category?: string;
  option?: string;
  tripType?: string;
}

// Result interface for useServiceRequest hook
export interface UseServiceRequestResult {
  serviceState: ServiceLocationState;
  service: any;
  serviceDetails: ServiceDetail | null;
  isLoading: boolean;
  enhanceOptionalFields: () => Record<string, any>;
  getServiceTitle: () => string;
}

// Service detail interface shared across components and hooks
export interface ServiceDetail {
  id?: string;
  service_id?: string;
  category?: string;
  instructions?: string | null;
  optional_fields?: Record<string, any> | null;
  price_range?: string | null;
  default_duration?: string | null;
}

// Form data interface for service requests - matches with FormData in formHelpers.ts
export interface ServiceFormData {
  preferredDate: string;
  preferredTime: string;
  note?: string;
  selectedCategory?: string;
  selectedOption?: string;
  date?: Date;
  [key: string]: any; // For additional dynamic fields
}
