import {
  fetchAuthSession,
  getCurrentUser,
  signInWithRedirect,
  signOut,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthUser {
  userId: string;
  email: string | undefined;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  login: (provider?: "Google") => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  // Check if Cognito is configured
  useEffect(() => {
    const userPoolId = import.meta.env.BUN_PUBLIC_COGNITO_USER_POOL_ID;
    const userPoolClientId = import.meta.env.BUN_PUBLIC_COGNITO_CLIENT_ID;
    const cognitoDomain = import.meta.env.BUN_PUBLIC_COGNITO_DOMAIN;

    setIsConfigured(Boolean(userPoolId && userPoolClientId && cognitoDomain));
  }, []);

  // Check current auth state
  const checkAuthState = useCallback(async () => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      const payload = session.tokens?.idToken?.payload;

      setUser({
        userId: currentUser.userId,
        email: payload?.email as string | undefined,
        username: currentUser.username,
      });
    } catch {
      // User is not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured]);

  // Listen for auth events
  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    void checkAuthState();

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          void checkAuthState();
          break;
        case "signedOut":
          setUser(null);
          break;
        case "tokenRefresh":
          void checkAuthState();
          break;
      }
    });

    return () => unsubscribe();
  }, [isConfigured, checkAuthState]);

  const login = useCallback(
    async (provider?: "Google") => {
      if (!isConfigured) {
        console.warn("Authentication is not configured");
        return;
      }

      if (provider === "Google") {
        await signInWithRedirect({ provider: "Google" });
      } else {
        // Default: Use Cognito Hosted UI
        await signInWithRedirect();
      }
    },
    [isConfigured],
  );

  const logout = useCallback(async () => {
    if (!isConfigured) {
      return;
    }

    await signOut();
  }, [isConfigured]);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!isConfigured) {
      return null;
    }

    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() ?? null;
    } catch {
      return null;
    }
  }, [isConfigured]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        isConfigured,
        login,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
