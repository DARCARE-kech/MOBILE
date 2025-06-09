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
          category: Database["public"]["Enums"]["admin_message_category"]
          created_at: string
          id: string
          image_url: string | null
          manager_id: string | null
          message: string
          responded_at: string | null
          response: string | null
          status: Database["public"]["Enums"]["admin_message_status"]
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["admin_message_category"]
          created_at?: string
          id?: string
          image_url?: string | null
          manager_id?: string | null
          message: string
          responded_at?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["admin_message_status"]
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["admin_message_category"]
          created_at?: string
          id?: string
          image_url?: string | null
          manager_id?: string | null
          message?: string
          responded_at?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["admin_message_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_messages_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "manager_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_messages_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_messages_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "view_all_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_messages_user_profile_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "manager_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_messages_user_profile_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_messages_user_profile_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "view_all_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          sender: string | null
          thread_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          sender?: string | null
          thread_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          sender?: string | null
          thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["thread_id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          created_at: string | null
          id: string
          thread_id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          thread_id: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          thread_id?: string
          title?: string | null
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
          type: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          address: string | null
          category: string | null
          contact_phone: string | null
          description: string | null
          id: string
          image_url: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          opening_hours: string | null
          site: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          address?: string | null
          category?: string | null
          contact_phone?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          opening_hours?: string | null
          site?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          address?: string | null
          category?: string | null
          contact_phone?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          opening_hours?: string | null
          site?: string | null
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
      service_details: {
        Row: {
          category: string
          created_at: string | null
          default_duration: unknown | null
          id: string
          instructions: string | null
          optional_fields: Json | null
          price_range: string | null
          service_id: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          default_duration?: unknown | null
          id?: string
          instructions?: string | null
          optional_fields?: Json | null
          price_range?: string | null
          service_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          default_duration?: unknown | null
          id?: string
          instructions?: string | null
          optional_fields?: Json | null
          price_range?: string | null
          service_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_details_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
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
          staff_id: string | null
          staff_rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          request_id: string
          staff_id?: string | null
          staff_rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          request_id?: string
          staff_id?: string | null
          staff_rating?: number | null
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
          {
            foreignKeyName: "service_ratings_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_services"
            referencedColumns: ["staff_id"]
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
          profile_id: string | null
          selected_options: Json | null
          service_id: string | null
          space_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          note?: string | null
          preferred_time?: string | null
          profile_id?: string | null
          selected_options?: Json | null
          service_id?: string | null
          space_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          note?: string | null
          preferred_time?: string | null
          profile_id?: string | null
          selected_options?: Json | null
          service_id?: string | null
          space_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profile"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "manager_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profile"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profile"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "view_all_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean | null
          category: string | null
          description: string | null
          estimated_duration: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          description?: string | null
          estimated_duration?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          active?: boolean | null
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
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status: Database["public"]["Enums"]["order_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shop_products: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          stock: number | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock?: number | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock?: number | null
        }
        Relationships: []
      }
      space_form_schema: {
        Row: {
          created_at: string | null
          field_name: string
          id: string
          input_type: string
          label: string
          options: Json | null
          required: boolean | null
          space_id: string | null
        }
        Insert: {
          created_at?: string | null
          field_name: string
          id?: string
          input_type: string
          label: string
          options?: Json | null
          required?: boolean | null
          space_id?: string | null
        }
        Update: {
          created_at?: string | null
          field_name?: string
          id?: string
          input_type?: string
          label?: string
          options?: Json | null
          required?: boolean | null
          space_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "space_form_schema_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      space_reservations: {
        Row: {
          created_at: string | null
          custom_fields: Json | null
          id: string
          note: string | null
          number_of_people: number
          preferred_time: string
          space_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_fields?: Json | null
          id?: string
          note?: string | null
          number_of_people?: number
          preferred_time: string
          space_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_fields?: Json | null
          id?: string
          note?: string | null
          number_of_people?: number
          preferred_time?: string
          space_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_space_reservations_space"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_space_reservations_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "manager_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_space_reservations_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_space_reservations_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "view_all_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_reservations_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      spaces: {
        Row: {
          active: boolean | null
          capacity: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          rules: string | null
        }
        Insert: {
          active?: boolean | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          rules?: string | null
        }
        Update: {
          active?: boolean | null
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
          comment: string | null
          end_time: string | null
          id: string
          private_note: string | null
          request_id: string
          staff_id: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["affectation_status"] | null
        }
        Insert: {
          assigned_at?: string | null
          comment?: string | null
          end_time?: string | null
          id?: string
          private_note?: string | null
          request_id: string
          staff_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["affectation_status"] | null
        }
        Update: {
          assigned_at?: string | null
          comment?: string | null
          end_time?: string | null
          id?: string
          private_note?: string | null
          request_id?: string
          staff_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["affectation_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_staff_id"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_services"
            referencedColumns: ["staff_id"]
          },
          {
            foreignKeyName: "staff_assignments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_services: {
        Row: {
          created_at: string | null
          id: string
          phone_number: string | null
          service_id: string | null
          staff_id: string
          staff_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          phone_number?: string | null
          service_id?: string | null
          staff_id?: string
          staff_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          phone_number?: string | null
          service_id?: string | null
          staff_id?: string
          staff_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      status_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          request_id: string | null
          status: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          request_id?: string | null
          status?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          request_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "status_history_request_id_fkey"
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
          reservation_number: string | null
          resident_name: string | null
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
          reservation_number?: string | null
          resident_name?: string | null
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
          reservation_number?: string | null
          resident_name?: string | null
          status?: string
          user_id?: string | null
          villa_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_stays_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "manager_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stays_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stays_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "view_all_staff"
            referencedColumns: ["id"]
          },
        ]
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
          phone_number: string | null
          role: string
          status: string | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          whatsapp_number: string | null
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
          phone_number?: string | null
          role: string
          status?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          whatsapp_number?: string | null
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
          phone_number?: string | null
          role?: string
          status?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      villas: {
        Row: {
          active: boolean | null
          id: string
          label: string | null
          villa_number: string
        }
        Insert: {
          active?: boolean | null
          id?: string
          label?: string | null
          villa_number: string
        }
        Update: {
          active?: boolean | null
          id?: string
          label?: string | null
          villa_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      manager_profiles_view: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          role: string | null
          status: string | null
        }
        Relationships: []
      }
      staff_schedule_view: {
        Row: {
          assigned_at: string | null
          assignment_id: string | null
          assignment_status:
            | Database["public"]["Enums"]["affectation_status"]
            | null
          duration_minutes: number | null
          end_time: string | null
          estimated_duration: string | null
          is_future: boolean | null
          phone_number: string | null
          preferred_time: string | null
          request_created_at: string | null
          request_id: string | null
          request_status: string | null
          resident_name: string | null
          service_category: string | null
          service_name: string | null
          space_name: string | null
          staff_id: string | null
          staff_name: string | null
          start_time: string | null
          villa_number: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_staff_id"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_services"
            referencedColumns: ["staff_id"]
          },
          {
            foreignKeyName: "staff_assignments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_stays_view: {
        Row: {
          check_in: string | null
          check_out: string | null
          city: string | null
          email: string | null
          full_name: string | null
          guests: number | null
          reservation_number: string | null
          role: string | null
          status: string | null
          stay_id: string | null
          user_id: string | null
          villa_number: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_stays_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "manager_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stays_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stays_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "view_all_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      view_all_staff: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_agent_to_shop_order: {
        Args: { order_id: string; agent_staff_id: string }
        Returns: string
      }
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      enable_realtime: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_available_spaces: {
        Args: Record<PropertyKey, never>
        Returns: {
          active: boolean | null
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
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          stock: number | null
        }[]
      }
      jwt_custom_claims: {
        Args: { uid: string }
        Returns: Json
      }
    }
    Enums: {
      admin_message_category: "report" | "external_request" | "issue" | "other"
      admin_message_status: "unread" | "read" | "responded" | "in_progress"
      affectation_status:
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "reassigned"
        | "failed"
        | "no_show"
      order_status:
        | "submitted"
        | "confirmed"
        | "preparing"
        | "delivering"
        | "delivered"
        | "cancelled"
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
      admin_message_category: ["report", "external_request", "issue", "other"],
      admin_message_status: ["unread", "read", "responded", "in_progress"],
      affectation_status: [
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
        "reassigned",
        "failed",
        "no_show",
      ],
      order_status: [
        "submitted",
        "confirmed",
        "preparing",
        "delivering",
        "delivered",
        "cancelled",
      ],
      sender_type: ["user", "bot", "admin"],
    },
  },
} as const
