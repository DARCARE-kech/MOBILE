
import type { ServiceDetail, ServiceFormData } from '@/hooks/services/types';

// Helper function to generate default values based on optional fields
export function generateDefaultValues(optionalFields: Record<string, any>): Record<string, any> {
  const defaults: Record<string, any> = {};
  
  if (!optionalFields) return defaults;
  
  // Handle select fields (dropdowns)
  if (optionalFields.selectFields) {
    optionalFields.selectFields.forEach((field: any) => {
      defaults[field.name] = field.defaultValue || '';
    });
  }
  
  // Handle number fields
  if (optionalFields.numberFields) {
    optionalFields.numberFields.forEach((field: any) => {
      defaults[field.name] = field.defaultValue || '';
    });
  }
  
  // Handle multiselect fields (checkbox groups)
  if (optionalFields.multiSelectFields) {
    optionalFields.multiSelectFields.forEach((field: any) => {
      const fieldDefaults: Record<string, boolean> = {};
      field.options.forEach((opt: string) => {
        fieldDefaults[opt.replace(/\s+/g, '_').toLowerCase()] = false;
      });
      defaults[field.name] = fieldDefaults;
    });
  }
  
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

// Use the shared FormData type
export type { ServiceFormData as FormData };

export interface ServiceFormProps {
  serviceId: string;
  serviceType: string;
  serviceName?: string;
  serviceImageUrl?: string | null;
  serviceDetails?: ServiceDetail;
  optionalFields: Record<string, any>;
  onSubmitSuccess?: (formData: ServiceFormData) => void;
}
