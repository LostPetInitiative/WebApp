import * as React from "react";
import * as Comp from "./computations"
import * as Utils from "./Utils"
import * as DataModel from "./DataModel"
import "./CardDiffViewer.scss"

function WarningMessage(props: { message: string }) {
    return <p className="attentionInfo">{props.message}</p>
}

import DistanceSpaceSVG from './img/distanceS.svg'
import DistanceTimeSVG from './img/distanceT.svg'
import SexMismatchWarningSVG from './img/genderDiffers.svg'
import { _ImageEmbeddingToUse } from "./consts";

/// Presents the difference between two cards
export function CardDiffViewer(props: { card1: DataModel.AnimalCard, card2: DataModel.AnimalCard, card1ImgNum?: number, card2ImgNum?: number }) {
    const {card1, card2, card1ImgNum, card2ImgNum} = props;
    const geoDistKM = Comp.geodistance(
        card1.location.lat,
        card1.location.lon,
        card2.location.lat,
        card2.location.lon);
    const geoDistStr = Utils.getGeoDiffString(geoDistKM)

    const timeDiffMs = Math.abs(new Date(card1.eventTime).getTime() - new Date(card2.eventTime).getTime());
    const timeDiffStr = Utils.getTimeDiffString(timeDiffMs)
    
    function getFeaturesDiff() {
        //console.log(`images ${card1ImgNum} ${card2ImgNum}`)
        if(card1ImgNum==undefined || card2ImgNum == undefined)
            return null;
        if(card1.photos.length <= card1ImgNum)
            return null;
        const firstCardPhoto = card1.photos[card1ImgNum];
        if(card2.photos.length <= card2ImgNum)
            return null;
        const sndCardPhoto = card2.photos[card2ImgNum];
        const featuresIdent = _ImageEmbeddingToUse
        const firstCardFeatures = firstCardPhoto.featureVectors[featuresIdent];
        const secondCardFeatures = sndCardPhoto.featureVectors[featuresIdent];
        if(!firstCardFeatures || !secondCardFeatures)
            return null;

        const cosSim = Comp.cosSimilarity(firstCardFeatures, secondCardFeatures);
        
        return (cosSim).toFixed(3);
    }

    function getSexWarning() {
        if
            ((card1.animalSex !== card2.animalSex) &&
            (card1.animalSex !== DataModel.Sex.Unknown) &&
            (card2.animalSex !== DataModel.Sex.Unknown))
            return <img src={SexMismatchWarningSVG} alt="Животные, предположительно, разного пола!" title="Животные, предположительно, разного пола!" className="cardDiffGenderIcon"/>
        else return false;
    }

    function getDifferentAnimalsWarning() {
        if (card1.animal !== card2.animal)
            return <WarningMessage message="Животные разного вида!" />
    }

    function getLostAfterFoundWarning() {
        if (card1.cardType !== card2.cardType) {
            const lostCard = card1.cardType === DataModel.CardType.Lost ? card1 : card2;
            const foundCard = card1.cardType === DataModel.CardType.Lost ? card2 : card1;
            if (lostCard.eventTime > foundCard.eventTime) {
                return <WarningMessage message="Время находки предшествует времени потери!" />
            }
        }
        return false;
    }

    return (
        <div className="cardDiffViewer">
            <div className="cardDiffItems">
                <img className="cardDiffIcons" src={DistanceSpaceSVG} alt="Расстояние" title="Расстояние"/>{geoDistStr}
            </div>
            <div className="cardDiffItems">
                <img className="cardDiffIcons" src={DistanceTimeSVG} alt="Между событиями прошло" title="Между событиями прошло"/>{timeDiffStr}
            </div>
            <div className="cardDiffItems">
                <img className="cardDiffIcons" src="https://img.icons8.com/color/48/000000/look-alike.png"
                    alt="Схожесть (чем ближе к 1.0, тем более похоже)"
                    title="Схожесть (чем ближе к 1.0, тем более похоже)"/>
                {getFeaturesDiff()}
            </div>
            {/* {getFeaturesDifferences()} */}
            <div className="cardDiffWarnings">
                <div className="cardDiffItems">{getSexWarning()}</div>
                <div className="cardDiffItems">{getDifferentAnimalsWarning()}</div>
                <div className="cardDiffItems">{getLostAfterFoundWarning()}</div>
            </div>
        </div>
    )
}

export default CardDiffViewer;