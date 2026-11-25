export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artworks: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          philosophy: string | null
          year: string | null
          medium: string | null
          dimensions: string | null
          price: number | null
          currency: string | null
          status: 'available' | 'sold' | 'not_for_sale' | 'in_progress' | string
          category: string | null
          image_path: string | null
          image_url: string | null
          thumbnail_url: string | null
          sort_order: number
          is_published: boolean
          featured: boolean
          accession: string | null
          width: number | null
          height: number | null
          aspect_ratio: number | null
          verification_status: string | null
          is_locked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          philosophy?: string | null
          year?: string | null
          medium?: string | null
          dimensions?: string | null
          price?: number | null
          currency?: string | null
          status?: 'available' | 'sold' | 'not_for_sale' | 'in_progress' | string
          category?: string | null
          image_path?: string | null
          image_url?: string | null
          thumbnail_url?: string | null
          sort_order?: number
          is_published?: boolean
          featured?: boolean
          accession?: string | null
          width?: number | null
          height?: number | null
          aspect_ratio?: number | null
          verification_status?: string | null
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          philosophy?: string | null
          year?: string | null
          medium?: string | null
          dimensions?: string | null
          price?: number | null
          currency?: string | null
          status?: 'available' | 'sold' | 'not_for_sale' | 'in_progress' | string
          category?: string | null
          image_path?: string | null
          image_url?: string | null
          thumbnail_url?: string | null
          sort_order?: number
          is_published?: boolean
          featured?: boolean
          accession?: string | null
          width?: number | null
          height?: number | null
          aspect_ratio?: number | null
          verification_status?: string | null
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      artwork_images: {
        Row: {
          id: string
          artwork_id: string
          image_path: string
          image_url: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          artwork_id: string
          image_path: string
          image_url: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          artwork_id?: string
          image_path?: string
          image_url?: string
          sort_order?: number
          created_at?: string
        }
      }
      emails: {
        Row: {
          id: string
          direction: 'inbound' | 'outbound'
          from_email: string
          to_email: string
          subject: string | null
          body_text: string | null
          body_html: string | null
          status: 'unread' | 'read' | 'sent' | 'failed'
          thread_id: string | null
          provider_message_id: string | null
          received_at: string | null
          sent_at: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          direction: 'inbound' | 'outbound'
          from_email: string
          to_email: string
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          status?: 'unread' | 'read' | 'sent' | 'failed'
          thread_id?: string | null
          provider_message_id?: string | null
          received_at?: string | null
          sent_at?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          direction?: 'inbound' | 'outbound'
          from_email?: string
          to_email?: string
          subject?: string | null
          body_text?: string | null
          body_html?: string | null
          status?: 'unread' | 'read' | 'sent' | 'failed'
          thread_id?: string | null
          provider_message_id?: string | null
          received_at?: string | null
          sent_at?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}
