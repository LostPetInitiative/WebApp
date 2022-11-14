import * as React from "react";
import {useState} from "react";
import * as ICardStorage from "./apiClients/ICardStorage"
import * as DataModel from "./DataModel";
import * as Comp from "./computations"
import * as Utils from "./Utils"
import * as ISearch from "./apiClients/ISearch"
import "./CandidatesThumbnails.scss"
import * as im from "immutable"
import {_ImageEmbeddingToUse} from "./consts"

import {Stack, Toggle, Spinner, StackItem, Text, SpinnerSize} from '@fluentui/react'
import { useTranslation } from "react-i18next";
import { t } from "i18next";

/**
 * Renders the thumbnail for the card specified in card prop
 * @param props 
 * @returns 
 */
export function AnimalCardThumbnail(props: {
    card: DataModel.AnimalCard,
    isAccent: boolean,
    refCard: DataModel.AnimalCard | null
}) {
    const card = props.card;

    var similarity:undefined | number = undefined
    if(props.refCard != null) {
        similarity = -1.0;
        for(const refIm of props.refCard.photos) {
            if(!Object.keys(refIm.featureVectors).some(x => x === _ImageEmbeddingToUse)) {
                console.warn(`Reference image ${refIm.uuid} does not have needed feature vector ${_ImageEmbeddingToUse}`)
                continue;
            }
            for(const im of props.card.photos) {
                if(!Object.keys(im.featureVectors).some(x => x === _ImageEmbeddingToUse)) {
                    console.warn(`Reference image ${im.uuid} does not have needed feature vector ${_ImageEmbeddingToUse}`)
                    continue;
                }
                const refimFeatureVector = refIm.featureVectors[_ImageEmbeddingToUse]
                const imFeatureVector = im.featureVectors[_ImageEmbeddingToUse]
                if(refimFeatureVector.length != imFeatureVector.length) {
                    console.warn(`Feature vector ${_ImageEmbeddingToUse} has different length: ref image ${refimFeatureVector.length}; image ${imFeatureVector.length}`)
                    continue;
                }
                const curSim = Comp.cosSimilarity(
                    refimFeatureVector,
                    imFeatureVector)
                similarity = curSim > similarity ? curSim : similarity;
            }
        }
    }

    var geoString;
    if (props.refCard !== null) {
        const card1 = props.card.location
        const card2 = props.refCard.location
        const geoDist = Comp.geodistance(card1.lat, card1.lon, card2.lat, card2.lon)
        geoString = Utils.getGeoDiffString(geoDist)
    } else
        geoString = props.card.location.address

    var timeString
    if (props.refCard !== null) {
        const date1 = props.card.eventTime
        const date2 = props.refCard.eventTime
        timeString = Utils.getTimeDiffString(Math.abs(date1.getTime() - date2.getTime()))
    } else {
        const now = new Date()
        const diffMs = (now.getTime() - props.card.cardCreationTime.getTime())
        timeString = Utils.getTimeDiffString(diffMs)+" назад"
    }

    const thumbnailContainerClassName = "thumbnail-container" + (props.isAccent ? " accent" : "")

    const similarityText = similarity !== undefined ?
        (<p className="overlay-text">{(similarity*100.0).toFixed(2)}%</p>) : null

    const noPhotoLocStr = t("common.noPhoto")

    return (
        <div className={thumbnailContainerClassName}>
            <div className="overlay-info-anchor">
                <div className="overlay-info">
                    <p className="overlay-text">{timeString}</p>
                    <p className="overlay-text">{geoString}</p>
                    {similarityText}
                </div>
            </div>
            { card.photos.length > 0 &&
                <img src={card.photos[0].srcUrl} alt="Фото"/>
            }
            { card.photos.length === 0 &&
                <p>{noPhotoLocStr}</p>
            }
        </div>
    );
}


type AnimalCardThumbnailByIdProps = {
    cardStorage: ICardStorage.ICardStorage,
    refCard: DataModel.AnimalCard | null,
    isAccented: boolean,
    namespace: string,
    localID: string
}

