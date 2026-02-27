import "./custom-toast.component.scss"  
import { Link } from "react-router-dom";
import type {CustomToastProps} from "@/types/custom-toast.type";
const CustomToast: React.FC<CustomToastProps> = ({ title, message, icon, activeLink,pathActiveLink, link ,pathLink }) => {
    return (
        <div className="toast-success">
            <div className="toast-success-header">
                <span>{icon}</span>
                <div className="">
                    <h6>{title}</h6>
                    <p style={{ margin: 0 }}>{message}</p>
                </div>
            </div>
            <div className="toast-success-footer">
                <Link to={`${pathLink}`}>{link}</Link>
                <Link to={`${pathActiveLink}`} className="active">{activeLink}</Link>
            </div>
        </div>
    )
}

export default CustomToast
