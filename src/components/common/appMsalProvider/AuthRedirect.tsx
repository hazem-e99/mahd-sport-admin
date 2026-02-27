import { useCurrentUser } from "@/hooks";
import { useLanguage } from "@/context/languageContext";
import { useIsAuthenticated } from "@azure/msal-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const AuthRedirect = () => {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isLoading } = useCurrentUser();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.removeItem("hasRedirected");
      hasRedirectedRef.current = false;
      return;
    }

    // Only redirect once when authenticated and user data is loaded
    if (
      isAuthenticated &&
      !isLoading &&
      !hasRedirectedRef.current &&
      !sessionStorage.getItem("hasRedirected")
    ) {
      hasRedirectedRef.current = true;
      sessionStorage.setItem("hasRedirected", "true");

      console.log("🔄 Redirecting to home with user data:", user);

      navigate(`/${language}/home`, {
        replace: true,
        state: { user },
      });
    }
  }, [isAuthenticated, isLoading, user, navigate, language]);

  return null;
};
