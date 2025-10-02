export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          background_color: string | null
          banner_type: string | null
          brand_id: string | null
          button_text: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          link_url: string | null
          subtitle: string | null
          text_color: string | null
          title: string
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          banner_type?: string | null
          brand_id?: string | null
          button_text?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          link_url?: string | null
          subtitle?: string | null
          text_color?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          banner_type?: string | null
          brand_id?: string | null
          button_text?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          link_url?: string | null
          subtitle?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "banners_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_size_charts: {
        Row: {
          brand_id: string
          category_ids: string[]
          created_at: string
          garment_type: string
          id: string
          size_system: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          category_ids?: string[]
          created_at?: string
          garment_type: string
          id?: string
          size_system: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          category_ids?: string[]
          created_at?: string
          garment_type?: string
          id?: string
          size_system?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_size_charts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string
          description: string | null
          domain: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          slug: string
          theme_config: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          slug: string
          theme_config?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string
          theme_config?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          brand_id: string | null
          category_level: number | null
          created_at: string
          display_order: number | null
          icon_url: string | null
          id: string
          image_url: string | null
          name: string
          parent_category_id: string | null
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          category_level?: number | null
          created_at?: string
          display_order?: number | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_category_id?: string | null
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          category_level?: number | null
          created_at?: string
          display_order?: number | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_category_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      device_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          kiosk_session_id: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          kiosk_session_id: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          kiosk_session_id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          chest_inches: number | null
          created_at: string | null
          hip_inches: number | null
          id: string
          inseam_length_inches: number | null
          length_inches: number | null
          product_id: string
          shoulder_inches: number | null
          size: string
          size_chart_measurement_id: string | null
          sku: string | null
          stock_quantity: number | null
          updated_at: string | null
          waist_inches: number | null
        }
        Insert: {
          chest_inches?: number | null
          created_at?: string | null
          hip_inches?: number | null
          id?: string
          inseam_length_inches?: number | null
          length_inches?: number | null
          product_id: string
          shoulder_inches?: number | null
          size: string
          size_chart_measurement_id?: string | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          waist_inches?: number | null
        }
        Update: {
          chest_inches?: number | null
          created_at?: string | null
          hip_inches?: number | null
          id?: string
          inseam_length_inches?: number | null
          length_inches?: number | null
          product_id?: string
          shoulder_inches?: number | null
          size?: string
          size_chart_measurement_id?: string | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          waist_inches?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_size_chart_measurement_id_fkey"
            columns: ["size_chart_measurement_id"]
            isOneToOne: false
            referencedRelation: "size_chart_measurements"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_images: string[] | null
          barcode: string | null
          brand: string | null
          brand_id: string | null
          care_instructions: string | null
          category_id: string | null
          color_code: string | null
          colors: Json | null
          created_at: string
          description: string | null
          discount_percentage: number | null
          gender: string | null
          id: string
          image_url: string
          is_new: boolean | null
          is_on_offer: boolean | null
          is_trending: boolean | null
          material: string | null
          material_group: string | null
          name: string
          original_price: number | null
          price: number
          season: string | null
          sizes: string[] | null
          stock_quantity: number | null
          style_number: string | null
          updated_at: string
        }
        Insert: {
          additional_images?: string[] | null
          barcode?: string | null
          brand?: string | null
          brand_id?: string | null
          care_instructions?: string | null
          category_id?: string | null
          color_code?: string | null
          colors?: Json | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          gender?: string | null
          id?: string
          image_url: string
          is_new?: boolean | null
          is_on_offer?: boolean | null
          is_trending?: boolean | null
          material?: string | null
          material_group?: string | null
          name: string
          original_price?: number | null
          price: number
          season?: string | null
          sizes?: string[] | null
          stock_quantity?: number | null
          style_number?: string | null
          updated_at?: string
        }
        Update: {
          additional_images?: string[] | null
          barcode?: string | null
          brand?: string | null
          brand_id?: string | null
          care_instructions?: string | null
          category_id?: string | null
          color_code?: string | null
          colors?: Json | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          gender?: string | null
          id?: string
          image_url?: string
          is_new?: boolean | null
          is_on_offer?: boolean | null
          is_trending?: boolean | null
          material?: string | null
          material_group?: string | null
          name?: string
          original_price?: number | null
          price?: number
          season?: string | null
          sizes?: string[] | null
          stock_quantity?: number | null
          style_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          chest: number | null
          created_at: string
          full_name: string | null
          gender: string | null
          height: number | null
          id: string
          pants_size: number | null
          photos: string[] | null
          shirt_size: string | null
          style_preferences: string[] | null
          updated_at: string
          user_id: string
          waist: number | null
          weight: number | null
        }
        Insert: {
          avatar_url?: string | null
          chest?: number | null
          created_at?: string
          full_name?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          pants_size?: number | null
          photos?: string[] | null
          shirt_size?: string | null
          style_preferences?: string[] | null
          updated_at?: string
          user_id: string
          waist?: number | null
          weight?: number | null
        }
        Update: {
          avatar_url?: string | null
          chest?: number | null
          created_at?: string
          full_name?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          pants_size?: number | null
          photos?: string[] | null
          shirt_size?: string | null
          style_preferences?: string[] | null
          updated_at?: string
          user_id?: string
          waist?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      size_chart_measurements: {
        Row: {
          chest_inches: number | null
          created_at: string
          display_order: number
          hips_inches: number | null
          id: string
          inseam_inches: number | null
          length_inches: number | null
          shoulder_inches: number | null
          size_chart_id: string
          size_label: string
          updated_at: string
          waist_inches: number | null
        }
        Insert: {
          chest_inches?: number | null
          created_at?: string
          display_order: number
          hips_inches?: number | null
          id?: string
          inseam_inches?: number | null
          length_inches?: number | null
          shoulder_inches?: number | null
          size_chart_id: string
          size_label: string
          updated_at?: string
          waist_inches?: number | null
        }
        Update: {
          chest_inches?: number | null
          created_at?: string
          display_order?: number
          hips_inches?: number | null
          id?: string
          inseam_inches?: number | null
          length_inches?: number | null
          shoulder_inches?: number | null
          size_chart_id?: string
          size_label?: string
          updated_at?: string
          waist_inches?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "size_chart_measurements_size_chart_id_fkey"
            columns: ["size_chart_id"]
            isOneToOne: false
            referencedRelation: "brand_size_charts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
