
import { UseFormReturn } from 'react-hook-form';

// Define interface for form data
export interface FormData {
  preferredDate?: string;
  preferredTime?: string;
  note?: string;
  selectedOption?: string;
  selectedCategory?: string;
  date?: Date; // Add date field for space booking forms
  [key: string]: any;
}

// Define interface for service form data - used by specific service request endpoints
export interface ServiceFormData {
  preferredDate: string; // Required in ServiceFormData
  preferredTime: string; // Required in ServiceFormData
  note?: string;
  selectedOption?: string;
  selectedCategory?: string;
  [key: string]: any;
}

// Define props for service forms
export interface ServiceFormProps {
  serviceId?: string;
  serviceType: string;
  serviceName?: string;
  serviceImageUrl?: string;
  serviceDetails?: any;
  optionalFields?: Record<string, any>;
  existingRequest?: any;
  editMode?: boolean;
  onSubmitSuccess?: (data: FormData) => void;
}

// Generate default values for form based on optional fields
export const generateDefaultValues = (optionalFields?: Record<string, any>): Record<string, any> => {
  if (!optionalFields) return {};
  
  const defaultValues: Record<string, any> = {};
  
  // Process select fields
  if (optionalFields.selectFields) {
    optionalFields.selectFields.forEach((field: any) => {
      defaultValues[field.name] = field.defaultValue || '';
    });
  }
  
  // Process number fields
  if (optionalFields.numberFields) {
    optionalFields.numberFields.forEach((field: any) => {
      defaultValues[field.name] = field.defaultValue || field.min || 1;
    });
  }
  
  // Process multi-select fields
  if (optionalFields.multiSelectFields) {
    optionalFields.multiSelectFields.forEach((field: any) => {
      field.options.forEach((option: string) => {
        const fieldName = `${field.name}.${option.replace(/\s+/g, '_').toLowerCase()}`;
        defaultValues[fieldName] = false;
      });
    });
  }
  
  // Process options
  if (optionalFields.options) {
    defaultValues.selectedOption = '';
  }
  
  // Process categories
  if (optionalFields.categories) {
    defaultValues.selectedCategory = '';
  }
  
  // Process check options
  if (optionalFields.checkOptions) {
    optionalFields.checkOptions.forEach((option: string) => {
      const fieldName = `checkOptions.check_${option.replace(/\s+/g, '_').toLowerCase()}`;
      defaultValues[fieldName] = false;
    });
  }
  
  // Process custom fields
  if (optionalFields.customFields) {
    optionalFields.customFields.forEach((field: any) => {
      defaultValues[field.name] = field.defaultValue || '';
    });
  }
  
  return defaultValues;
};