type LoadedCardState = DataModel.AnimalCard | "Loading" | "Unexistent" | "NotSet"

/**
 * Loads the card identified by `namespace` and `localID` prop asynchronously. Then displays it with `AnimalCardThumbnail`
 */
export function AnimalCardThumbnailById(props: AnimalCardThumbnailByIdProps) {
    const {namespace, localID, cardStorage, refCard, isAccented} = props;
    const [loadedCard,setLoadedCard] = useState<LoadedCardState>("Loading")
    
    const {t} = useTranslation("translation")

    React.useEffect(() => {
        // resetting and initiating background load
        setLoadedCard("Loading")
        cardStorage.GetPetCard(namespace, localID).then(result => {
            if(ICardStorage.isUnexistentCardToken(result)) {
                setLoadedCard("Unexistent")
            } else {
                setLoadedCard(result)
            }
        });
    },[namespace,localID, cardStorage])

    const loadingLocStr = t("common.loading")
    const unexistentLocStr = t("common.cardNotFound")

    const thumbnailContainerClassName = "thumbnail-container" + (isAccented ? " accent" : "")
    
    switch(loadedCard) {
        case "Loading":
            return (
                <div className={thumbnailContainerClassName}>
                    <div style={{width:"100%",height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <Spinner label={loadingLocStr} size={SpinnerSize.large} />
                    </div>
                </div>)
        case "NotSet":
            return <p>Не задано.</p>
        case "Unexistent":
            return <p>{unexistentLocStr}</p>
        default:
            return <AnimalCardThumbnail card={loadedCard} refCard={refCard} isAccent={isAccented} />
    }

}

type CandidatesThumbnailsPropsType = {
    referenceCard: DataModel.AnimalCard | null
    selectedCardFullID: string,
    selectionChanged: (newSelectionFullID: string) => void,
    searcher: ISearch.ISearch,
    cardStorage: ICardStorage.ICardStorage
}

function capitalize(str: string): string {
    if (str.length === 0)
        return str
    else {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
}

function marshalAnimal(animal: DataModel.Animal): ISearch.Animal {
    return capitalize(animal as string) as ISearch.Animal;
}

function marshalEventType(t: DataModel.CardType): ISearch.EventType {
    return capitalize(t as string) as ISearch.EventType;
}

enum SimilarSearchModeEnum {Off, CardFeatures, ImageFeatures}
type SimilarSearchMode =
    { type: SimilarSearchModeEnum.Off} |
    { type: SimilarSearchModeEnum.CardFeatures, featuresIdent: string } |
    { type: SimilarSearchModeEnum.ImageFeatures, featuresIdent: string }

function determineSearchMode(card?: DataModel.AnimalCard) : SimilarSearchMode {
    if(card == null)       
        return { type: SimilarSearchModeEnum.Off };
    return { type: SimilarSearchModeEnum.ImageFeatures, featuresIdent: _ImageEmbeddingToUse };
    if(card.features != null && Object.keys(card.features).length>0) {        
        const featuresIdent = Object.keys(card.features)[0]
        return { type: SimilarSearchModeEnum.CardFeatures, featuresIdent: featuresIdent}
    }
    const imageFeaturesKeys = card.photos.map(p => Object.keys(p.featureVectors)).filter(keys => keys != null);
    if(imageFeaturesKeys.length>0)
        return { type: SimilarSearchModeEnum.ImageFeatures, featuresIdent: imageFeaturesKeys[0][0] }
    return { type: SimilarSearchModeEnum.Off };        
}

enum SearchStateEnum {None, SearchingViaCardFeatures, SearchingViaImageFeatures}
type SearchState =
    {type: SearchStateEnum.None} |
    {type: SearchStateEnum.SearchingViaCardFeatures, found: ISearch.SimilarCardSearchResult | "InProgress" } |
    {type: SearchStateEnum.SearchingViaImageFeatures, found: im.Map<number,ISearch.SimilarImageSearchResult>, imagesToSearchCount: number }

function extractRelevantCards(state: SearchState, referenceCard?: DataModel.AnimalCard): ISearch.FoundSimilarDoc[] {
    switch(state.type) {
        case SearchStateEnum.None:
            return [];
        case SearchStateEnum.SearchingViaCardFeatures:
            if(state.found === "InProgress")
                return [];
            if(!ISearch.IsSimilarCardResultSuccessful(state.found))
                return [];
            return state.found;
        case SearchStateEnum.SearchingViaImageFeatures:
            const referenceImageVectors:number[][] = 
                (!referenceCard) ? [] :
                referenceCard.photos
                    .map(x => (Object.keys(x.featureVectors).some(k => k === _ImageEmbeddingToUse)) ? x.featureVectors[_ImageEmbeddingToUse] : undefined)
                    .filter(x => x != undefined);

            const maxSimMap: Map<string,number> = new Map();
            for(const [num,images] of state.found) {
                // we need to build map: cardID -> similarity
                if(ISearch.IsSimilarImageResultSuccessful(images))
                    for(const im of images) {
                        const fullID = `${im.namespace}/${im.id}`
                        const prevSimForTheCard = maxSimMap.has(fullID) ? maxSimMap.get(fullID) : -1.0;
                        const newMaxSim = referenceImageVectors.reduce(
                            (acc, refVec) => {
                                const sim = Comp.cosSimilarity(im[_ImageEmbeddingToUse],refVec)
                                return acc > sim ? acc : sim;
                            }, prevSimForTheCard)
                            
                        maxSimMap.set(fullID, newMaxSim)
                    }                
            }

            const result: (ISearch.FoundSimilarDoc)[] = [];
            for(const [fullID, similarity] of maxSimMap.entries()) {
                const [namespace,id] = fullID.split('/')
                result.push({namespace,id,similarity})
            }
            
            result.sort((a,b) => b.similarity - a.similarity)
            
            return result;
        default:
            const n:never = state;
            throw "exhaustive checks failed"
    }
}

function extractErrorMessage(state:SearchState) : string|undefined {
    switch(state.type) {
        case SearchStateEnum.None:
            return undefined;
        case SearchStateEnum.SearchingViaCardFeatures:
            if(state.found === "InProgress")
                return undefined;
            else if (ISearch.IsSimilarCardResultSuccessful(state.found))
                return undefined;
            else
                return state.found.ErrorMessage;
        case SearchStateEnum.SearchingViaImageFeatures:
            const errMsgs:string[] = [];
            for(const v of state.found.values()) {
                if(ISearch.IsSimilarImageResultSuccessful(v))
                    continue;
                errMsgs.push(v.ErrorMessage);
            }
            if(errMsgs.length === 0)
                return undefined;
            else
                return errMsgs.join(", ");
        default:
            const v:never = state;
            throw "compile time exhaustive check";
    }
}

function getSearchCompletnessFraction(state:SearchState): number {
    switch(state.type) {
        case SearchStateEnum.None:
            return 1.0;
        case SearchStateEnum.SearchingViaCardFeatures:
            if(state.found === "InProgress")
                return 0.0;
            return 1.0;        
        case SearchStateEnum.SearchingViaImageFeatures:
           return state.found.count() / state.imagesToSearchCount;
        default:
            const n:never = state;
            throw "exhaustive checks failed"
    }
}

export function CandidatesThumbnails(props: CandidatesThumbnailsPropsType) {
    const [currentSelectionIdx, setCurrentSelectionIdx] = useState<number>(0);
    const [searchState, setSearchState] = useState<SearchState>({type: SearchStateEnum.None});

    const {t} = useTranslation()

    const isSearchInProgress = (searchState.type == SearchStateEnum.SearchingViaCardFeatures && searchState.found === "InProgress") ||
        (searchState.type == SearchStateEnum.SearchingViaImageFeatures && searchState.found.count() < searchState.imagesToSearchCount)
    const searchPercentage = getSearchCompletnessFraction(searchState) * 100.0;
        
    const requestedFullID = (props.referenceCard == null) ? "" : (props.referenceCard.namespace + "/" + props.referenceCard.id);

    const searchMode:SimilarSearchMode = determineSearchMode(props.referenceCard);

    const relevantCards = extractRelevantCards(searchState, props.referenceCard);
    const errorMessage:string = extractErrorMessage(searchState);

    const [farFilterEnabled, setFarFilterEnabled] = useState(true)
    const [longAgoFilterEnabled, setLongAgoFilterEnabled] = useState(true)

    React.useEffect(() => {
        // trying to set proper selected relevant card by looking for the desired card
        if (props.selectedCardFullID !== null) {
            const foundIdx = relevantCards.findIndex(v => v.namespace + "/" + v.id === props.selectedCardFullID)
            if (foundIdx !== -1) {
                //const doNotifyNewSelection = foundIdx !== this.state.currentSelectionIdx
                setCurrentSelectionIdx(foundIdx)
            } else {
                setCurrentSelectionIdx(NaN)
            }
        }
    },[props.selectedCardFullID, relevantCards]);

    const backgroundFetchId = React.useRef<number>(0)

    React.useEffect(() => {
        // background similar cards fetch
        backgroundFetchId.current += 1;

        const snapshotedBackgroundFetchId = backgroundFetchId.current; // to be checked in promise continutations

        setCurrentSelectionIdx(0);
        const card = props.referenceCard;

        switch(searchMode.type) {
            case SimilarSearchModeEnum.CardFeatures:
                throw "not implemented";               
                /*
                const featuresIdent = searchMode.featuresIdent;                 
                console.log(`initiating search of relevant cards by card features \"${searchMode.featuresIdent}\" for ${requestedFullID}`);
                setSearchState({
                    type: SearchStateEnum.SearchingViaCardFeatures,
                    found: "InProgress"
                });
                props.searcher.GetRelevantCardsByCardFeatures(card.location.lat, card.location.lon,
                marshalAnimal(card.animal),
                marshalEventType(card.cardType),
                card.eventTime,
                featuresIdent,
                card.features[featuresIdent]).then(relevantSearchRes => {
                    if(snapshotedBackgroundFetchId !== backgroundFetchId.current) {
                        console.warn(`Discarding stale search by card features num ${snapshotedBackgroundFetchId}`);
                        return;
                    }                    
                    setSearchState({
                        type: SearchStateEnum.SearchingViaCardFeatures,
                        found: relevantSearchRes
                    });
                }, error => console.error(`Search promise rejected: ${error}`));
                break;
                */
            case SimilarSearchModeEnum.ImageFeatures:
                // for each image issue a request                                
                setSearchState({
                    type: SearchStateEnum.SearchingViaImageFeatures,
                    imagesToSearchCount: props.referenceCard.photos.length,
                    found: im.Map<number,ISearch.FoundSimilarImage[]>()
                });

                props.referenceCard.photos.forEach((image,imNum) => {
                    console.log(`Searching image similarities \"${searchMode.featuresIdent}\" for ${card.namespace}/${card.id}/${imNum}`)
                    props.searcher.GetRelevantImagesByImageFeatures(card.location.lat, card.location.lon,
                        marshalAnimal(card.animal),
                        marshalEventType(card.cardType),
                        card.eventTime,
                        searchMode.featuresIdent,
                        image.featureVectors[searchMode.featuresIdent],
                        farFilterEnabled,
                        longAgoFilterEnabled
                        ).then(res => {
                            console.log("image search continuation",res)
                            if(snapshotedBackgroundFetchId !== backgroundFetchId.current) {
                                console.warn(`Discarding stale search by image features num ${snapshotedBackgroundFetchId}`);
                                return;
                            }
                            if(ISearch.IsSimilarImageResultSuccessful(res))
                                console.log(`Got ${res.length} similar images for ${card.namespace}/${card.id}/${imNum}`)
                            else
                                console.error(`Got failure for similar images for ${card.namespace}/${card.id}/${imNum}: ${res.ErrorMessage}`)
                            setSearchState(oldState => {
                                    if(oldState.type === SearchStateEnum.SearchingViaImageFeatures) {
                                        return {
                                            ...oldState,
                                            found: oldState.found.set(imNum,res)
                                        }
                                    } else
                                        return oldState
                                });
                            }
                        ,error => {
                            console.error(`Search promise rejected: ${error}`)
                        })
                });

                // upon competion form the relevane cards
                break;
            case SimilarSearchModeEnum.Off:
                break;
            default:
                const n:never = searchMode; // compile time exhaustive check
                throw "Unsupported similar card search type";
        }
    },[requestedFullID, searchMode.type, props.searcher, farFilterEnabled, longAgoFilterEnabled])

    const handleThumbnailSelection = React.useCallback((fullID: string, e: (React.MouseEvent | null)) => {
        if (props.selectionChanged !== null) {
            props.selectionChanged(fullID)
        }
        const foundIdx = relevantCards.findIndex(card => (card.namespace + "/" + card.id) === fullID)
        if (foundIdx !== -1) {
            setCurrentSelectionIdx(foundIdx);
        }        
    },[props.selectionChanged, relevantCards]);


    const wheel = (e:React.WheelEvent<HTMLDivElement>) => {
        const delta = Math.max(-1, Math.min(1, (e.deltaX || e.deltaY)))
        e.currentTarget.scrollLeft += (delta * 35)
        e.preventDefault()
    }   

    const errorLocStr = t("common.error")

    const errorMessageComp = errorMessage === undefined ? null : (<p>{errorLocStr}: {errorMessage}</p>)

    const lookingForMatchesLocStr = t("candidatesReview.lookingForMatches")

    const relevantCardElems = React.useMemo(() => {
        const genPreview = ([foundCard, isAccent]: [ISearch.FoundSimilarDoc, boolean]) => {
            const arrayKey = foundCard.namespace + "/" + foundCard.id
            return (
                <div onClick={(e) => handleThumbnailSelection(arrayKey, e)} key={arrayKey}>
                    <AnimalCardThumbnailById
                        key={arrayKey}
                        refCard={props.referenceCard}
                        isAccented={isAccent}
                        cardStorage={props.cardStorage}
                        namespace={foundCard.namespace}
                        localID={foundCard.id} />
                </div>)
        }

        const loadingIndication = isSearchInProgress ? <Spinner label={lookingForMatchesLocStr}></Spinner> : null;
        const effectiveSelectedIdx = relevantCards.length>0 ? (currentSelectionIdx % relevantCards.length) : 0;
        var previews = (relevantCards.length>0 || isSearchInProgress) ?
            relevantCards.map((card, idx) => [card, (idx === effectiveSelectedIdx)] as [ISearch.FoundSimilarDoc, boolean]).map(genPreview) :
            [<p>Нет совпадений =(</p>]
        
        return <>
            {loadingIndication}
            <div className="thumbnails-container">{previews}</div>
            </>        
    },[relevantCards, props.referenceCard, props.cardStorage, currentSelectionIdx, isSearchInProgress, searchPercentage, lookingForMatchesLocStr])    

    
    if (props.referenceCard !== null) {        
        const possibleMatchesLocStr = t("candidatesReview.possibleMatches")
        return (
            <div className="page" onWheel={wheel}>
                <div className="title-container">
                {/* <Stack>
                    <Toggle
                        label="Фильтр по расстоянию" onText="Далекие исключены" onChange={(_,checked) => setFarFilterEnabled(checked)}
                        defaultChecked={farFilterEnabled} ></Toggle>
                    <Toggle label="Фильтр по времени" onText="Давние исключены" onChange={(_,checked) => setLongAgoFilterEnabled(checked)}
                        defaultChecked={longAgoFilterEnabled}
                    ></Toggle>
                    <StackItem align="end">
                        
                    </StackItem>
                </Stack> */}
                <p>{possibleMatchesLocStr}</p>
                </div>
                {errorMessageComp}
                {relevantCardElems}
            </div>
        )
    } else {
        const loadingLocStr = t("common.loading")
        return <Spinner label={loadingLocStr}/>
    }
    
}
