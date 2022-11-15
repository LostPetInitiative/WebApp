import * as React from "react"
import './DataModel'
import './App.scss';
import { CandidatesReview } from './CandidatesReview/CandidatesReview'
import "./apiClients/RestApiCardStorage"
import * as ICardStorage from "./apiClients/ICardStorage"
import * as ISearch from "./apiClients/ISearch"
import * as RestCardStorage from "./apiClients/RestApiCardStorage";
import SolrGatewaySearcher from "./apiClients/SolrGatewaySearch"
import Landing from "./Landing";
import LatestCards from "./LatestCardsPreview"
import {VitalsPage} from "./Vitals/Vitals"
import Faq from "./About/Faq"
import Header from "./Header"
import {MatchBoard} from "./MatchesBoard"
import {Tracker} from "./MatomoTracker"
import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink,
  useParams,
  useHistory,
  Redirect
} from "react-router-dom";

import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();

const development = window.location.hostname === "localhost"
let cardStorageURL: string
let solrGatewayURL: string
if (development) {
  console.log("Running in development mode")
  // cardStorageURL = "http://10.0.4.12:31642"
  // solrGatewayURL = "http://10.0.4.12:30069"
  // cardStorageURL = "http://cassandra-rest-api.kashtanka"
  // solrGatewayURL = "http://search-gateway.kashtanka"
  cardStorageURL = "https://kashtanka.pet/api/storage"
  solrGatewayURL = "https://kashtanka.pet/api/search"
} else {
  cardStorageURL = "api/storage"
  solrGatewayURL = "api/search"
}

const cardStorage: ICardStorage.ICardStorage = new RestCardStorage.CardStorage(cardStorageURL);
const searchEngine: ISearch.ISearch = new SolrGatewaySearcher(solrGatewayURL)

function LatestFoundCardCandidatesReview() {
  const {t} = useTranslation()

  const [ latestFoundCardID, setLatestFoundCardID] = React.useState<[string,string] | null>(null)

  React.useEffect(() => {
    searchEngine.GetLatestCards(1, ISearch.LatestCardSearchType.Found).then(cards => {
      const latestCard = cards[0]
      setLatestFoundCardID([latestCard.namespace, latestCard.id])
    });
  },[])


  const lookingForMostRecentFoundLocStr = t("candidatesReview.lookingForMostRecentFound")
  
  if (latestFoundCardID === null) {
    return (
      <Spinner size={SpinnerSize.large} label={lookingForMostRecentFoundLocStr}/>
    )
  } else {
    const ns1 = latestFoundCardID[0]
    const id1 = latestFoundCardID[1]
    const fullMainID = ns1 + "/" + id1
    return <Redirect to={"/candidatesReview/" + fullMainID} />
  }
  
}

function SpecificCandidatesReview() {
  const { ns1, id1, ns2, id2 } = useParams<{ ns1: string, id1: string, ns2: string, id2: string }>();

  const fullMainID = ns1 + "/" + id1
  const condFullID = ((ns2 === undefined) || (id2 === undefined)) ? "" : (ns2 + "/" + id2)

  const history = useHistory()
  const NavigateToSpecificCandidate = (candFullID: string) => {
    history.push("/candidatesReview/" + ns1 + "/" + id1 + "/" + candFullID)
  }
  return (
    <CandidatesReview
      cardStorage={cardStorage}
      searcher={searchEngine}
      mainCardFullID={fullMainID}
      candCardFullID={condFullID}
      candCardFullIDChanged={(e) => NavigateToSpecificCandidate(e)}
    />
  )
}

import KashtankaLogo from './img/cat/1.jpg';
import TrelloLogoOrange from './img/menus/board_trello_logo_orange.png'
import TrelloLogoPale from './img/menus/board_trello_logo_pale.png'

import CompareAbOrange from './img/menus/compare_ab_orange.png'
import CompareAbPale from './img/menus/compare_ab_pale.png'

