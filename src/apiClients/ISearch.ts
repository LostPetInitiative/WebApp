export type FoundCard = {
    namespace: string,
    id: string
}

export type FoundSimilarCard = {
    namespace: string,
    id: string,
    similarity: number
}

export type FoundSimilarImage = {
    namespace: string,
    id: string,
    imNum: number,
    similarity: number
}

export type SearchError = {
    ErrorMessage : string
}

export type SearchResult<SuccessfulResult> = SuccessfulResult | SearchError;

export type SimilarCardSearchResult =  SearchResult<FoundSimilarCard[]>;
export type SimilarImageSearchResult = SearchResult<FoundSimilarImage[]>;

export function IsSimilarCardResultSuccessful(searchResult: SimilarCardSearchResult): searchResult is FoundSimilarCard[] {
    return Array.isArray(searchResult)
}

export function IsSimilarImageResultSuccessful(searchResult: SimilarImageSearchResult): searchResult is FoundSimilarImage[] {
    return Array.isArray(searchResult)
}


export enum EventType { Found = "Found", Lost = "Lost" }
export enum Animal { Cat = "Cat", Dog = "Dog" }

export enum LatestCardSearchType { Lost, Found, Unspecified }

export interface ISearch {
    GetRelevantCardsByCardFeatures(lat:number, lon:number, animal: Animal, eventType:EventType,
        EventTime: Date, featuresIdent: string, features: number[] ) : Promise<SimilarCardSearchResult>;

    GetRelevantImagesByImageFeatures(lat:number, lon:number, animal: Animal, eventType:EventType,
        EventTime: Date, featuresIdent: string, features: number[] ) : Promise<SimilarImageSearchResult>;

    GetLatestCards(maxCardNumber: number, cardType: LatestCardSearchType): Promise<FoundCard[]>
}