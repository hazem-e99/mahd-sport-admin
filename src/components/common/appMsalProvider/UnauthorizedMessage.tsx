import { handleLogin } from "@/msalConfig";
import { useEffect, useState, useRef } from "react";

export const UnauthorizedMessage = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasAttemptedLogin = useRef(false);

  useEffect(() => {
    const startLoginProcess = async () => {
      // Prevent multiple login attempts
      if (hasAttemptedLogin.current || isRedirecting) {
        return;
      }

      try {
        const interactionStatus = sessionStorage.getItem(
          "msal.interaction.status"
        );

        // Only check interactionStatus, not hasRedirected
        if (interactionStatus) {
          console.log("⏳ MSAL interaction in progress, skipping login...");
          return;
        }

        hasAttemptedLogin.current = true;
        setIsRedirecting(true);

        // Clear any stale hasRedirected flag
        sessionStorage.removeItem("hasRedirected");

        setTimeout(async () => {
          try {
            await handleLogin();
          } catch (error) {
            console.error("error:", error);
            sessionStorage.removeItem("hasRedirected");
            sessionStorage.removeItem("msal.interaction.status");
            setIsRedirecting(false);
            hasAttemptedLogin.current = false;
          }
        }, 1000);
      } catch (error) {
        console.error(":error", error);
        setIsRedirecting(false);
        hasAttemptedLogin.current = false;
      }
    };

    startLoginProcess();
  }, [isRedirecting]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
        <h4 className="text-muted">
          {isRedirecting ? "Redirecting to login..." : "Please wait..."}
        </h4>
        <p className="text-muted">
          {isRedirecting
            ? "You will be redirected to Microsoft login shortly..."
            : "Preparing the login page..."}
        </p>
      </div>
    </div>
  );
};

