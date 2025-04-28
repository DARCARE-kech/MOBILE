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
      admin_messages: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          message: string
          status: Database["public"]["Enums"]["admin_message_status"]
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          message: string
          status?: Database["public"]["Enums"]["admin_message_status"]
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          message?: string
          status?: Database["public"]["Enums"]["admin_message_status"]
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          id: string
          sender: Database["public"]["Enums"]["sender_type"]
          session_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          content: string
          id?: string
          sender: Database["public"]["Enums"]["sender_type"]
          session_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          sender?: Database["public"]["Enums"]["sender_type"]
          session_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_threads: {
        Row: {
          created_at: string | null
          id: string
          thread_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          thread_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          thread_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
          address: string | null
          category: string | null
          contact_phone: string | null
          description: string | null
          email: string | null
          id: string
          image_url: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          opening_hours: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          address?: string | null
          category?: string | null
          contact_phone?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          opening_hours?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          address?: string | null
          category?: string | null
          contact_phone?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          opening_hours?: string | null
          tags?: string[] | null
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
      service_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          request_id: string
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          request_id: string
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          request_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_ratings_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
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
      shop_order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price_at_time: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price_at_time: number
          product_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price_at_time?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "shop_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_orders: {
        Row: {
          created_at: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shop_products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      spaces: {
        Row: {
          capacity: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          rules: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          rules?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          rules?: string | null
        }
        Relationships: []
      }
      staff_assignments: {
        Row: {
          assigned_at: string | null
          id: string
          request_id: string
          staff_id: string | null
          staff_name: string | null
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          request_id: string
          staff_id?: string | null
          staff_name?: string | null
        }
        Update: {
          assigned_at?: string | null
          id?: string
          request_id?: string
          staff_id?: string | null
          staff_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_assignments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
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
          dark_mode: boolean | null
          email: string | null
          full_name: string
          id: string
          language: string | null
          notifications_enabled: boolean | null
          role: string
          terms_accepted: boolean | null
          terms_accepted_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          email?: string | null
          full_name: string
          id: string
          language?: string | null
          notifications_enabled?: boolean | null
          role: string
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          email?: string | null
          full_name?: string
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          role?: string
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
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
      get_available_spaces: {
        Args: Record<PropertyKey, never>
        Returns: {
          capacity: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          rules: string | null
        }[]
      }
      get_current_stay: {
        Args: { user_id: string }
        Returns: {
          villa_number: string
          check_in: string
          check_out: string
          status: string
        }[]
      }
      get_recommendation_avg_rating: {
        Args: { rec_id: string }
        Returns: number
      }
      get_shop_products: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
        }[]
      }
    }
    Enums: {
      admin_message_status: "unread" | "read" | "responded"
      sender_type: "user" | "bot" | "admin"
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
    Enums: {
      admin_message_status: ["unread", "read", "responded"],
      sender_type: ["user", "bot", "admin"],
    },
  },
} as const