import QuestionsOrange from './img/menus/questions_orange.png'
import QuestionsPale from './img/menus/questions_pale.png'

import VitalsOrange from './img/menus/vitals_orange.svg'
import VitalsPale from './img/menus/vitals_pale.svg'

import { LanguageSwitcher } from "./LanguageSwitcher";
import { Spinner, SpinnerSize, ThemeProvider } from "@fluentui/react";
import { kashtankaTheme } from "./Theme";
import { useTranslation } from "react-i18next";

function Menu() {
  const {t} = useTranslation()
  const boardLocStr = t("menu.board")
  const compLocStr = t("menu.AB")
  const qnaLocStr = t("menu.qna")
  const vitalsLocStr = t("menu.vitals")
  return (
    <div id="leftColumnMenu">
      <div id="appStateMenu">
        <div id="headerCornerDiv">
          <NavLink to="/">
            <img id="headerLogo" alt="Логотип Каштанки" src={KashtankaLogo}></img>
          </NavLink>
        </div>
        <NavLink to="/board" activeClassName="activePage" title={boardLocStr}>
          <div className="menuItem">
            <img alt={boardLocStr} className="active" src={TrelloLogoOrange} />
            <img alt={boardLocStr} className="inactive" src={TrelloLogoPale} />
          </div>
        </NavLink>
        <NavLink to="/candidatesReview/" activeClassName="activePage" title={compLocStr}>
          <div className="menuItem">
            <img alt={compLocStr} className="active" src={CompareAbOrange} />
            <img alt={compLocStr} className="inactive" src={CompareAbPale} />
          </div>
        </NavLink>
        <NavLink to="/faq" activeClassName="activePage" title={qnaLocStr}>
          <div className="menuItem">
            <img alt={qnaLocStr} className="active" src={QuestionsOrange} />
            <img alt={qnaLocStr} className="inactive" src={QuestionsPale} />
          </div>
        </NavLink>
        <NavLink to="/vitals" activeClassName="activePage" title={vitalsLocStr}>
          <div className="menuItem">
            <img alt={vitalsLocStr} className="active" src={VitalsOrange} />
            <img alt={vitalsLocStr} className="inactive" src={VitalsPale} />
          </div>
        </NavLink>
      </div >
      <LanguageSwitcher />
    </div>
  )
}

function LandingWithLatestCards() {
  const history = useHistory()
  const navigateToSpecificCard = (fullID: string) => {
    history.push("/candidatesReview/" + fullID)
  }

  return (
    <div>
    <Header />
    <div className="landing-container">
      
      <Landing />
      <LatestCards
        cardsToShow={5}
        cardsTypeToShow={ISearch.LatestCardSearchType.Found}
        cardStorage={cardStorage}
        searcher={searchEngine}
        previewClicked={(e) => navigateToSpecificCard(e)}
      />
    </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider applyTo='body' theme={kashtankaTheme}>
      <Router>
      <React.Suspense fallback={<p>loading...</p>}>
        {(!development) &&
          <Tracker trackerHostName={"matomo.grechka.family"} />
        }
        <div className="parentDiv">
          <Menu />
          <div className="AppModeViewer">
            <Switch>
              <Route path="/candidatesReview/:ns1/:id1/:ns2/:id2">
                <SpecificCandidatesReview />
              </Route>
              <Route path="/candidatesReview/:ns1/:id1">
                <SpecificCandidatesReview />
              </Route>
              <Route path="/candidatesReview">
                <LatestFoundCardCandidatesReview />
              </Route>
              <Route path="/board">
                <MatchBoard />
              </Route>
              <Route path="/faq">
                <Faq />
              </Route>
              <Route path="/vitals">
                <VitalsPage solrGatewayURL={solrGatewayURL} />
              </Route>
              <Route path="/">
                <LandingWithLatestCards />
              </Route>
            </Switch>
          </div>
        </div>
      </React.Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
