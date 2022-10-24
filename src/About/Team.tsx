import * as React from "react";
import { IPersonaSharedProps, Persona, PersonaSize, Stack,
     Facepile, IFacepilePersona, OverflowButtonType, Text, ActionButton } from "@fluentui/react";

import DmitryPhotoUrl from './img/team/Dmitry.jpg'
import TeePhotoUrl from './img/team/Tee.jpg'
import LucyPhotoUrl from './img/team/Lucy.webp'
import NikolayPhotoUrl from './img/team/Nikolay.webp'
import VyachecslavPhotoUrl from './img/team/Vyacheslav.webp'

const teamData:IPersonaSharedProps[] = [
    {
        text: 'Дмитрий Гречка',
        imageUrl: DmitryPhotoUrl,
        secondaryText: 'Архитектор системы, Исследователь, Разработчик',
        title: "Дмитрий придумал идею системы, спроектировал и воплотил ее в жизнь. Также поддерживает работу системы."
    },
    {
        text: 'Люся Гречка',
        imageUrl: LucyPhotoUrl,
        secondaryText: 'Веб-разработчик',
        title: "Люся разработала значительную часть веб приложения Каштанки."
    },
    {
        text: 'Николай Арефьев',
        imageUrl: NikolayPhotoUrl,
        secondaryText: 'Научный руководитель, Исследователь',
        title: "Николай - научный руководитель студентов и аспирантов, занимающихся применением машинного обучения. Координатор научного взаимодействия в рамках проекта."
    },
    {
        text: 'Zhirui',
        secondaryText: 'Создатель ИИ модели, Исследователь',
        title: "В рамках работы над магистерской диссертацией Zhirui обучил нейронную сеть на базе Swin Transformer выделять из фотографии головы кошки или собаки вектор признаков, специфичных для каждой особи. Эта модель в данный момент используется в системе."
    },
    {
        text: 'Tee, Yu Shiang',
        imageUrl: TeePhotoUrl,
        secondaryText: 'Создатель ИИ модели, Исследователь',
        title: "В рамках работы над магистерской диссертацией Tee, Yu Shiang обучил модель YoloV5 выделять область головы собак и кошек на фото. Эта модель в данный момент используется в системе."
    },
    {
        text: 'Вячеслав Строев',
        imageUrl: VyachecslavPhotoUrl,
        secondaryText: 'Исследователь',
        title: "В рамках работы над кандидатской диссертацией Вячеслав работает над созданием метрик качества работы системы, а также курирует набор данных для научных исследований."
    },
    {
        text: 'Мария Елисеева',
        secondaryText: 'Исследователь',
        title: "В рамках работы над магистерской диссертацией Мария работала над средствами разметки данных, самой разметкой данных для машинного обучения, а также анализом распределения данных."
    }
]

export function Team() {
    const shuffledTeamData = React.useMemo(() => {
        const arr = teamData.slice()
        arr.sort(()=>Math.random()-0.5) // shuffling
        return arr
    },[])

    const [collapsed,setCollapsed] = React.useState(true)

    var teamElem : JSX.Element
    if (collapsed) {

        const overflowButtonProps = {
            ariaLabel: 'Еще',
            onClick: (ev: React.MouseEvent<HTMLButtonElement>) => setCollapsed(v => !v),
          };
        

        const personas: IFacepilePersona[] = shuffledTeamData.map(p => {
            return {
                personaName: p.text,
                imageUrl: p.imageUrl,
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
        const personas = shuffledTeamData.map(p => (
            <Stack styles={{root: {margin: 12}}}>
                <Persona
                    {...p}
                    key={p.text}
                    size={PersonaSize.size56}
                />
                <Text styles={{root:{maxWidth:400, paddingTop:"4px"}}}>{p.title}</Text>
            </Stack>
        ))

        teamElem = (
            <>
            <Stack tokens={{ childrenGap: 0, padding: 4}} horizontal wrap>
                    {personas}
            </Stack>
            <ActionButton iconProps={{iconName:"BackToWindow"}} text="Свернуть команду" onClick={ev => {setCollapsed(v => !v) }} />
            </>
        )
    }
    
    return teamElem
}