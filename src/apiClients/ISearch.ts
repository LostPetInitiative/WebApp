export type FoundDoc = {
    namespace: string,
    id: string,
}

export type FoundDocWithFeatures =
    FoundDoc & {[key:string]: unknown}

export type FoundImageWithFeatures = 
    FoundDocWithFeatures & {imNum: number}

export type FoundSimilarDoc = {
    similarity: number
} & FoundDoc

export type FoundSimilarImage = {
    imNum: number,
} & FoundSimilarDoc;

export type SearchError = {
    ErrorMessage : string
}

export type SearchResult<SuccessfulResult> = SuccessfulResult | SearchError;

export type SimilarCardSearchResult =  SearchResult<FoundSimilarDoc[]>;
export type SimilarImageSearchResult = SearchResult<FoundImageWithFeatures[]>;

export function IsSimilarCardResultSuccessful(searchResult: SimilarCardSearchResult): searchResult is FoundSimilarDoc[] {
    return Array.isArray(searchResult)
}

export function IsSimilarImageResultSuccessful(searchResult: SimilarImageSearchResult): searchResult is FoundImageWithFeatures[] {
    return Array.isArray(searchResult)
}


export enum EventType { Found = "Found", Lost = "Lost" }
export enum Animal { Cat = "Cat", Dog = "Dog" }

export enum LatestCardSearchType { Lost, Found, Unspecified }

export interface ISearch {
    /*
    GetRelevantCardsByCardFeatures(lat:number, lon:number, animal: Animal, eventType:EventType,
        EventTime: Date, featuresIdent: string, features: number[] ) : Promise<SimilarCardSearchResult>;
    */

    GetRelevantImagesByImageFeatures(lat:number, lon:number, animal: Animal, eventType:EventType,
        EventTime: Date, featuresIdent: string, features: number[], filterFar?: boolean, filterLongAgo?: boolean) : Promise<SimilarImageSearchResult>;

    GetLatestCards(maxCardNumber: number, cardType: LatestCardSearchType): Promise<FoundDoc[]>
}