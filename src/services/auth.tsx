import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Platform } from "react-native";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

/**
 * Auth state backed by Supabase Auth (email + password). Session is persisted
 * via the supabase client's AsyncStorage storage adapter and refreshed
 * automatically.
 */
type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  /** true while the user is following a password-reset link (show "set a new password"). */
  recovery: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  loading: true,
  recovery: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  resetPassword: async () => ({}),
  updatePassword: async () => ({}),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      // When the user opens a password-reset link, Supabase signs them into a
      // short-lived recovery session and fires PASSWORD_RECOVERY. We route them
      // to the "set a new password" screen instead of into the app.
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { error: error?.message };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    if (error) return { error: error.message };
    // If email confirmation is enabled, there is no session until confirmed.
    return { needsConfirmation: !data.session };
  };

  const resetPassword = async (email: string) => {
    // On web the reset link returns to the app's own URL, where the supabase
    // client (detectSessionInUrl) processes the recovery token. On native the
    // link opens the default handler; the email itself carries the flow.
    const redirectTo =
      Platform.OS === "web" && typeof window !== "undefined" ? window.location.origin : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      redirectTo ? { redirectTo } : undefined
    );
    return { error: error?.message };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.message };
    setRecovery(false);
    return {};
  };

  const signOut = async () => {
    setRecovery(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        recovery,
        signIn,
        signUp,
        resetPassword,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
