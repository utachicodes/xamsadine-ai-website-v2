import * as React from "react";
import type { Session, User, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type UserRole = 'user' | 'admin';

type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
};

type AuthState = {
  session: Session | null;
  user: (User & { user_metadata?: { role?: UserRole } }) | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithPassword: (params: { email: string; password: string }) => Promise<void>;
  signUp: (params: { email: string; password: string; fullName: string }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthState | undefined>(undefined);

// Function to get user role from metadata or email
const getUserRole = (user: User | null, profile: UserProfile | null): UserRole => {
  if (!user) return 'user';
  // Check profile role first (most reliable)
  if (profile?.role === 'admin') return 'admin';
  // Check if user has admin role in metadata
  if (user.user_metadata?.role === 'admin') return 'admin';
  // Fallback to email check (for backward compatibility)
  // Note: This should be removed in favor of profile-based roles
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  if (adminEmail && user.email === adminEmail) return 'admin';
  return 'user';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch user profile from database
  const fetchUserProfile = React.useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as UserProfile;
    } catch (error) {
      // Error is handled gracefully, no need to log in production
      if (import.meta.env.DEV) {
        console.error('Error fetching user profile:', error);
      }
      return null;
    }
  }, []);

  // Update auth state when session changes
  const handleAuthStateChange = React.useCallback(async (event: string, session: Session | null) => {
    setSession(session);
    
    if (session?.user) {
      const userProfile = await fetchUserProfile(session.user.id);
      setProfile(userProfile);
    } else {
      setProfile(null);
    }
    
    setLoading(false);
  }, [fetchUserProfile]);

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const userProfile = await fetchUserProfile(session.user.id);
        setProfile(userProfile);
      }
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, handleAuthStateChange]);

  const signInWithPassword = React.useCallback(async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = React.useCallback(async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email,
            full_name: fullName,
            role: 'user', // Default role
            created_at: new Date().toISOString(),
          });

        if (profileError) throw profileError;
      }

      return { error: null };
    } catch (error) {
      // Error is returned to caller, no need to log here
      if (import.meta.env.DEV) {
        console.error('Signup error:', error);
      }
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = React.useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const isAdmin = React.useMemo(() => {
    return getUserRole(session?.user ?? null, profile) === 'admin';
  }, [session, profile]);

  const value = React.useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isAdmin,
      loading,
      signInWithPassword,
      signUp,
      signOut,
    }),
    [session, profile, isAdmin, loading, signInWithPassword, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
