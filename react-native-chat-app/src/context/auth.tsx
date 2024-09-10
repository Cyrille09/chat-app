import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<string | undefined>("");
  const rootSegment = useSegments()[0];
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;

    if (!user && rootSegment !== "(auth)") {
      router.replace("/(auth)");
    }

    if (user && rootSegment !== "(tabs)") {
      return router.replace("/(tabs)");
    }
  }, [user, rootSegment]);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        signIn: () => {
          setUser("Beto");
        },
        signOut: () => {
          setUser("");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
