export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string | null
          id: string
          recommendation_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recommendation_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recommendation_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          category: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          title: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          category: string | null
          description: string | null
          id: string
          image_url: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          title: string
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          title: string
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          title?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number | null
          recommendation_id: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          recommendation_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          recommendation_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          note: string | null
          preferred_time: string | null
          service_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          note?: string | null
          preferred_time?: string | null
          service_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          note?: string | null
          preferred_time?: string | null
          service_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          description: string | null
          estimated_duration: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          category?: string | null
          description?: string | null
          estimated_duration?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          category?: string | null
          description?: string | null
          estimated_duration?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      stays: {
        Row: {
          check_in: string | null
          check_out: string | null
          city: string | null
          created_at: string | null
          guests: number | null
          id: string
          status: string
          user_id: string | null
          villa_number: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          city?: string | null
          created_at?: string | null
          guests?: number | null
          id?: string
          status: string
          user_id?: string | null
          villa_number: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          city?: string | null
          created_at?: string | null
          guests?: number | null
          id?: string
          status?: string
          user_id?: string | null
          villa_number?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          language: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id: string
          language?: string | null
          role: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          language?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      get_recommendation_avg_rating: {
        Args: { rec_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
