import * as ISearch from "./ISearch";

type FoundCard = {
    id: string,
    similarity: number
}

type EndOfStreamMarker = {
    EOF: boolean,
    RESPONSE_TIME: number,
    EXCEPTION?: string
}

type SolrSuccessfulStream = {
    "result-set": {
        "docs": (FoundCard | EndOfStreamMarker)[]
    }
}

function isEndOfTheStream(elem: FoundCard | EndOfStreamMarker): elem is EndOfStreamMarker {
    return (elem as EndOfStreamMarker).EOF !== undefined;
}

type GatewayRequest = {
    Lat: number,
    Lon: number,
    Animal: ISearch.Animal,
    EventType: ISearch.EventType,
    EventTime: string,
    FeaturesIdent: string,
    Features: number[]
}

class SolrGatewaySearch implements ISearch.ISearch {
    private readonly gatewayAddr: string;
    private readonly matchedCardsSearchURL: string;
    private readonly matchedImagesSearchURL: string;
    private readonly latestCardsSearchURL: string;

    constructor(gatewayAddr: string) {
        this.gatewayAddr = gatewayAddr;
        this.matchedCardsSearchURL = gatewayAddr + "/MatchedCardsSearch";
        this.matchedImagesSearchURL = gatewayAddr + "/MatchedImagesSearch";
        this.latestCardsSearchURL = gatewayAddr + "/latestCards"
    }
    

    async GetLatestCards(maxCardNumber: number, cardType: ISearch.LatestCardSearchType): Promise<ISearch.FoundCard[]> {
        const requestParams: {
            [key: string]: string;
        } = {}

        switch (cardType) {
            case ISearch.LatestCardSearchType.Found: requestParams["cardType"] = "Found"; break;
            case ISearch.LatestCardSearchType.Lost: requestParams["cardType"] = "Lost"; break;
            default: break;
        }
        if (maxCardNumber) {
            requestParams["maxCardsCount"] = maxCardNumber.toFixed(0);
        }

        const queryParamsArray: string[] = []

        for (let key in requestParams) {
            let value = requestParams[key];
            queryParamsArray.push(key + "=" + value)
        }
        const query = queryParamsArray.join("&")

        var queryStr: string = (query.length > 0) ? ("?" + query) : ""

        const requstURL = this.latestCardsSearchURL + queryStr;

        var fetchRes = await fetch(requstURL, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (fetchRes.ok) {
            const fetchedObj = await fetchRes.json();
            const docs: {'id':string}[] = fetchedObj['response']['docs']

            const parseId = (arg: {'id' : string}) => {
                const split=arg.id.split('/')
                const res: ISearch.FoundCard = {
                    namespace: split[0],
                    id: split[1]
                }
                return res;
            }

            return docs.map(parseId);
        } else {
            var errorMess = "Non successful error code " + fetchRes.status + " for fetching latest cards: " + fetchRes.statusText;
            console.error(errorMess)
            return [];
        }

    }

    async GetRelevantImagesByImageFeatures(lat: number, lon: number, animal: ISearch.Animal, eventType: ISearch.EventType, EventTime: Date, featuresIdent: string, features: number[]): Promise<ISearch.SimilarImageSearchResult> {
        var gatewayRequest: GatewayRequest = {
            Lat: lat,
            Lon: lon,
            Animal: animal,
            EventType: eventType,
            EventTime: EventTime.toISOString(),
            FeaturesIdent: featuresIdent === "CalZhiruiHeadTwinTransformer" ? "cze" : featuresIdent, // TODO: remove this dirty mapping hack
            Features: features
        }
        const jsonGatewayRequest:string = JSON.stringify(gatewayRequest)
        // console.log(`Issueing request`)
        // console.log(gatewayRequest)
        // console.log(jsonGatewayRequest)
        var fetchRes = await fetch(this.matchedImagesSearchURL, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: jsonGatewayRequest
        })
        if (fetchRes.ok) {
            const parsed: SolrSuccessfulStream = await fetchRes.json()
            const result: ISearch.FoundSimilarImage[] = []
            var i = 0;
            const docs = parsed["result-set"].docs;
            while ((i < docs.length)) {
                var current = docs[i]                
                if (isEndOfTheStream(current)) {
                    if(Object.keys(current).some(k => k === "EXCEPTION")){
                        return {ErrorMessage: current.EXCEPTION }
                    }
                    break;
                } else {
                    const parts = current.id.split('/')
                    result.push({
                        namespace: parts[0],
                        id: parts[1],
                        imNum: Number.parseInt(parts[2]),
                        similarity: current.similarity
                    });
                }
                i++;
            }
            return result;
        } else {
            var errorMess = "Non successful error code " + fetchRes.status + " for fetching relevant cards: " + fetchRes.statusText;
            console.error(errorMess)
            return { ErrorMessage: errorMess }
        }
    }

    async GetRelevantCardsByCardFeatures(lat: number, lon: number, animal: ISearch.Animal, eventType: ISearch.EventType, EventTime: Date, featuresIdent: string, features: number[]): Promise<ISearch.SimilarCardSearchResult> {
        var gatewayRequest: GatewayRequest = {
            Lat: lat,
            Lon: lon,
            Animal: animal,
            EventType: eventType,
            EventTime: EventTime.toISOString(),
            FeaturesIdent: featuresIdent,
            Features: features
        }
        var fetchRes = await fetch(this.matchedCardsSearchURL, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gatewayRequest)
        })
        if (fetchRes.ok) {
            const parsed: SolrSuccessfulStream = await fetchRes.json()
            const result: ISearch.FoundSimilarCard[] = []
            var i = 0;
            const docs = parsed["result-set"].docs;
            while ((i < docs.length)) {
                var current = docs[i]
                if (isEndOfTheStream(current)) {
                    break;
                } else {
                    const parts = current.id.split('/')
                    result.push({
                        namespace: parts[0],
                        id: parts[1],
                        similarity: current.similarity
                    });
                }
                i++;
            }
            return result;
        } else {
            var errorMess = "Non successful error code " + fetchRes.status + " for fetching relevant cards: " + fetchRes.statusText;
            console.error(errorMess)
            return { ErrorMessage: errorMess }
        }
    }
}

export default SolrGatewaySearch;