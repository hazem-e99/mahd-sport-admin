// Authentication disabled - bypass MSAL provider
// import { type ReactNode } from "react"

// export const AppMsalProvider = ({ children }: { children: ReactNode }) => {
//     // Authentication disabled - directly render children
//     return (
//         <>
//             {children}
//         </>
//     )
// }

// Original MSAL implementation (commented out)
import { initializeMsal, msalInstance } from "@/msalConfig"
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from "@azure/msal-react"
import { useEffect, useState, type ReactNode } from "react"
import { AuthRedirect } from "./AuthRedirect"
import { UnauthorizedMessage } from "./UnauthorizedMessage"
import { UserProvider } from "@/context/UserContext"

export const AppMsalProvider = ({ children }: { children: ReactNode }) => {
    const [msalReady, setMsalReady] = useState(false);

    useEffect(() => {
        initializeMsal().then(() => {
            setMsalReady(true);
        }).catch((error) => {
            console.error('[AppMsalProvider] Failed to initialize MSAL:', error);
            // Still set as ready to show error state
            setMsalReady(true);
        });
    }, []);

    if (!msalReady) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <MsalProvider instance={msalInstance}>
            <AuthenticatedTemplate>
                <UserProvider>
                    <AuthRedirect />
                    {children}
                </UserProvider>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <UnauthorizedMessage />
            </UnauthenticatedTemplate>
        </MsalProvider>
    )
}



