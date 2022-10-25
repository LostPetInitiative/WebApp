import * as React from "react";
import { Persona, PersonaSize, Stack,
     Facepile, IFacepilePersona, OverflowButtonType, Text, ActionButton } from "@fluentui/react";

    import { useTranslation } from 'react-i18next';

import DmitryPhotoUrl from './img/team/Dmitry.jpg'
import TeePhotoUrl from './img/team/Tee.jpg'
import LucyPhotoUrl from './img/team/Lucy.webp'
import NikolayPhotoUrl from './img/team/Nikolay.webp'
import VyachecslavPhotoUrl from './img/team/Vyacheslav.webp'

type TeamMember = {
    i18nKey:string
    ImageURL? : string
    sortOrderVal?: number
}

const teamMembers: TeamMember[] =
    [
        {
            i18nKey: "dmitry",
            ImageURL: DmitryPhotoUrl,
        },
        {
            i18nKey: "lucy",
            ImageURL: LucyPhotoUrl
        },
        {
            i18nKey: "nikolay",
            ImageURL: NikolayPhotoUrl,
        },
        {
            i18nKey: "zhirui"
        },
        {
            i18nKey: "tee",
            ImageURL: TeePhotoUrl
        },
        {
            i18nKey: "vyacheslav",
            ImageURL: VyachecslavPhotoUrl
        },
        {
            i18nKey: "maria"
        }
];

export function Team() {
    const {t} = useTranslation("translation", {keyPrefix:"about.team"});

    const shuffledTeamMembers = React.useMemo(() => {
        const arr = teamMembers.slice()
        for(var i=0;i<arr.length;i++)
            arr[i].sortOrderVal = Math.random()
        arr.sort((a,b) => a.sortOrderVal - b.sortOrderVal) // shuffling
        return arr
    },[teamMembers])
    
    const [collapsed,setCollapsed] = React.useState(true)

    var teamElem : JSX.Element
    if (collapsed) {

        const overflowButtonProps = {
            onClick: (ev: React.MouseEvent<HTMLButtonElement>) => setCollapsed(v => !v),
          };
        

        const personas: IFacepilePersona[] = shuffledTeamMembers.map(p => {
            return {
                personaName: t(`${p.i18nKey}.name`),
                imageUrl: p.ImageURL,
                onClick: (ev: React.MouseEvent<HTMLButtonElement>) => setCollapsed(v => !v),
            }
        });
        teamElem = (
            <Facepile
                personas={personas}
                overflowButtonType={OverflowButtonType.descriptive}
                overflowButtonProps={overflowButtonProps}
                personaSize={PersonaSize.size48}
            />
        )
    } else {
        const personas = shuffledTeamMembers.map(p => {
            const desc = t(`${p.i18nKey}.desc`)
            return (
                <Stack styles={{root: {margin: 12}}}>
                    <Persona
                        text={t(`${p.i18nKey}.name`)}
                        imageUrl={p.ImageURL}
                        secondaryText={t(`${p.i18nKey}.title`)}
                        title={desc}
                        key={p.i18nKey}
                        size={PersonaSize.size56}
                    />
                    <Text styles={{root:{maxWidth:400, paddingTop:"4px"}}}>{desc}</Text>
                </Stack>
            )
            }
        )

        teamElem = (
            <>
            <Stack tokens={{ childrenGap: 0, padding: 4}} horizontal wrap>
                    {personas}
            </Stack>
            <ActionButton iconProps={{iconName:"BackToWindow"}} text={t("collapseTeam")} onClick={ev => {setCollapsed(v => !v) }} />
            </>
        )
    }
    
    return teamElem
}