import * as React from "react";
import "./AnimalCard.scss"
import * as DataModel from "./DataModel";
import {CarouselImgViewer} from "./CarouselImgViewer";

function AnimalCard(props: { card: DataModel.AnimalCard, imageIdxChanged?: (num:number) => void; }) {
    const card = props.card;

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
        else return "Животное";
    }

    function animalGenderString(animalGender: DataModel.Sex) {
        if (animalGender === DataModel.Sex.Female)
            return "Девочка";
        else if (animalGender === DataModel.Sex.Male)
            return "Мальчик";
        else return "";
    }

    function cardTypeString(cardType: DataModel.CardType) {
        if (cardType === DataModel.CardType.Found)
            return "Нашёлся";
        else if (cardType === DataModel.CardType.Lost)
            return "Потерялся";
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
        const intro: string = "Перейти к объявлению | ";
        var url: string = "./img/logo.png";
        var title: string = "";

        switch (cardSource) {
            case "pet911ru":
                url = "https://pet911.ru/favicon.ico";
                title = "pet911.ru";
        }
        
        return <div className="linkToSourceInternalDiv">{intro + "  "}<img className="cardSourceImg" src={url} title={title} alt={title}/>{" " + title}</div>;
    }

    if (card.cardType) {
        return (
            <div className="animalCard">
                <div className="headerLine">
                    <div className={"cardHeader " + cardTypeClass(card.cardType)}> {cardTypeString(card.cardType)} </div>
                    <div className={"cardInfo " + cardTypeClass(card.cardType)} title={animalGenderString(card.animalSex)}>
                        <div className="cardDate" title="Когда?"> {card.eventTime.toLocaleDateString()} </div>
                        <div className="cardCoordsNumbers" title="Где?"> {card.location.address} </div>
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
                                <a href={card.provenanceURL} target="_BLANK" rel="external">
                                    {cardSource(card.namespace)}
                                    <span className="linkToSourceSpan"></span></a>                         
                            </div>
                        </div>
                        <div className="cardItemHeader"> Комментарий </div>
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
            <p>Не удалось загрузить карточку.</p>
        )
    }
}

export default AnimalCard;