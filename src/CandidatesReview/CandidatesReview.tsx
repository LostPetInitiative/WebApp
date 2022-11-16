import * as React from "react";
import * as DataModel from "../DataModel"
import * as ICardStorage from "../apiClients/ICardStorage"
import * as ISearch from "../apiClients/ISearch"
import * as Thumbnails from "../CandidatesThumbnails"
import * as TwoCards from "./TwoCards"
import "./CandidatesReview.scss"
import { useTranslation } from "react-i18next";

type PropsType = {
    cardStorage: ICardStorage.ICardStorage,
    searcher: ISearch.ISearch,
    mainCardFullID: string,
    candCardFullID: string,
    candCardFullIDChanged: (newCandCardFullID: string) => void
}

function cardStateToCardAssignement(cardState:DataModel.AnimalCard | "Loading" | "DoesNotExist" | "NotSet"):TwoCards.CardAssignment {
    if (cardState === "DoesNotExist") {
        return "unexistent"
    } else if (cardState === "NotSet") {
        return "unassigned"
    } else if (cardState === "Loading") {
        return  "loading"
    } else {
        return cardState
    }
}


export function CandidatesReview(props: PropsType) {
    const {mainCardFullID, candCardFullID, cardStorage, searcher, candCardFullIDChanged} = props;
    const [shownMainCard,setShownMainCard] = React.useState<DataModel.AnimalCard | "Loading" | "DoesNotExist" | "NotSet">("NotSet")
    const [shownCandCard,setShownCandCard] = React.useState<DataModel.AnimalCard | "Loading" | "DoesNotExist" | "NotSet">("NotSet")
    
    const {t} = useTranslation()

    React.useEffect(() => {
        if (mainCardFullID !== "") {
            setShownMainCard("Loading")            
            console.log("Fetching main card " + mainCardFullID)
            cardStorage.GetPetCardByFullID(mainCardFullID).then(result => {
                if (ICardStorage.isUnexistentCardToken(result)) {
                    const checkedCardId = result.UnexistentCardNamespace + "/" + result.UnexistentCardID
                    if (mainCardFullID === checkedCardId) {
                        console.warn("Got \"card does not exist in the storage\" main card reply")
                        setShownMainCard("DoesNotExist")
                    } else {
                        console.log("Got stale non-existent reply for request main card " + mainCardFullID + ". Ignoring")
                    }
                }
                else {
                    const card = result
                    const downloadedCardId = card.namespace + "/" + card.id
                    if (mainCardFullID === downloadedCardId) {
                        console.log("Got main card " + mainCardFullID)
                        setShownMainCard(card)
                    } else {
                        console.log("Got stale reply for request main card " + mainCardFullID + ". Ignoring")
                    }
                }
            });
        } else {
            setShownMainCard("NotSet")
        }
    },[mainCardFullID, cardStorage])

    React.useEffect(() => {
        if (candCardFullID !== "") {
            setShownCandCard("Loading")            
            console.log("Fetching cand card " + candCardFullID)
            cardStorage.GetPetCardByFullID(candCardFullID).then(result => {
                if (ICardStorage.isUnexistentCardToken(result)) {
                    const checkedCardId = result.UnexistentCardNamespace + "/" + result.UnexistentCardID
                    if (candCardFullID === checkedCardId) {
                        console.warn("Got \"card does not exist in the storage\" cand card reply")
                        setShownCandCard("DoesNotExist")
                    } else {
                        console.log("Got stale non-existent reply for request cand card " + candCardFullID + ". Ignoring")
                    }
                }
                else {
                    const card = result
                    const downloadedCardId = card.namespace + "/" + card.id
                    if (candCardFullID === downloadedCardId) {
                        console.log("Got cand card " + candCardFullID)
                        setShownCandCard(card)
                    } else {
                        console.log("Got stale reply for request cand card " + candCardFullID + ". Ignoring")
                    }
                }
            });
        } else {
            setShownCandCard("NotSet")
        }
    },[candCardFullID, cardStorage])

    const titleLocalizedStr = t("title")
    const titleDescrLocStr = t('candidatesReview.section')
    React.useEffect(() => {
        document.title = titleLocalizedStr + ' - '+ titleDescrLocStr
      },[titleLocalizedStr, titleDescrLocStr]);    


    
    const renderUpperScreen = () => {
        let leftCardAssignment: TwoCards.CardAssignment;
        let rightCardAssignment: TwoCards.CardAssignment;

        const mainCardAssignment = cardStateToCardAssignement(shownMainCard)
        switch(mainCardAssignment)
        {
            case "unexistent":
            case "unassigned":
            case "loading":
                // while the main card is not loaded or not set we do not know whether it is Lost or Found card
                // thus we don't know whether it is at left or right pard
                // so both parts are marked as Loading
                leftCardAssignment = mainCardAssignment
                rightCardAssignment = mainCardAssignment
                break;
            default: {
                const card = mainCardAssignment
                const depCardAssignment = cardStateToCardAssignement(shownCandCard)
                const isLostCard = card.cardType === DataModel.CardType.Found
                if (isLostCard) {
                    // Found cards are presented at the left part
                    leftCardAssignment = card
                    rightCardAssignment = depCardAssignment
                } else {
                    rightCardAssignment = card
                    leftCardAssignment = depCardAssignment
                }
                break;
            }
        }

        return (
            <div className="upper-screen">
                <TwoCards.TwoCardsViewer leftCard={leftCardAssignment} rightCard={rightCardAssignment} />
            </div>
        )
    }

    const handleSelectionChanged = (newCandFullID: string) => {
        // passing up the event to the parent
        candCardFullIDChanged?.(newCandFullID)
    }

    const renderLowerScreen = () => {
        let lowerContent
        switch(shownMainCard) {
            case "DoesNotExist":
            case "NotSet":
                lowerContent = false
                break
            case "Loading":
            default: {
                const mainCard = shownMainCard === "Loading" ? null : shownMainCard
                lowerContent = <Thumbnails.CandidatesThumbnails
                                referenceCard={mainCard}
                                selectedCardFullID={candCardFullID}
                                selectionChanged={(newFullID) => handleSelectionChanged(newFullID)}
                                searcher={searcher}
                                cardStorage={cardStorage} />
            }
        }
        return (
            <div className="lower-screen">
                {lowerContent}
            </div>
        )
    }

    
        const upperScreen = renderUpperScreen()
        const lowerScreen = renderLowerScreen()
        return (
            <div className="CandidatesReview">
                {upperScreen}
                {lowerScreen}
            </div>
        )
    

}