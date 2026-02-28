import { useState } from "react";
import SvgUserSurveyConfig from "@/components/icons/user-survey-config";
import SvgPlaySquare from "@/components/icons/play-square";
import "./home.scss";
import { useLanguage } from "@/context/languageContext";
import HomeCard from "./components/home-card/home-card.component";
import UploadModal from "@/pages/cardControl/pages/UploadModal/UploadModal";

const Home = () => {
    const { language, getValue } = useLanguage();
    const [showSoundModal, setShowSoundModal] = useState(false);

    const configurations = [
        {
            id: 1,
            title: getValue("card_control") || "Card Control",
            desc: getValue("manage_employee_cards") || "Manage employee cards, visibility and ordering",
            icon: <SvgUserSurveyConfig className="card-icon" />,
            urlToGo: `/${language}/card-control`,
        },
        {
            id: 2,
            title: getValue("sound_controller") || "Sound Controller",
            desc: getValue("manage_sounds") || "Manage sounds and audio settings",
            icon: <SvgPlaySquare className="card-icon" />,
            onClick: () => setShowSoundModal(true),
        },
        {
            id: 3,
            title: getValue("General_Setting") || "General Settings",
            desc: getValue("General_Setting_Desc") || "Manage portal basics, colors, and themes",
            icon: <SvgUserSurveyConfig className="card-icon" />,
            urlToGo: `/${language}/GeneralSettings`,
        },
    ];

    return (
        <div className="home-container">
            <div className="home-container__header">
                <span className="home-container__header-title">
                    {getValue("welcome_to_mahad_sport_admin") || "Welcome to Mahd Sport Admin"}
                </span>
                <span className="home-container__header-desc">{""}</span>
            </div>
            <div className="home-container__body">
                <h6>{getValue("configuration") || "Configuration"}</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {configurations.map((config) => (
                        <HomeCard {...config} key={config.id} />
                    ))}
                </div>
            </div>

            <UploadModal
                show={showSoundModal}
                handleClose={() => setShowSoundModal(false)}
                setFileName={() => { }}
                setValue={() => { }}
                clearErrors={() => { }}
                trigger={async () => true}
                name="sound_file"
                accept="audio/*"
            />
        </div>
    );
};

export default Home;
