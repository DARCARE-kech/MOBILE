
// Helper function to generate default values based on optional fields
export function generateDefaultValues(optionalFields: Record<string, any>): Record<string, any> {
  const defaults: Record<string, any> = {};
  
  if (!optionalFields) return defaults;
  
  // Handle options (single selection fields)
  if (optionalFields.options) {
    defaults.selectedOption = '';
  }
  
  // Handle categories (single selection fields)
  if (optionalFields.categories) {
    defaults.selectedCategory = '';
  }
  
  // Handle checkboxes (multiple selection)
  if (optionalFields.checkOptions) {
    const checkDefaults: Record<string, boolean> = {};
    optionalFields.checkOptions.forEach((opt: string) => {
      checkDefaults[`check_${opt.replace(/\s+/g, '_').toLowerCase()}`] = false;
    });
    defaults.checkOptions = checkDefaults;
  }
  
  // Handle custom fields
  if (optionalFields.customFields) {
    optionalFields.customFields.forEach((field: any) => {
      if (field.type === 'checkbox') {
        defaults[field.name] = false;
      } else if (field.type === 'radio') {
        defaults[field.name] = '';
      } else {
        defaults[field.name] = '';
      }
    });
  }
  
  return defaults;
}

// Type definitions for form data
export interface FormData {
  preferredDate: string;
  preferredTime: string;
  note: string;
  selectedCategory?: string;
  selectedOption?: string;
  [key: string]: any; // For additional dynamic fields
}

export interface ServiceDetail {
  id?: string;
  service_id?: string;
  category?: string;
  instructions?: string | null;
  optional_fields?: Record<string, any> | null;
  price_range?: string | null;
  default_duration?: string | null;
}

export interface ServiceFormProps {
  serviceId: string;
  serviceType: string;
  serviceName?: string;
  serviceImageUrl?: string | null;
  serviceDetails?: ServiceDetail;
  optionalFields: Record<string, any>;
  onSubmitSuccess?: (formData: FormData) => void;
}
