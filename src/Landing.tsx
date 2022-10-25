import * as React from "react";
import Header from "./Header";
import "./Landing.scss";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ruText = (
  <div className="landing-text">
    <p>
      Каштанка - проект кооперации волонтеров и искусственного интеллекта в
      поиске потерявшихся домашних животных.
    </p>
    <h2>Как это работает</h2>
    <ol>
      <li>
        Поисковые роботы Каштанки постоянно просматривают интернет на наличие
        новых объявлений о пропаже или находке домашних животных.
      </li>
      <li>
        При обнаружении нового объявления модуль искусственного интеллекта
        сравнивает животное на фотографии с сотнями тысяч объявлений, ранее
        обработанных системой.
      </li>
      <li>
        Наиболее похожие пары объявлений (потерялся - нашелся) добавляются на{" "}
        <NavLink to="/board">доску возможных совпадений</NavLink> для
        волонтеров.
      </li>
      <li>
        Волонтеры проверяют действительно ли питомец в объявлении о пропаже и в
        объявлении о находке один и тот же.
        <br />В случае совпадения волонтер связывается с хозяином.
      </li>
    </ol>
    <p>
      Помогите животным вернуться домой! Проверьте возможные совпадения, нажав
      на карточки ниже.
    </p>
  </div>
);

const enText = (
  <div className="landing-text">
    <p>
     Kashtanka joins the efforts of human volunteers and AI to help lost pets get to their homes.
    </p>
    <h2>How does it work</h2>
    <ol>
      <li>
        Kashtanka web crawlers constantly monitors the dedicated web sites for the 
        new messages about lost or found pets.
      </li>
      <li>
        Upon crawling of new message, AI system looks through hundreds of thousands messages already stored in the system
        in order to find whether someone posted a message about exactly the same pet previously.
      </li>
      <li>
        The pairs of messages (lost/found) which seem to be describing the same pate
        are added to the {" "}
        <NavLink to="/board">matches card board</NavLink> so the human volunteers can verify them.
      </li>
      <li>
        The volunteers verify whether the pet is indeed the same on both lost and found messages.
        <br />If it is, they reach the pet owners to tell them about the found pair.
      </li>
    </ol>
    <p>
      Help the pets to return to their homes!
      Check the possible matches by pressing the cards bellow.
    </p>
  </div>
);

function Landing(props: {}) {
  const { t: tGen, i18n } = useTranslation("translation");
  const { t } = useTranslation("translation", { keyPrefix: "landing" });
  React.useEffect(() => {
    document.title = tGen("title");
  });

  // TODO: can we ensure that the compoent is rerendered upon language change?
  var text: JSX.Element;
  switch (i18n.resolvedLanguage) {
    case "ru":
      text = ruText;
      break;
    case "en":
      text = enText;
      break;
    default:
      text = null;
  }

  return text;
}

export default Landing;
