import { supabase } from './client';

// Define RPC functions types here
export interface StaffAssignment {
  id: string;
  request_id: string;
  staff_id: string | null;
  staff_name: string | null;
  assigned_at: string;
}

export interface ServiceRating {
  id: string;
  request_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string | null;
}

// Get staff assignments for a specific request
export const getStaffAssignmentsForRequest = async (requestId: string): Promise<StaffAssignment[]> => {
  try {
    // Use a direct query instead of an rpc call since the database doesn't match the types.ts file
    const { data, error } = await supabase
      .from('staff_assignments')
      .select('*')
      .eq('request_id', requestId);
    
    if (error) {
      console.error('Error in getStaffAssignmentsForRequest:', error);
      return [];
    }
    
    return data as StaffAssignment[];
  } catch (err) {
    console.error('Caught error in getStaffAssignmentsForRequest:', err);
    return [];
  }
};

// Get service ratings for a specific request
export const getServiceRatingsForRequest = async (requestId: string): Promise<ServiceRating[]> => {
  try {
    // Use a direct query instead of an rpc call since the database doesn't match the types.ts file
    const { data, error } = await supabase
      .from('service_ratings')
      .select('*')
      .eq('request_id', requestId);
    
    if (error) {
      console.error('Error in getServiceRatingsForRequest:', error);
      return [];
    }
    
    return data as ServiceRating[];
  } catch (err) {
    console.error('Caught error in getServiceRatingsForRequest:', err);
    return [];
  }
};

// New interfaces for spaces and shop products
export interface Space {
  id: string;
  name: string;
  description: string | null;
  capacity: number | null;
  image_url: string | null;
  rules: string | null;
  created_at: string | null;
}

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
}

// Get all available spaces
export const getAvailableSpaces = async (): Promise<Space[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_available_spaces');
    
    if (error) {
      console.error('Error in getAvailableSpaces:', error);
      return [];
    }
    
    return data as Space[];
  } catch (err) {
    console.error('Caught error in getAvailableSpaces:', err);
    return [];
  }
};

// Get all shop products
export const getShopProducts = async (): Promise<ShopProduct[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_shop_products');
    
    if (error) {
      console.error('Error in getShopProducts:', error);
      return [];
    }
    
    return data as ShopProduct[];
  } catch (err) {
    console.error('Caught error in getShopProducts:', err);
    return [];
  }
};
