
/**
 * Converts keys from API/database format to user-friendly labels
 * E.g., "cleaning_type" -> "Cleaning Type"
 */
export const formatFieldKey = (key: string): string => {
  if (!key) return '';
  
  // If there's a dot in the key (like "services.cleaningType"), 
  // only format the part after the dot
  const cleanKey = key.includes('.') ? key.split('.').pop() || key : key;
  
  // Replace underscores and hyphens with spaces
  return cleanKey
    .replace(/[_-]/g, ' ')
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters for camelCase
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

/**
 * Formats a date and time from ISO string to human-readable format
 */
export const formatDateTime = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  } catch (e) {
    return isoDate;
  }
};

/**
 * Safely render selected options from a JSON object
 */
export const renderSelectedOptions = (options: Record<string, any>): Array<{label: string, value: string | string[] | boolean | number}> => {
  if (!options || typeof options !== 'object') return [];

  return Object.entries(options)
    .filter(([key, value]) => {
      // Filter out null, undefined, empty arrays, and empty strings
      if (value === null || value === undefined) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      // Skip keys that are meant to be internal
      return !key.startsWith('_') && key !== 'note';
    })
    .map(([key, value]) => {
      // Format the label - remove any "services." prefix and convert to title case
      const label = formatFieldKey(key);
      
      // Format array values (like selected rooms)
      if (Array.isArray(value)) {
        // Format each item in the array
        const formattedValues = value.map(item => 
          typeof item === 'string' ? formatFieldKey(item) : String(item)
        );
        return { label, value: formattedValues };
      }
      
      // Format boolean values
      if (typeof value === 'boolean') {
        return { label, value };
      }
      
      // Format numeric values
      if (typeof value === 'number') {
        return { label, value };
      }
      
      // Format string values
      return { 
        label, 
        value: typeof value === 'string' ? formatFieldKey(value) : String(value) 
      };
    });
};
