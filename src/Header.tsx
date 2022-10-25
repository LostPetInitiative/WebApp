import * as React from "react";
import { useTranslation } from "react-i18next";
import './Header.scss';

function Header(props: {} ) {
    const {t} = useTranslation()
    const kashtankaLocalized = t("kashtanka")
    return (
        <div className={"headerDiv"}>
            <div id="headerTextDiv">{kashtankaLocalized}</div>
        </div>
    );
}

export default Header;