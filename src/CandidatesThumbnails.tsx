import * as React from "react";
import {useState} from "react";
import "./AnimalCard.scss"
import * as ICardStorage from "./apiClients/ICardStorage"
import * as DataModel from "./DataModel";
import * as Comp from "./computations"
import * as Utils from "./Utils"
import * as ISearch from "./apiClients/ISearch"
import "./CandidatesThumbnails.scss"
import * as im from "immutable"

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
    return (
        <div className={thumbnailContainerClassName}>
            <div className="overlay-info-anchor">
                <div className="overlay-info">
                    <p className="overlay-text">{timeString}</p>
                    <p className="overlay-text">{geoString}</p>
                </div>
            </div>
            { card.photos.length > 0 &&
                <img src={card.photos[0].srcUrl} alt="Фото"/>
            }
            { card.photos.length === 0 &&
                <p>Нет фото</p>
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

type AnimalCardThumbnailByIdState = {
    loadedFullID: string,
    loadedCard: DataModel.AnimalCard | "Loading" | "Unexistent" | "NotSet"
}

/**
 * Loads the card identified by `namespace` and `localID` prop asynchronously. Then displays it with `AnimalCardThumbnail`
 */
export class AnimalCardThumbnailById
    extends React.Component<AnimalCardThumbnailByIdProps, AnimalCardThumbnailByIdState> {
    constructor(props: AnimalCardThumbnailByIdProps) {
        super(props)
        this.state = {
            loadedFullID: "",
            loadedCard: "Loading"
        }
    }

    checkLoadedCard() {
        const neededFullID = this.props.namespace + "/" + this.props.localID;
        if (this.state.loadedFullID !== neededFullID) {
            // resetting and initiating background load
            this.setState({
                loadedFullID: neededFullID,
                loadedCard: (neededFullID==="")?"NotSet":"Loading" })
            this.props.cardStorage.GetPetCard(this.props.namespace, this.props.localID).then(result => {
                if(ICardStorage.isUnexistentCardToken(result)) {
                    this.setState({ loadedCard: "Unexistent" })
                } else {
                    const card = result
                    this.setState({ loadedCard: card })
                }
            });
        }
    }

    componentDidMount() { this.checkLoadedCard() }
    componentDidUpdate() { this.checkLoadedCard() }

    render() {
        switch(this.state.loadedCard) {
            case "Loading":
                return <p>Загрузка...</p>
            case "NotSet":
                return <p>Не задано.</p>
            case "Unexistent":
                return <p>Карточка не найдена.</p>
            default:
                return <AnimalCardThumbnail card={this.state.loadedCard} refCard={this.props.refCard} isAccent={this.props.isAccented} />
        }
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
    return { type: SimilarSearchModeEnum.ImageFeatures, featuresIdent: "CalZhiruiHeadTwinTransformer" };
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
    {type: SearchStateEnum.SearchingViaImageFeatures, found: im.Map<number,ISearch.FoundSimilarImage[]>, imagesToSearchCount: number }

function extractRelevantCards(state: SearchState): ISearch.FoundCard[] {
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
            const result: ISearch.FoundCard[] = [];
            const fullIds = new Set<string>();
            for(const [num,images] of state.found) {
                for(const im of images) {
                    const fullID = `${im.namespace}/${im.id}`
                    if(!fullIds.has(fullID)) { // we are collecting only distinct cards (in case there are several images in the same card)
                        fullIds.add(fullID);
                        result.push(im);
                    }
                }                
            }
            return result;
        default:
            const n:never = state;
            throw "exhaustive checks failed"
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

    const isSearchInProgress = (searchState.type == SearchStateEnum.SearchingViaCardFeatures && searchState.found === "InProgress") ||
        (searchState.type == SearchStateEnum.SearchingViaImageFeatures && searchState.found.count() < searchState.imagesToSearchCount)
    const searchPercentage = getSearchCompletnessFraction(searchState) * 100.0;
        
    const requestedFullID = (props.referenceCard == null) ? "" : (props.referenceCard.namespace + "/" + props.referenceCard.id);

    const searchMode:SimilarSearchMode = determineSearchMode(props.referenceCard);

    const relevantCards = extractRelevantCards(searchState);

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
                        image.featureVectors[searchMode.featuresIdent]).then(res => {
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
                                    if(oldState.type === SearchStateEnum.SearchingViaImageFeatures && ISearch.IsSimilarImageResultSuccessful(res)) {
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
    },[requestedFullID, searchMode.type, props.searcher])

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

    const relevantCardElems = React.useMemo(() => {
        const genPreview = ([foundCard, isAccent]: [ISearch.FoundSimilarCard, boolean]) => {
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

        const loadingIndication = isSearchInProgress ? <><p>Поиск совпадений: {searchPercentage.toFixed(0)}%</p><hr/></> : null;
        const effectiveSelectedIdx = relevantCards.length>0 ? (currentSelectionIdx % relevantCards.length) : 0;
        var previews = relevantCards.length>0 ?
            relevantCards.map((card, idx) => [card, (idx === effectiveSelectedIdx)] as [ISearch.FoundSimilarCard, boolean]).map(genPreview) :
            [<p>Нет совпадений =(</p>]
        
        return <>
            {loadingIndication}
            <div className="thumbnails-container">{previews}</div>
            </>        
    },[relevantCards, props.referenceCard, props.cardStorage, currentSelectionIdx, isSearchInProgress, searchPercentage])    

    
    if (props.referenceCard !== null) {        
        return (
            <div className="page" onWheel={e => this.wheel(e)}>
                <div className="title-container">
                    <p>Возможные совпадения:</p>
                </div>
                {relevantCardElems}
            </div>
        )
    } else {
        return <p>Загрузка...</p>
    }
    
}
