import * as React from "react"
import * as ISearch from "./apiClients/ISearch"
import { AnimalCardThumbnailById } from "./CandidatesThumbnails"
import * as ICardsStorage from "./apiClients/ICardStorage"
import "./LatestCardsPreview.scss"
import { useTranslation } from "react-i18next"

type PropsType = {
    cardsToShow: number,
    cardsTypeToShow: ISearch.LatestCardSearchType,
    searcher: ISearch.ISearch,
    cardStorage: ICardsStorage.ICardStorage,
    previewClicked: (clickedFullID: string) => void,
}


function LatestCardsPreview(props: PropsType)  {
    const {cardsToShow, cardsTypeToShow, searcher} = props
    const [foundCards, setFoundCards] = React.useState<ISearch.FoundDoc[] | null>(null)

    const {t} = useTranslation("translation",{ keyPrefix:"cards.latestCardsPreview"})
    
    React.useEffect(() => {
        console.log("Loading " + cardsTypeToShow + " (" + cardsToShow + " max count) latest cards")
        setFoundCards(null)
        searcher.GetLatestCards(cardsToShow,cardsTypeToShow).then(cards => {
            console.log("Loaded " + cards.length + " of " + cardsTypeToShow + " (" + cardsToShow + " max count) latest cards")
            setFoundCards(cards)
        }, err => {
            console.error(`Failed to load cards: ${err}`)
            setFoundCards([])
        });
    },[cardsToShow, cardsTypeToShow, searcher])

    
    const handleThumbnailClick = (fullID: string) => {
        props.previewClicked?.(fullID)
    }

    const renderContent = () => {
        if (foundCards === null) {
            const downloadingLatestCardsLocalizedStr = t("downloadingLatestCards")
            return <p>{downloadingLatestCardsLocalizedStr}</p>
        } else {
            if (foundCards.length === 0) {
                const downloadFailedLocalizedStr = t("downloadFailed")
                return <p>{downloadFailedLocalizedStr}</p>
            } else {
                const cardToViewer = (card: ISearch.FoundDoc) => {
                    const fullID = card.namespace + "/" + card.id
                    return (
                        <div onClick={() => handleThumbnailClick(fullID)} key={fullID}>
                            <AnimalCardThumbnailById
                                cardStorage={props.cardStorage}
                                refCard={null}
                                isAccented={false}
                                namespace={card.namespace}
                                localID={card.id}
                            />
                        </div>
                    )
                }

                const cards = foundCards.map(cardToViewer)
                const downloadedLatestCardsLocalizedStr = t("downloadedLatestCards")
                return (
                        <div>
                            <p>{downloadedLatestCardsLocalizedStr}</p>
                            <div className="thumbnails-container">
                                {cards}
                            </div>
                        </div>
                )
            }
        }
    }


    const content = renderContent()
    return (
        <div className="latest-cards-previews-container">
        {content}
        </div>
    )

}

export default LatestCardsPreview;