import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, useParams } from "react-router";
import Navbar from "./components/common/navBar/nav-bar.component";
import SideBar from "./components/common/sideBar/side-bar.component";

// import { useTranslation } from 'react-i18next';
//import Tabs from './components/common/tabs/tabs.component';
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationService, type LocalizationItem } from './api/services/localization.service';
import "./App.scss";
// import { AppMsalProvider } from "./components/common/appMsalProvider/AppMsalProvider";
import { LanguageProvider } from "./context/languageContext";
// import AccessRoles from "./components/common/ProtectedLayer/AccessRoles";
import { UserProvider } from "./context/UserContext";

function App() {
  const { i18n } = useTranslation();

  const language = i18n.language;

  const params = useParams<{ lng: string }>();

  const [localizations, setLocalizations] = useState<LocalizationItem[]>([]);
  const lastFetchedLangRef = useRef<string>("");

  const fetchLocalizations = useCallback(async (currentCulture: string) => {
    try {
      const response = await LocalizationService.getAll({
        culture: currentCulture,
      });
      setLocalizations(response);
      lastFetchedLangRef.current = currentCulture;
    } catch {
      setLocalizations([]);
    }
  }, []);

  useEffect(() => {
    const currentLang = params.lng || language;
    if (
      currentLang &&
      ["ar", "en"].includes(currentLang) &&
      currentLang !== lastFetchedLangRef.current
    ) {
      fetchLocalizations(currentLang);
    }
  }, [fetchLocalizations, params.lng, language]);

  return (
    <UserProvider>
      <LanguageProvider localizations={localizations}>
        <div className="d-flex vh-100 overflow-hidden">
          {/* Sidebar */}
          <div className="sidebar-wrapper">
            <SideBar />
          </div>
          {/* Main Content */}
          <div className="app-container__body w-full d-flex flex-column flex-grow-1">
            {/* Top Navigation */}
            <div className="sticky-top">
              <Navbar />
            </div>

            {/* Main Content Area */}
            <div className="content-wrapper h-100 p-3 overflow-auto">
              <div className="container h-100">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </LanguageProvider>
    </UserProvider>
  );
}

export default App;


