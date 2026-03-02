export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          role: 'chef' | 'consumer';
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          role: 'chef' | 'consumer';
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          role?: 'chef' | 'consumer';
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chef_profiles: {
        Row: {
          id: string;
          user_id: string;
          tier: 'classically_trained' | 'home_chef';
          bio: string;
          cuisine_specialties: string[];
          photos: string[];
          service_models: string[];
          price_range_min: number;
          price_range_max: number;
          service_radius: number;
          latitude: number | null;
          longitude: number | null;
          allergens_cant_accommodate: string[];
          background_check_status: 'not_started' | 'pending' | 'passed' | 'failed';
          training_completed: boolean;
          is_live: boolean;
          average_rating: number | null;
          total_reviews: number;
          completed_events: number;
          home_chef_level: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier: 'classically_trained' | 'home_chef';
          bio?: string;
          cuisine_specialties?: string[];
          photos?: string[];
          service_models?: string[];
          price_range_min?: number;
          price_range_max?: number;
          service_radius?: number;
          latitude?: number | null;
          longitude?: number | null;
          allergens_cant_accommodate?: string[];
          background_check_status?: 'not_started' | 'pending' | 'passed' | 'failed';
          training_completed?: boolean;
          is_live?: boolean;
          average_rating?: number | null;
          total_reviews?: number;
          completed_events?: number;
          home_chef_level?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tier?: 'classically_trained' | 'home_chef';
          bio?: string;
          cuisine_specialties?: string[];
          photos?: string[];
          service_models?: string[];
          price_range_min?: number;
          price_range_max?: number;
          service_radius?: number;
          latitude?: number | null;
          longitude?: number | null;
          allergens_cant_accommodate?: string[];
          background_check_status?: 'not_started' | 'pending' | 'passed' | 'failed';
          training_completed?: boolean;
          is_live?: boolean;
          average_rating?: number | null;
          total_reviews?: number;
          completed_events?: number;
          home_chef_level?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chef_profiles_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      chef_availability: {
        Row: {
          id: string;
          chef_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
        };
        Insert: {
          id?: string;
          chef_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
        };
        Update: {
          id?: string;
          chef_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chef_availability_chef_id_fkey';
            columns: ['chef_id'];
            referencedRelation: 'chef_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      menu_items: {
        Row: {
          id: string;
          chef_id: string;
          name: string;
          description: string;
          price: number;
          allergens: string[];
          is_available: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chef_id: string;
          name: string;
          description?: string;
          price: number;
          allergens?: string[];
          is_available?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chef_id?: string;
          name?: string;
          description?: string;
          price?: number;
          allergens?: string[];
          is_available?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'menu_items_chef_id_fkey';
            columns: ['chef_id'];
            referencedRelation: 'chef_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      consumer_profiles: {
        Row: {
          id: string;
          user_id: string;
          allergies: string[];
          dietary_restrictions: string[];
          preferred_cuisines: string[];
          max_budget: number | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          allergies?: string[];
          dietary_restrictions?: string[];
          preferred_cuisines?: string[];
          max_budget?: number | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          allergies?: string[];
          dietary_restrictions?: string[];
          preferred_cuisines?: string[];
          max_budget?: number | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'consumer_profiles_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      swipes: {
        Row: {
          id: string;
          consumer_id: string;
          chef_id: string;
          direction: 'like' | 'pass';
          created_at: string;
        };
        Insert: {
          id?: string;
          consumer_id: string;
          chef_id: string;
          direction: 'like' | 'pass';
          created_at?: string;
        };
        Update: {
          id?: string;
          consumer_id?: string;
          chef_id?: string;
          direction?: 'like' | 'pass';
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'swipes_consumer_id_fkey';
            columns: ['consumer_id'];
            referencedRelation: 'consumer_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'swipes_chef_id_fkey';
            columns: ['chef_id'];
            referencedRelation: 'chef_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      conversations: {
        Row: {
          id: string;
          consumer_id: string;
          chef_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          consumer_id: string;
          chef_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          consumer_id?: string;
          chef_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'conversations_consumer_id_fkey';
            columns: ['consumer_id'];
            referencedRelation: 'consumer_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'conversations_chef_id_fkey';
            columns: ['chef_id'];
            referencedRelation: 'chef_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey';
            columns: ['conversation_id'];
            referencedRelation: 'conversations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_sender_id_fkey';
            columns: ['sender_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      bookings: {
        Row: {
          id: string;
          consumer_id: string;
          chef_id: string;
          conversation_id: string | null;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          service_model: 'full_service' | 'collaborative';
          event_date: string;
          party_size: number;
          occasion: string;
          special_requests: string;
          grocery_arrangement: 'chef_provides' | 'consumer_provides' | 'split';
          total_price: number | null;
          location_address: string | null;
          location_latitude: number | null;
          location_longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          consumer_id: string;
          chef_id: string;
          conversation_id?: string | null;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          service_model: 'full_service' | 'collaborative';
          event_date: string;
          party_size: number;
          occasion?: string;
          special_requests?: string;
          grocery_arrangement?: 'chef_provides' | 'consumer_provides' | 'split';
          total_price?: number | null;
          location_address?: string | null;
          location_latitude?: number | null;
          location_longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          consumer_id?: string;
          chef_id?: string;
          conversation_id?: string | null;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          service_model?: 'full_service' | 'collaborative';
          event_date?: string;
          party_size?: number;
          occasion?: string;
          special_requests?: string;
          grocery_arrangement?: 'chef_provides' | 'consumer_provides' | 'split';
          total_price?: number | null;
          location_address?: string | null;
          location_latitude?: number | null;
          location_longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bookings_consumer_id_fkey';
            columns: ['consumer_id'];
            referencedRelation: 'consumer_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_chef_id_fkey';
            columns: ['chef_id'];
            referencedRelation: 'chef_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_conversation_id_fkey';
            columns: ['conversation_id'];
            referencedRelation: 'conversations';
            referencedColumns: ['id'];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          text?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          rating?: number;
          text?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_booking_id_fkey';
            columns: ['booking_id'];
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_reviewer_id_fkey';
            columns: ['reviewer_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_reviewee_id_fkey';
            columns: ['reviewee_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
