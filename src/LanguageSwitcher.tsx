import { DefaultButton, Dropdown, IconButton, IContextualMenuProps, IDropdownOption } from "@fluentui/react";
import * as React from "react";
import { useTranslation } from "react-i18next";

const languageOptions: {key:string, text:string}[] = [
        { key: 'ru', text: '🇷🇺' },
        { key: 'en', text: '🇬🇧' },
    ];


export function LanguageSwitcher() {
    const {i18n} = useTranslation()
    
    const [lang,setLang] = React.useState(() => i18n.language)

    var curLangIdx = languageOptions.findIndex((e => e.key == lang))
    if (curLangIdx == -1)
        curLangIdx = 0
    const curLangMeta = languageOptions[curLangIdx] 

    React.useEffect(() => {
        if (lang != i18n.language)
            i18n.changeLanguage(lang)
    },[lang])


    return (
        <p style={{textAlign: "center", cursor: "pointer"}} title={"Switch language"} onClick={() => {setLang(languageOptions[(curLangIdx+1)%languageOptions.length].key)}}>{curLangMeta.text}</p>
    )
}