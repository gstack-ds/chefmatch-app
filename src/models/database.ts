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
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
