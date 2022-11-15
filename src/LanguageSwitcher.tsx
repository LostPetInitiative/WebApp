import * as React from "react";
import { useTranslation } from "react-i18next";

import enSVG from './img/lang/en.svg'
import ruSVG from './img/lang/ru.svg'

const languageOptions: {key:string, imgSrc:string}[] = [
        { key: 'ru', imgSrc: ruSVG },
        { key: 'en', imgSrc: enSVG },
    ];


export function LanguageSwitcher() {
    const {t, i18n} = useTranslation()

    const dummy = t("kashtanka") // this re-renderes the switcher if the language changes
    
    const [lang,setLang] = React.useState(() => i18n.resolvedLanguage)

    let curLangIdx = languageOptions.findIndex((e => e.key == lang))
    if (curLangIdx == -1)
        curLangIdx = 0
    const curLangMeta = languageOptions[curLangIdx] 

    React.useEffect(() => {
        if (lang != i18n.resolvedLanguage)
            i18n.changeLanguage(lang)
    },[lang, dummy, i18n])


    return (
        <img style={{textAlign: "center", cursor: "pointer", alignSelf:"center", width:"50%", margin:"8px"}} title={"Switch language"} src={curLangMeta.imgSrc} onClick={() => {setLang(languageOptions[(curLangIdx+1)%languageOptions.length].key)}} />
    )
}