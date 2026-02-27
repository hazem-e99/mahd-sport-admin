import React from "react";
import SvgNotificationicon from "@/components/icons/notification-icon";
import "./notification-bell.component.scss";
import { useLanguage } from "@/context/languageContext";
import { Link } from "react-router";

const NotificationBell: React.FC = () => {
  const { language } = useLanguage();
  return (
    <Link to={`/${language}/notification`} className="notification-bell">
      <span className="notification-bell-icon">
        <SvgNotificationicon />
        {/* <span className="notification-bell-icon-dot">23</span> */}
      </span>
    </Link>
  );
};
export default NotificationBell;
