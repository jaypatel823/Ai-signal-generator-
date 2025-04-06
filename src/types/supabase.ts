export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          name: string;
          email: string;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          avatar_url?: string | null;
        };
      };
      signals: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          market: string;
          direction: string;
          confidence: number;
          timeframe: string;
          executed: boolean;
          result: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          market: string;
          direction: string;
          confidence: number;
          timeframe: string;
          executed?: boolean;
          result?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          market?: string;
          direction?: string;
          confidence?: number;
          timeframe?: string;
          executed?: boolean;
          result?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}
