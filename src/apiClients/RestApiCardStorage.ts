import * as DataModel from '../DataModel'
import * as ICardStorage from './ICardStorage'

// REST API specific data model follows

export enum CardType { Found = "found", Lost = "lost" }
export enum Animal { Cat = "cat", Dog = "dog" }
export enum Sex { Unknown = "unknown", Male = "male", Female = "female" }

export type AnimalPhoto = {
    imageNum: number;
    uuid: string;
    srcUrl: string;
    featureVectors: FeaturesDict;
}

type Location = {
    address: string;
    lat: number;
    lon: number;
}

interface FeaturesDict {
    [key: string]: number[]
}

export type AnimalCard = {
    cardType: CardType;
    contactInfo: {
        comment: string;
    }
    animal: Animal;
    eventTime: string; // iso string
    cardCreationTime: string; // iso string
    location: Location;
    animalSex: Sex;
    photos: AnimalPhoto[];
    provenanceURL: string;
    features: FeaturesDict;
}

export class CardStorage implements ICardStorage.ICardStorage {
    private serviceURL: string;

    constructor(serviceURL: string) {
        this.serviceURL = serviceURL;
    }
    GetPetCardByFullID(fullID: string): Promise<ICardStorage.GetPetCardReplyType> {
        const split = fullID.split('/')
        if (split.length !== 2)
            throw new Error("Can't find / in the full id " + fullID)
        return this.GetPetCard(split[0], split[1])
    }

    GetPetCard(namespace: string, localID: string): Promise<ICardStorage.GetPetCardReplyType> {
        const cardURL = this.serviceURL + "/PetCards/" + namespace + "/" + localID;
        const cardInfoPromise = fetch(cardURL).then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
            ));

        const photosURL = this.serviceURL + "/PetPhotos/" + namespace + "/" + localID +"?featuresToInclude=CalZhiruiHeadTwinTransformer";
        const cardPhotosPromise = fetch(photosURL).then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
            ));

        return Promise.all([cardInfoPromise, cardPhotosPromise]).then((values) => {
            if (values[0].status === 404) {
                return {
                    UnexistentCardNamespace: namespace,
                    UnexistentCardID: localID
                }
            } else {
                const photosArr: AnimalPhoto[] = values[1].data.map((i: Omit<AnimalPhoto,"srcUrl">) => {
                    return {
                        ...i,
                        srcUrl: this.serviceURL + "/PetPhotos/" + namespace + "/" + localID + "/" + i.imageNum + "?preferableProcessingsStr=CalZhiruiAnnotatedHead"                        
                    }
                });
                const downloadedCard: AnimalCard = values[0].data;
                const card: DataModel.AnimalCard = {
                    namespace: namespace,
                    id: localID,
                    animal: downloadedCard.animal,
                    animalSex: downloadedCard.animalSex,
                    cardCreationTime: new Date(downloadedCard.cardCreationTime),
                    cardType: downloadedCard.cardType,
                    contactInfo: downloadedCard.contactInfo,
                    eventTime: new Date(downloadedCard.eventTime),
                    features: downloadedCard.features,
                    location: downloadedCard.location,
                    photos: photosArr,
                    provenanceURL: downloadedCard.provenanceURL
                }
                return card;
            }
        });
    }
}