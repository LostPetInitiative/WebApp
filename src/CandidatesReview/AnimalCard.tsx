import * as React from "react";
import "./AnimalCard.scss"
import * as DataModel from "../DataModel";
import * as urls from "../urls"
import {CarouselImgViewer} from "./CarouselImgViewer";
import { useTranslation } from "react-i18next";

function AnimalCard(props: { card: DataModel.AnimalCard, imageIdxChanged?: (num:number) => void; }) {
    const card = props.card;

    const {t} = useTranslation()

    function animalType(animalType: DataModel.Animal, animalGender: DataModel.Sex) {
        if (animalType === DataModel.Animal.Dog) {
            if (animalGender === DataModel.Sex.Female)
                return <div className="iconAnimal iconDogF" />;
            else if (animalGender === DataModel.Sex.Male)
                return <div className="iconAnimal iconDogM" />;
            return <div className="iconAnimal iconDog" />;
        }
        else if (animalType === DataModel.Animal.Cat) {
            if (animalGender === DataModel.Sex.Female)
                return <div className="iconAnimal iconCatF" />;
            else if (animalGender === DataModel.Sex.Male)
                return <div className="iconAnimal iconCatM" />;
            return <div className="iconAnimal iconCat" />;
        }
        else return t("common.animal");
    }

    function animalGenderString(animalGender: DataModel.Sex) {
        if (animalGender === DataModel.Sex.Female)
            return t("common.female");
        else if (animalGender === DataModel.Sex.Male)
            return t("common.male");
        else return "";
    }

    function cardTypeString(cardType: DataModel.CardType) {
        if (cardType === DataModel.CardType.Found)
            return t("common.found");
        else if (cardType === DataModel.CardType.Lost)
            return t("common.lost");
        else return "";
    }

    function cardTypeClass(cardType: DataModel.CardType) {
        if (cardType === DataModel.CardType.Found)
            return "leftOriented";
        else if (cardType === DataModel.CardType.Lost)
            return "rightOriented";
        else return "";
    }

    function cardSource(cardSource: string) {
        const intro: string = `| ${t("cardViewer.goToOrig")}`;
        var url: string = "./img/logo.png";
        var title: string = "";

        if(cardSource.startsWith("vk-")) {
            url=urls.VkNSKIconURL
            title="vk group"
        }
        switch (cardSource) {
            case "pet911ru":
                url = urls.Pet911IconURL;
                title = "pet911.ru";
                break;
            case "poiskzooru":
                url = urls.PoiskzooIconURL;
                title = "poiskzoo.ru";
                break;
            case "vk-poterjashkansk":
                url = urls.VkNSKIconURL;
                break;
        }
        
        return (
            <div className="linkToSourceInternalDiv">
                <img className="cardSourceImg" width={"25px"} src={url} title={title} alt={title}/>
                {intro}
            </div>);
    }

    const failedToLoadCardLocStr = t("cardViewer.failedToDownloadCard")
    const commentLocStr = t("common.comment")
    const whenLocStr = t("common.when")
    const whereLocStr = t("common.where")

    if (card.cardType) {
        return (
            <div className="animalCard">
                <div className="headerLine">
                    <div className={"cardHeader " + cardTypeClass(card.cardType)}> {cardTypeString(card.cardType)} </div>
                    <div className={"cardInfo " + cardTypeClass(card.cardType)} title={animalGenderString(card.animalSex)}>
                        <div className="cardDate" title={whenLocStr}> {card.eventTime.toLocaleDateString()} </div>
                        <div className="cardCoordsNumbers" title={whereLocStr}> {card.location.address} </div>
                    </div>
                    <div className={"animalType " + cardTypeClass(card.cardType)}> {animalType(card.animal, card.animalSex)} </div>
                </div>
                <div className={"animalCardMain " + cardTypeClass(card.cardType)}>
                    <div className={"cardImgViewer " + cardTypeClass(card.cardType)}>
                        <CarouselImgViewer imgSrcArray={card.photos} onImgIdxChange={props.imageIdxChanged} />
                    </div>
                    <div className={"cardComment " + cardTypeClass(card.cardType)}>
                        <div className={"linkToSource " + cardTypeClass(card.cardType)}>
                            <div className="linkToSourceContainer">
                                <a href={card.provenanceURL} target="_BLANK" rel="external noopener">
                                    {cardSource(card.namespace)}
                                    <span className="linkToSourceSpan"></span></a>                         
                            </div>
                        </div>
                        <div className="cardItemHeader"> {commentLocStr} </div>
                        <div className="cardCommentText">
                            <div>{card.contactInfo.comment}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        // cadd does not exist
        return (
            <p>{failedToLoadCardLocStr}</p>
        )
    }
}

export default AnimalCard;