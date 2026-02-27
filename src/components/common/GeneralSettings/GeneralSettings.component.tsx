import { Tabs, Tab } from "react-bootstrap"
import PageHeaderActions from "../pageHeaderActions/pageheader-actions.component"
import PortalBasics from "../PortalBasics/PortalBasics.component"
import ConflictDeclaration from "../ConflictDeclaration/ConflictDeclaration.component"
import TemporaryTheme from "../TemporaryTheme/TemporaryTheme.component"
import "./GeneralSettings.component.scss"
import { useLanguage } from "@/context/languageContext";

const GeneralSettings = () => {
      const { getValue } = useLanguage();
    return (
        <div >
            <PageHeaderActions title={getValue("General_Setting")} showBtns={false} breadcrumb={
                <>
                    <ul className="menu-breadcrumb">
                        <li>{getValue("home")} </li>
                        <li>-</li>
                        <li> {getValue("General_Setting")}</li>
                    </ul>
                </>
            } />
            <div className="tabds_settings">
                <Tabs
                    defaultActiveKey="PortalBasics"
                    id="uncontrolled-tab-example"
                    className="mb-3 tab_list"
                >
                    <Tab eventKey="PortalBasics" title={getValue("Portal_Basics")}>
                        <div className="card_tab_sec">
                            <PortalBasics />
                        </div>
                    </Tab>
                    <Tab eventKey="ConflictDeclaration" title={getValue("Conflict_Declaration")}>
                        <div className="card_tab_sec">
                            <ConflictDeclaration />
                        </div>
                    </Tab>
                    <Tab eventKey="TemporaryTheme" title={getValue("Temporary_Theme")}>
                        <div className="card_tab_sec">
                            <TemporaryTheme />
                        </div>
                    </Tab>


                </Tabs>
            </div>
        </div>
    )
}

export default GeneralSettings
