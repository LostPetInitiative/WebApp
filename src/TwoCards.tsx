import * as React from "react";
import "./apiClients/ICardStorage"
import "./TwoCards.css"
import CardDiffViewer from "./CardDiffViewer"
import * as DataModel from "./DataModel"
import AnimalCard from "./AnimalCard";
import { useTranslation } from "react-i18next";
import { Spinner, SpinnerSize } from "@fluentui/react";

export type CardAssignment = DataModel.AnimalCard | "unassigned" | "loading" | "unexistent"

type PropsType = {
    leftCard: CardAssignment,
    rightCard: CardAssignment,
}

export function TwoCardsViewer(props: PropsType) {
    const [leftImg,setLeftImg] = React.useState(0);
    const [rightImg, setRightImg] = React.useState(0);

    const {t} = useTranslation()

    const loadingLocStr = t("common.loading")
    const cardNotSelectedLocStr = t("candidatesReview.cardNotSelectedSelectBelow")
    const cardNotFoundLocStr = t("common.cardNotFound")

    function getCardViewer(card: CardAssignment, onImgChanged?:(num:number) => void) {
        switch(card) {
            case "loading": return <Spinner label={loadingLocStr} size={SpinnerSize.large} />;
            case "unassigned": return <p>{cardNotSelectedLocStr}</p>;
            case "unexistent": return <p>{cardNotFoundLocStr}</p>
            default: return <AnimalCard card={card} imageIdxChanged={onImgChanged} />
        }
    }

    
    function getMiddleViewer(leftCard: CardAssignment, rightCard:CardAssignment) {
        function isAssignedCard(card: CardAssignment): card is DataModel.AnimalCard {
            return !(typeof card === 'string' || card instanceof String)
        }
    
        if (isAssignedCard(leftCard) && isAssignedCard(rightCard)) {
            return <CardDiffViewer
                        card1={leftCard}
                        card2={rightCard}
                        card1ImgNum={leftImg}
                        card2ImgNum={rightImg} />
        } else return <div></div>;
    }

    const leftViewer = getCardViewer(props.leftCard, setLeftImg);
    const rightViewer = getCardViewer(props.rightCard, setRightImg)
    const middleViewer = getMiddleViewer(props.leftCard, props.rightCard);
    return (
        <div className="gridContainer">
            {leftViewer}
            {middleViewer}
            {rightViewer}
        </div>
    )

}