import { useEffect } from "react";
import type { ReactNode } from "react";
import { useCurrentUser, clearUserCache } from "@/hooks";
import { handleLogout } from "@/msalConfig";

interface AccessRolesProps {
  children: ReactNode;
}

const AccessRoles: React.FC<AccessRolesProps> = ({ children }) => {
  const { user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    // If user data is loaded and user cannot access admin
    if (!isLoading && user && user.canAccessAdmin === false) {
      console.log("⛔ User does not have admin access, logging out...");

      sessionStorage.clear();
      localStorage.clear();
      clearUserCache(); // Clear the user cache

      handleLogout();
    }

    // Log errors if any
    if (error) {
      console.error("❌ Error in AccessRoles:", error);
    }
  }, [user, isLoading, error]);

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default AccessRoles;