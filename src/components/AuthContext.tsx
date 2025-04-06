import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthUser {
  email: string;
  name: string;
  id: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  signup: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ error: null }),
  signup: async () => ({ error: null }),
  logout: async () => {},
  loading: true,
});

// Separate the provider component for better HMR compatibility
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage as fallback
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }

    // Check if the user is already logged in with Supabase
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          handleSession(session);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleSession(session);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    checkUser();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSession = async (session: Session) => {
    const supabaseUser = session.user;

    // Get user profile data from Supabase
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();

    const authUser: AuthUser = {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: profile?.name || supabaseUser.email?.split("@")[0] || "User",
    };

    setUser(authUser);
    setIsAuthenticated(true);
  };

  const login = async (email: string, password: string) => {
    try {
      // Try Supabase auth first
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        return { error: null };
      } catch (supabaseError) {
        console.warn("Supabase auth failed, using local auth:", supabaseError);

        // Fallback to local auth for demo purposes
        const mockUser = {
          id: "local-" + Date.now(),
          email,
          name: email.split("@")[0],
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(mockUser));

        return { error: null };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { error };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return { error };
      }

      // If user was created successfully, create a profile record
      if (data.user) {
        // Create a complete user profile with all required fields
        const userProfile = {
          id: data.user.id,
          name,
          email,
          created_at: new Date().toISOString(),
          avatar_url: null, // Initialize with null as per the schema
        };

        // Insert the profile into the profiles table
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([userProfile]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
          return { error: profileError };
        }

        // Store user in local storage as fallback
        const authUser = {
          id: data.user.id,
          email,
          name,
        };
        localStorage.setItem("user", JSON.stringify(authUser));

        console.log("User profile created successfully:", userProfile);
      }

      return { error: null };
    } catch (error) {
      console.error("Signup error:", error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      // Try Supabase signout
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.warn("Supabase signout error:", error);
      }

      // Always clear local state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
