import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import type { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type ProtectionProps = { children: ReactNode };

interface JWTPayload {
  userId: string;
  exp: number;
}

export default function ProtectionRoute({ children }: ProtectionProps) {
  const auth = useAuth();
  const { uid } = useParams();
  const token = localStorage.getItem("token");

  // 1️⃣ Decide if token is malformed or expired:
  let isExpiredOrBad = false;
  if (token) {
    try {
      const { exp } = jwtDecode<JWTPayload>(token);
      isExpiredOrBad = exp * 1000 <= Date.now();
    } catch {
      isExpiredOrBad = true;
    }
  }

  // 2️⃣ Perform logout as a side-effect, not during render:
  useEffect(() => {
    if (isExpiredOrBad) {
      auth.logout();
    }
  }, [isExpiredOrBad, auth]);

  if (!token || isExpiredOrBad) {
    // expired or malformed → we've already scheduled logout above
    return <Navigate to="/" replace />;
  }

  // safe to decode and compare now:
  const { userId } = jwtDecode<JWTPayload>(token);
  if (userId !== uid) {
    // wrong user → not their page
    return <Navigate to="/" replace />;
  }

  // all good!
  return children;
}
