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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_events: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown
          module: string
          new_data: Json | null
          old_data: Json | null
          organization_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          module: string
          new_data?: Json | null
          old_data?: Json | null
          organization_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          module?: string
          new_data?: Json | null
          old_data?: Json | null
          organization_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      branch_settings: {
        Row: {
          branch_id: string | null
          created_at: string
          group_name: string | null
          id: string
          organization_id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          group_name?: string | null
          id?: string
          organization_id: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          group_name?: string | null
          id?: string
          organization_id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branch_settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "organization_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      building_details: {
        Row: {
          amenities: Json | null
          approval_authority: string | null
          approved_plan_available: boolean | null
          area_unit: string | null
          building_age_years: number | null
          building_permission_number: string | null
          building_type: string | null
          built_up_area: number | null
          carpet_area: number | null
          completion_certificate: boolean | null
          construction_quality: string | null
          construction_status: string | null
          construction_type: string | null
          created_at: string | null
          deviations: string | null
          electricity_available: boolean | null
          id: string
          lift_available: boolean | null
          maintenance_condition: string | null
          number_of_floors: number | null
          occupancy_certificate: boolean | null
          occupancy_status: string | null
          organization_id: string
          parking_available: boolean | null
          plinth_area: number | null
          property_id: string
          remaining_life_years: number | null
          remarks: string | null
          super_built_up_area: number | null
          updated_at: string | null
          usage_type: string | null
          water_available: boolean | null
        }
        Insert: {
          amenities?: Json | null
          approval_authority?: string | null
          approved_plan_available?: boolean | null
          area_unit?: string | null
          building_age_years?: number | null
          building_permission_number?: string | null
          building_type?: string | null
          built_up_area?: number | null
          carpet_area?: number | null
          completion_certificate?: boolean | null
          construction_quality?: string | null
          construction_status?: string | null
          construction_type?: string | null
          created_at?: string | null
          deviations?: string | null
          electricity_available?: boolean | null
          id?: string
          lift_available?: boolean | null
          maintenance_condition?: string | null
          number_of_floors?: number | null
          occupancy_certificate?: boolean | null
          occupancy_status?: string | null
          organization_id: string
          parking_available?: boolean | null
          plinth_area?: number | null
          property_id: string
          remaining_life_years?: number | null
          remarks?: string | null
          super_built_up_area?: number | null
          updated_at?: string | null
          usage_type?: string | null
          water_available?: boolean | null
        }
        Update: {
          amenities?: Json | null
          approval_authority?: string | null
          approved_plan_available?: boolean | null
          area_unit?: string | null
          building_age_years?: number | null
          building_permission_number?: string | null
          building_type?: string | null
          built_up_area?: number | null
          carpet_area?: number | null
          completion_certificate?: boolean | null
          construction_quality?: string | null
          construction_status?: string | null
          construction_type?: string | null
          created_at?: string | null
          deviations?: string | null
          electricity_available?: boolean | null
          id?: string
          lift_available?: boolean | null
          maintenance_condition?: string | null
          number_of_floors?: number | null
          occupancy_certificate?: boolean | null
          occupancy_status?: string | null
          organization_id?: string
          parking_available?: boolean | null
          plinth_area?: number | null
          property_id?: string
          remaining_life_years?: number | null
          remarks?: string | null
          super_built_up_area?: number | null
          updated_at?: string | null
          usage_type?: string | null
          water_available?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "building_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "building_details_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      case_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          assigned_user_id: string
          assignment_role: string
          case_id: string
          due_date: string | null
          id: string
          is_active: boolean | null
          organization_id: string
          remarks: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_user_id: string
          assignment_role: string
          case_id: string
          due_date?: string | null
          id?: string
          is_active?: boolean | null
          organization_id: string
          remarks?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_user_id?: string
          assignment_role?: string
          case_id?: string
          due_date?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_assignments_assigned_user_id_fkey"
            columns: ["assigned_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_assignments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      case_comments: {
        Row: {
          case_id: string
          comment: string
          created_at: string | null
          created_by: string | null
          id: string
          is_internal: boolean | null
          organization_id: string
        }
        Insert: {
          case_id: string
          comment: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_internal?: boolean | null
          organization_id: string
        }
        Update: {
          case_id?: string
          comment?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_internal?: boolean | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_comments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      case_documents: {
        Row: {
          case_id: string
          document_category: string | null
          document_date: string | null
          document_name: string
          document_number: string | null
          file_size: number | null
          id: string
          metadata: Json | null
          mime_type: string | null
          organization_id: string
          property_id: string | null
          storage_bucket: string
          storage_path: string
          uploaded_at: string | null
          uploaded_by: string | null
          verification_remarks: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          case_id: string
          document_category?: string | null
          document_date?: string | null
          document_name: string
          document_number?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          organization_id: string
          property_id?: string | null
          storage_bucket?: string
          storage_path: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          verification_remarks?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          case_id?: string
          document_category?: string | null
          document_date?: string | null
          document_name?: string
          document_number?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          organization_id?: string
          property_id?: string | null
          storage_bucket?: string
          storage_path?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          verification_remarks?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_invoices: {
        Row: {
          balance_amount: number | null
          billing_address: Json | null
          case_id: string
          cgst_amount: number | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          igst_amount: number | null
          invoice_date: string | null
          invoice_number: string
          organization_id: string
          paid_amount: number | null
          remarks: string | null
          sgst_amount: number | null
          status: string | null
          subtotal: number | null
          taxable_amount: number | null
          total_amount: number | null
          total_tax: number | null
          updated_at: string | null
        }
        Insert: {
          balance_amount?: number | null
          billing_address?: Json | null
          case_id: string
          cgst_amount?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          igst_amount?: number | null
          invoice_date?: string | null
          invoice_number: string
          organization_id: string
          paid_amount?: number | null
          remarks?: string | null
          sgst_amount?: number | null
          status?: string | null
          subtotal?: number | null
          taxable_amount?: number | null
          total_amount?: number | null
          total_tax?: number | null
          updated_at?: string | null
        }
        Update: {
          balance_amount?: number | null
          billing_address?: Json | null
          case_id?: string
          cgst_amount?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          igst_amount?: number | null
          invoice_date?: string | null
          invoice_number?: string
          organization_id?: string
          paid_amount?: number | null
          remarks?: string | null
          sgst_amount?: number | null
          status?: string | null
          subtotal?: number | null
          taxable_amount?: number | null
          total_amount?: number | null
          total_tax?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_invoices_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      case_status_history: {
        Row: {
          case_id: string
          changed_at: string | null
          changed_by: string | null
          id: string
          new_status: string
          organization_id: string
          previous_status: string | null
          remarks: string | null
        }
        Insert: {
          case_id: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_status: string
          organization_id: string
          previous_status?: string | null
          remarks?: string | null
        }
        Update: {
          case_id?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_status?: string
          organization_id?: string
          previous_status?: string | null
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_status_history_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_status_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: Json | null
          client_code: string | null
          client_name: string
          client_type: string
          contact_person: string | null
          created_at: string | null
          email: string | null
          gstin: string | null
          id: string
          is_active: boolean | null
          organization_id: string
          pan: string | null
          phone: string | null
        }
        Insert: {
          address?: Json | null
          client_code?: string | null
          client_name: string
          client_type: string
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean | null
          organization_id: string
          pan?: string | null
          phone?: string | null
        }
        Update: {
          address?: Json | null
          client_code?: string | null
          client_name?: string
          client_type?: string
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string
          pan?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: Json | null
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          customer_code: string | null
          customer_name: string
          customer_type: string
          email: string | null
          id: string
          mobile: string | null
          organization_id: string
          pan: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_code?: string | null
          customer_name: string
          customer_type?: string
          email?: string | null
          id?: string
          mobile?: string | null
          organization_id: string
          pan?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_code?: string | null
          customer_name?: string
          customer_type?: string
          email?: string | null
          id?: string
          mobile?: string | null
          organization_id?: string
          pan?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount: number
          bank_name: string | null
          created_at: string | null
          id: string
          invoice_id: string
          organization_id: string
          payment_date: string | null
          payment_mode: string | null
          payment_reference: string | null
          received_by: string | null
          remarks: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          bank_name?: string | null
          created_at?: string | null
          id?: string
          invoice_id: string
          organization_id: string
          payment_date?: string | null
          payment_mode?: string | null
          payment_reference?: string | null
          received_by?: string | null
          remarks?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          bank_name?: string | null
          created_at?: string | null
          id?: string
          invoice_id?: string
          organization_id?: string
          payment_date?: string | null
          payment_mode?: string | null
          payment_reference?: string | null
          received_by?: string | null
          remarks?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "case_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_attempts: {
        Row: {
          attempt_number: number
          attempted_at: string | null
          error_message: string | null
          id: string
          notification_id: string
          organization_id: string
          provider_response: Json | null
          status: string
        }
        Insert: {
          attempt_number: number
          attempted_at?: string | null
          error_message?: string | null
          id?: string
          notification_id: string
          organization_id: string
          provider_response?: Json | null
          status: string
        }
        Update: {
          attempt_number?: number
          attempted_at?: string | null
          error_message?: string | null
          id?: string
          notification_id?: string
          organization_id?: string
          provider_response?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_attempts_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notification_outbox"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_attempts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_outbox: {
        Row: {
          attempts: number | null
          case_id: string | null
          channel: string
          created_at: string | null
          created_by: string | null
          id: string
          last_error: string | null
          message_body: string
          organization_id: string
          payload: Json | null
          processed_at: string | null
          provider_id: string | null
          recipient: string
          scheduled_at: string | null
          status: string | null
          subject: string | null
          template_id: string | null
        }
        Insert: {
          attempts?: number | null
          case_id?: string | null
          channel: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_error?: string | null
          message_body: string
          organization_id: string
          payload?: Json | null
          processed_at?: string | null
          provider_id?: string | null
          recipient: string
          scheduled_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
        }
        Update: {
          attempts?: number | null
          case_id?: string | null
          channel?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_error?: string | null
          message_body?: string
          organization_id?: string
          payload?: Json | null
          processed_at?: string | null
          provider_id?: string | null
          recipient?: string
          scheduled_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_outbox_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_outbox_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_outbox_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_outbox_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "notification_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_outbox_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          channel: string
          created_at: string | null
          event_code: string
          id: string
          is_enabled: boolean | null
          organization_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          event_code: string
          id?: string
          is_enabled?: boolean | null
          organization_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          event_code?: string
          id?: string
          is_enabled?: boolean | null
          organization_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_providers: {
        Row: {
          channel: string
          configuration: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          organization_id: string
          provider_code: string
          provider_name: string
          updated_at: string | null
        }
        Insert: {
          channel: string
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id: string
          provider_code: string
          provider_name: string
          updated_at?: string | null
        }
        Update: {
          channel?: string
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string
          provider_code?: string
          provider_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_providers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          channel: string
          created_at: string | null
          id: string
          is_active: boolean | null
          message_body: string
          organization_id: string
          subject: string | null
          template_code: string
          template_name: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_body: string
          organization_id: string
          subject?: string | null
          template_code: string
          template_name: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_body?: string
          organization_id?: string
          subject?: string | null
          template_code?: string
          template_name?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_webhook_events: {
        Row: {
          event_type: string | null
          external_event_id: string | null
          id: string
          organization_id: string | null
          payload: Json | null
          processed: boolean | null
          processed_at: string | null
          provider_code: string | null
          received_at: string | null
        }
        Insert: {
          event_type?: string | null
          external_event_id?: string | null
          id?: string
          organization_id?: string | null
          payload?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          provider_code?: string | null
          received_at?: string | null
        }
        Update: {
          event_type?: string | null
          external_event_id?: string | null
          id?: string
          organization_id?: string | null
          payload?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          provider_code?: string | null
          received_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_webhook_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_branches: {
        Row: {
          address: string | null
          branch_type: string
          case_prefix: string | null
          city: string | null
          code: string
          created_at: string
          email: string | null
          geofence_km: number
          id: string
          is_active: boolean
          manager_name: string | null
          name: string
          organization_id: string
          phone: string | null
          pincode: string | null
          state: string | null
          tat_days: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          branch_type?: string
          case_prefix?: string | null
          city?: string | null
          code: string
          created_at?: string
          email?: string | null
          geofence_km?: number
          id?: string
          is_active?: boolean
          manager_name?: string | null
          name: string
          organization_id: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          tat_days?: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          branch_type?: string
          case_prefix?: string | null
          city?: string | null
          code?: string
          created_at?: string
          email?: string | null
          geofence_km?: number
          id?: string
          is_active?: boolean
          manager_name?: string | null
          name?: string
          organization_id?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          tat_days?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_branches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          branch_name: string | null
          created_at: string | null
          employee_code: string | null
          id: string
          invited_at: string | null
          is_active: boolean | null
          joined_at: string | null
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          branch_name?: string | null
          created_at?: string | null
          employee_code?: string | null
          id?: string
          invited_at?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          organization_id: string
          role: string
          user_id: string
        }
        Update: {
          branch_name?: string | null
          created_at?: string | null
          employee_code?: string | null
          id?: string
          invited_at?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_role_permissions: {
        Row: {
          can_approve: boolean | null
          can_create: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          id: string
          organization_id: string
          permission_code: string
          role: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          can_approve?: boolean | null
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          id?: string
          organization_id: string
          permission_code: string
          role: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          can_approve?: boolean | null
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          id?: string
          organization_id?: string
          permission_code?: string
          role?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_role_permissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_role_permissions_permission_code_fkey"
            columns: ["permission_code"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["permission_code"]
          },
          {
            foreignKeyName: "organization_role_permissions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: Json | null
          code: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          gstin: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_type: string
          pan: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          code?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_type?: string
          pan?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          code?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_type?: string
          pan?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          module: string
          permission_code: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          module: string
          permission_code: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          module?: string
          permission_code?: string
        }
        Relationships: []
      }
      platform_admins: {
        Row: {
          admin_level: string
          created_at: string | null
          created_by: string | null
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          admin_level?: string
          created_at?: string | null
          created_by?: string | null
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          admin_level?: string
          created_at?: string | null
          created_by?: string | null
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_admins_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          access_details: string | null
          address_line: string | null
          boundaries: Json | null
          case_id: string
          created_at: string | null
          district: string | null
          door_number: string | null
          facing: string | null
          id: string
          khata_number: string | null
          land_area: number | null
          land_area_unit: string | null
          latitude: number | null
          locality: string | null
          location_remarks: string | null
          longitude: number | null
          mandal: string | null
          municipal_number: string | null
          neighborhood_details: string | null
          organization_id: string
          owner_names: string | null
          ownership_share: string | null
          ownership_type: string | null
          patta_number: string | null
          pincode: string | null
          plot_dimensions: Json | null
          plot_number: string | null
          property_category: string
          property_name: string | null
          road_type: string | null
          road_width: number | null
          road_width_unit: string | null
          state: string | null
          subdivision_number: string | null
          survey_number: string | null
          updated_at: string | null
          village: string | null
        }
        Insert: {
          access_details?: string | null
          address_line?: string | null
          boundaries?: Json | null
          case_id: string
          created_at?: string | null
          district?: string | null
          door_number?: string | null
          facing?: string | null
          id?: string
          khata_number?: string | null
          land_area?: number | null
          land_area_unit?: string | null
          latitude?: number | null
          locality?: string | null
          location_remarks?: string | null
          longitude?: number | null
          mandal?: string | null
          municipal_number?: string | null
          neighborhood_details?: string | null
          organization_id: string
          owner_names?: string | null
          ownership_share?: string | null
          ownership_type?: string | null
          patta_number?: string | null
          pincode?: string | null
          plot_dimensions?: Json | null
          plot_number?: string | null
          property_category: string
          property_name?: string | null
          road_type?: string | null
          road_width?: number | null
          road_width_unit?: string | null
          state?: string | null
          subdivision_number?: string | null
          survey_number?: string | null
          updated_at?: string | null
          village?: string | null
        }
        Update: {
          access_details?: string | null
          address_line?: string | null
          boundaries?: Json | null
          case_id?: string
          created_at?: string | null
          district?: string | null
          door_number?: string | null
          facing?: string | null
          id?: string
          khata_number?: string | null
          land_area?: number | null
          land_area_unit?: string | null
          latitude?: number | null
          locality?: string | null
          location_remarks?: string | null
          longitude?: number | null
          mandal?: string | null
          municipal_number?: string | null
          neighborhood_details?: string | null
          organization_id?: string
          owner_names?: string | null
          ownership_share?: string | null
          ownership_type?: string | null
          patta_number?: string | null
          pincode?: string | null
          plot_dimensions?: Json | null
          plot_number?: string | null
          property_category?: string
          property_name?: string | null
          road_type?: string | null
          road_width?: number | null
          road_width_unit?: string | null
          state?: string | null
          subdivision_number?: string | null
          survey_number?: string | null
          updated_at?: string | null
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      property_comparables: {
        Row: {
          adjusted_rate: number | null
          adjustments: Json | null
          area: number | null
          area_unit: string | null
          building_age_years: number | null
          case_id: string
          created_at: string | null
          description: string | null
          development_status: string | null
          distance_from_subject_km: number | null
          district: string | null
          entered_by: string | null
          evidence_document_id: string | null
          facing: string | null
          id: string
          locality: string | null
          organization_id: string
          property_id: string | null
          property_type: string | null
          rate_per_unit: number | null
          rate_unit: string | null
          reference_number: string | null
          reliability_score: number | null
          road_width: number | null
          source_contact: string | null
          source_name: string | null
          source_reference: string | null
          survey_number: string | null
          transaction_date: string | null
          transaction_price: number | null
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          adjusted_rate?: number | null
          adjustments?: Json | null
          area?: number | null
          area_unit?: string | null
          building_age_years?: number | null
          case_id: string
          created_at?: string | null
          description?: string | null
          development_status?: string | null
          distance_from_subject_km?: number | null
          district?: string | null
          entered_by?: string | null
          evidence_document_id?: string | null
          facing?: string | null
          id?: string
          locality?: string | null
          organization_id: string
          property_id?: string | null
          property_type?: string | null
          rate_per_unit?: number | null
          rate_unit?: string | null
          reference_number?: string | null
          reliability_score?: number | null
          road_width?: number | null
          source_contact?: string | null
          source_name?: string | null
          source_reference?: string | null
          survey_number?: string | null
          transaction_date?: string | null
          transaction_price?: number | null
          transaction_type?: string
          updated_at?: string | null
        }
        Update: {
          adjusted_rate?: number | null
          adjustments?: Json | null
          area?: number | null
          area_unit?: string | null
          building_age_years?: number | null
          case_id?: string
          created_at?: string | null
          description?: string | null
          development_status?: string | null
          distance_from_subject_km?: number | null
          district?: string | null
          entered_by?: string | null
          evidence_document_id?: string | null
          facing?: string | null
          id?: string
          locality?: string | null
          organization_id?: string
          property_id?: string | null
          property_type?: string | null
          rate_per_unit?: number | null
          rate_unit?: string | null
          reference_number?: string | null
          reliability_score?: number | null
          road_width?: number | null
          source_contact?: string | null
          source_name?: string | null
          source_reference?: string | null
          survey_number?: string | null
          transaction_date?: string | null
          transaction_price?: number | null
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_comparables_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_comparables_entered_by_fkey"
            columns: ["entered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_comparables_evidence_document_id_fkey"
            columns: ["evidence_document_id"]
            isOneToOne: false
            referencedRelation: "case_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_comparables_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_comparables_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_legal_details: {
        Row: {
          acquisition_status: string | null
          approvals: Json | null
          conversion_status: string | null
          created_at: string | null
          document_number: string | null
          ec_available: boolean | null
          encumbrance_status: string | null
          id: string
          land_use: string | null
          litigation_status: string | null
          observations: string | null
          organization_id: string
          property_id: string
          registered_extent: number | null
          registered_extent_unit: string | null
          registered_owner: string | null
          registration_date: string | null
          registration_office: string | null
          title_deed_type: string | null
          updated_at: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          zoning: string | null
        }
        Insert: {
          acquisition_status?: string | null
          approvals?: Json | null
          conversion_status?: string | null
          created_at?: string | null
          document_number?: string | null
          ec_available?: boolean | null
          encumbrance_status?: string | null
          id?: string
          land_use?: string | null
          litigation_status?: string | null
          observations?: string | null
          organization_id: string
          property_id: string
          registered_extent?: number | null
          registered_extent_unit?: string | null
          registered_owner?: string | null
          registration_date?: string | null
          registration_office?: string | null
          title_deed_type?: string | null
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          zoning?: string | null
        }
        Update: {
          acquisition_status?: string | null
          approvals?: Json | null
          conversion_status?: string | null
          created_at?: string | null
          document_number?: string | null
          ec_available?: boolean | null
          encumbrance_status?: string | null
          id?: string
          land_use?: string | null
          litigation_status?: string | null
          observations?: string | null
          organization_id?: string
          property_id?: string
          registered_extent?: number | null
          registered_extent_unit?: string | null
          registered_owner?: string | null
          registration_date?: string | null
          registration_office?: string | null
          title_deed_type?: string | null
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          zoning?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_legal_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_legal_details_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_legal_details_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_actions: {
        Row: {
          action_at: string | null
          action_by: string | null
          action_description: string | null
          action_type: string | null
          case_id: string
          id: string
          organization_id: string
          review_intake_id: string
        }
        Insert: {
          action_at?: string | null
          action_by?: string | null
          action_description?: string | null
          action_type?: string | null
          case_id: string
          id?: string
          organization_id: string
          review_intake_id: string
        }
        Update: {
          action_at?: string | null
          action_by?: string | null
          action_description?: string | null
          action_type?: string | null
          case_id?: string
          id?: string
          organization_id?: string
          review_intake_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_actions_action_by_fkey"
            columns: ["action_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_actions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_actions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_actions_review_intake_id_fkey"
            columns: ["review_intake_id"]
            isOneToOne: false
            referencedRelation: "review_intakes"
            referencedColumns: ["id"]
          },
        ]
      }
      review_intakes: {
        Row: {
          case_id: string
          corrections: Json | null
          created_at: string | null
          id: string
          organization_id: string
          remarks: string | null
          review_status: string | null
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          case_id: string
          corrections?: Json | null
          created_at?: string | null
          id?: string
          organization_id: string
          remarks?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          case_id?: string
          corrections?: Json | null
          created_at?: string | null
          id?: string
          organization_id?: string
          remarks?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_intakes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_intakes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_intakes_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          can_approve: boolean | null
          can_create: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          id: string
          permission_code: string
          role: string
        }
        Insert: {
          can_approve?: boolean | null
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          id?: string
          permission_code: string
          role: string
        }
        Update: {
          can_approve?: boolean | null
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          id?: string
          permission_code?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_code_fkey"
            columns: ["permission_code"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["permission_code"]
          },
        ]
      }
      service_catalog: {
        Row: {
          created_at: string | null
          currency: string | null
          default_fee: number | null
          description: string | null
          id: string
          is_active: boolean | null
          organization_id: string
          service_code: string | null
          service_name: string
          tax_rate: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          default_fee?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          organization_id: string
          service_code?: string | null
          service_name: string
          tax_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          default_fee?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string
          service_code?: string | null
          service_name?: string
          tax_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_catalog_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      site_visits: {
        Row: {
          assigned_to: string | null
          case_id: string
          checkin_at: string | null
          checkout_at: string | null
          completed_at: string | null
          created_at: string | null
          discrepancies: string | null
          geofence_distance_m: number | null
          geofence_verified: boolean | null
          gps_accuracy_m: number | null
          id: string
          latitude: number | null
          longitude: number | null
          measurements_checked: boolean | null
          observations: string | null
          organization_id: string
          ownership_documents_checked: boolean | null
          photo_count: number
          photographs_taken: boolean | null
          property_id: string | null
          property_identified: boolean | null
          scheduled_at: string | null
          started_at: string | null
          updated_at: string | null
          visit_data: Json | null
          visit_status: string | null
        }
        Insert: {
          assigned_to?: string | null
          case_id: string
          checkin_at?: string | null
          checkout_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          discrepancies?: string | null
          geofence_distance_m?: number | null
          geofence_verified?: boolean | null
          gps_accuracy_m?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          measurements_checked?: boolean | null
          observations?: string | null
          organization_id: string
          ownership_documents_checked?: boolean | null
          photo_count?: number
          photographs_taken?: boolean | null
          property_id?: string | null
          property_identified?: boolean | null
          scheduled_at?: string | null
          started_at?: string | null
          updated_at?: string | null
          visit_data?: Json | null
          visit_status?: string | null
        }
        Update: {
          assigned_to?: string | null
          case_id?: string
          checkin_at?: string | null
          checkout_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          discrepancies?: string | null
          geofence_distance_m?: number | null
          geofence_verified?: boolean | null
          gps_accuracy_m?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          measurements_checked?: boolean | null
          observations?: string | null
          organization_id?: string
          ownership_documents_checked?: boolean | null
          photo_count?: number
          photographs_taken?: boolean | null
          property_id?: string | null
          property_identified?: boolean | null
          scheduled_at?: string | null
          started_at?: string | null
          updated_at?: string | null
          visit_data?: Json | null
          visit_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_visits_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_visits_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_visits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_visits_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      valuation_cases: {
        Row: {
          assigned_field_executive: string | null
          assigned_manager: string | null
          assigned_valuer: string | null
          branch_id: string | null
          case_number: string
          case_type: string | null
          client_branch: string | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          expected_completion_date: string | null
          external_reference: string | null
          fee_amount: number | null
          id: string
          metadata: Json | null
          organization_id: string
          priority: string | null
          property_category: string
          received_at: string | null
          remarks: string | null
          requested_value: number | null
          stage: string
          status: string
          submitted_at: string | null
          tat_due_at: string | null
          updated_at: string | null
          valuation_purpose: string | null
        }
        Insert: {
          assigned_field_executive?: string | null
          assigned_manager?: string | null
          assigned_valuer?: string | null
          branch_id?: string | null
          case_number: string
          case_type?: string | null
          client_branch?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          expected_completion_date?: string | null
          external_reference?: string | null
          fee_amount?: number | null
          id?: string
          metadata?: Json | null
          organization_id: string
          priority?: string | null
          property_category: string
          received_at?: string | null
          remarks?: string | null
          requested_value?: number | null
          stage?: string
          status?: string
          submitted_at?: string | null
          tat_due_at?: string | null
          updated_at?: string | null
          valuation_purpose?: string | null
        }
        Update: {
          assigned_field_executive?: string | null
          assigned_manager?: string | null
          assigned_valuer?: string | null
          branch_id?: string | null
          case_number?: string
          case_type?: string | null
          client_branch?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          expected_completion_date?: string | null
          external_reference?: string | null
          fee_amount?: number | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          priority?: string | null
          property_category?: string
          received_at?: string | null
          remarks?: string | null
          requested_value?: number | null
          stage?: string
          status?: string
          submitted_at?: string | null
          tat_due_at?: string | null
          updated_at?: string | null
          valuation_purpose?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valuation_cases_assigned_field_executive_fkey"
            columns: ["assigned_field_executive"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuation_cases_assigned_manager_fkey"
            columns: ["assigned_manager"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuation_cases_assigned_valuer_fkey"
            columns: ["assigned_valuer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuation_cases_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "organization_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuation_cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuation_cases_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuation_cases_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuation_cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      valuation_reports: {
        Row: {
          bank_format: string | null
          case_id: string
          compliance_status: string | null
          generated_at: string | null
          generated_by: string | null
          ibbi_reg_no: string | null
          id: string
          is_final: boolean | null
          organization_id: string
          report_format: string | null
          report_number: string | null
          report_version: number | null
          signed_at: string | null
          signed_by: string | null
          storage_bucket: string | null
          storage_path: string | null
          submitted_at: string | null
          valuation_id: string | null
        }
        Insert: {
          bank_format?: string | null
          case_id: string
          compliance_status?: string | null
          generated_at?: string | null
          generated_by?: string | null
          ibbi_reg_no?: string | null
          id?: string
          is_final?: boolean | null
          organization_id: string
          report_format?: string | null
          report_number?: string | null
          report_version?: number | null
          signed_at?: string | null
          signed_by?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          submitted_at?: string | null
          valuation_id?: string | null
        }
        Update: {
          bank_format?: string | null
          case_id?: string
          compliance_status?: string | null
          generated_at?: string | null
          generated_by?: string | null
          ibbi_reg_no?: string | null
          id?: string
          is_final?: boolean | null
          organization_id?: string
          report_format?: string | null
          report_number?: string | null
          report_version?: number | null
          signed_at?: string | null
          signed_by?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          submitted_at?: string | null
          valuation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valuation_reports_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuation_reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuation_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuation_reports_signed_by_fkey"
            columns: ["signed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuation_reports_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      valuations: {
        Row: {
          adopted_building_rate: number | null
          adopted_land_rate: number | null
          amenities_value: number | null
          assumptions: string | null
          building_value: number | null
          calculation_details: Json | null
          case_id: string
          created_at: string | null
          currency: string
          depreciation_amount: number | null
          distress_value: number | null
          forced_sale_value: number | null
          guideline_value: number | null
          id: string
          land_value: number | null
          limitations: string | null
          market_value: number | null
          organization_id: string
          other_adjustments: number | null
          prepared_by: string | null
          property_id: string
          realizable_value: number | null
          remarks: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          valuation_date: string | null
          valuation_method: string
          version_number: number
        }
        Insert: {
          adopted_building_rate?: number | null
          adopted_land_rate?: number | null
          amenities_value?: number | null
          assumptions?: string | null
          building_value?: number | null
          calculation_details?: Json | null
          case_id: string
          created_at?: string | null
          currency?: string
          depreciation_amount?: number | null
          distress_value?: number | null
          forced_sale_value?: number | null
          guideline_value?: number | null
          id?: string
          land_value?: number | null
          limitations?: string | null
          market_value?: number | null
          organization_id: string
          other_adjustments?: number | null
          prepared_by?: string | null
          property_id: string
          realizable_value?: number | null
          remarks?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          valuation_date?: string | null
          valuation_method: string
          version_number?: number
        }
        Update: {
          adopted_building_rate?: number | null
          adopted_land_rate?: number | null
          amenities_value?: number | null
          assumptions?: string | null
          building_value?: number | null
          calculation_details?: Json | null
          case_id?: string
          created_at?: string | null
          currency?: string
          depreciation_amount?: number | null
          distress_value?: number | null
          forced_sale_value?: number | null
          guideline_value?: number | null
          id?: string
          land_value?: number | null
          limitations?: string | null
          market_value?: number | null
          organization_id?: string
          other_adjustments?: number | null
          prepared_by?: string | null
          property_id?: string
          realizable_value?: number | null
          remarks?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          valuation_date?: string | null
          valuation_method?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "valuations_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuations_prepared_by_fkey"
            columns: ["prepared_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valuations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_message_events: {
        Row: {
          case_id: string | null
          direction: string
          event_at: string | null
          event_status: string | null
          external_message_id: string | null
          id: string
          message_body: string | null
          message_type: string | null
          organization_id: string
          payload: Json | null
          recipient_phone: string | null
          sender_phone: string | null
          session_id: string | null
        }
        Insert: {
          case_id?: string | null
          direction: string
          event_at?: string | null
          event_status?: string | null
          external_message_id?: string | null
          id?: string
          message_body?: string | null
          message_type?: string | null
          organization_id: string
          payload?: Json | null
          recipient_phone?: string | null
          sender_phone?: string | null
          session_id?: string | null
        }
        Update: {
          case_id?: string | null
          direction?: string
          event_at?: string | null
          event_status?: string | null
          external_message_id?: string | null
          id?: string
          message_body?: string | null
          message_type?: string | null
          organization_id?: string
          payload?: Json | null
          recipient_phone?: string | null
          sender_phone?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_message_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_message_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_message_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_notification_outbox: {
        Row: {
          attachment_path: string | null
          attachment_type: string | null
          attempts: number | null
          case_id: string | null
          created_at: string | null
          created_by: string | null
          delivered_at: string | null
          external_message_id: string | null
          id: string
          last_error: string | null
          message_body: string
          organization_id: string
          read_at: string | null
          recipient_phone: string
          scheduled_at: string | null
          sent_at: string | null
          session_id: string | null
          status: string | null
        }
        Insert: {
          attachment_path?: string | null
          attachment_type?: string | null
          attempts?: number | null
          case_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_at?: string | null
          external_message_id?: string | null
          id?: string
          last_error?: string | null
          message_body: string
          organization_id: string
          read_at?: string | null
          recipient_phone: string
          scheduled_at?: string | null
          sent_at?: string | null
          session_id?: string | null
          status?: string | null
        }
        Update: {
          attachment_path?: string | null
          attachment_type?: string | null
          attempts?: number | null
          case_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_at?: string | null
          external_message_id?: string | null
          id?: string
          last_error?: string | null
          message_body?: string
          organization_id?: string
          read_at?: string | null
          recipient_phone?: string
          scheduled_at?: string | null
          sent_at?: string | null
          session_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_notification_outbox_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "valuation_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_notification_outbox_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_notification_outbox_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_notification_outbox_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_service_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string | null
          id: string
          log_level: string | null
          message: string | null
          organization_id: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type?: string | null
          id?: string
          log_level?: string | null
          message?: string | null
          organization_id?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string | null
          id?: string
          log_level?: string | null
          message?: string | null
          organization_id?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_service_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_service_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_sessions: {
        Row: {
          connected_at: string | null
          connection_status: string | null
          created_at: string | null
          id: string
          last_seen_at: string | null
          organization_id: string
          phone_number: string | null
          session_metadata: Json | null
          session_name: string
          updated_at: string | null
        }
        Insert: {
          connected_at?: string | null
          connection_status?: string | null
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          organization_id: string
          phone_number?: string | null
          session_metadata?: Json | null
          session_name: string
          updated_at?: string | null
        }
        Update: {
          connected_at?: string | null
          connection_status?: string | null
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          organization_id?: string
          phone_number?: string | null
          session_metadata?: Json | null
          session_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_organization_id: { Args: never; Returns: string }
      current_profile_role: { Args: never; Returns: string }
      has_org_permission: {
        Args: { p_action: string; p_org_id: string; p_permission_code: string }
        Returns: boolean
      }
      has_permission: {
        Args: { p_access_type?: string; p_permission_code: string }
        Returns: boolean
      }
      is_org_admin: { Args: { p_org_id: string }; Returns: boolean }
      is_org_member: { Args: { p_org_id: string }; Returns: boolean }
      is_platform_admin: { Args: never; Returns: boolean }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
