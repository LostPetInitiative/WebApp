import * as React from "react";
import "./Landing.scss";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

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
    <h2>How it works</h2>
    <ol>
      <li>
        Kashtanka web crawlers constantly monitor dedicated web sites for 
        new messages about lost or found pets.
      </li>
      <li>
        Upon crawling of a new message, AI system looks through hundreds of thousands of messages already stored in the system
        in order to find whether someone previously posted a message about exactly the same pet.
      </li>
      <li>
        The pairs of messages (lost/found) which seem to be describing the same pat
        are added to the {" "}
        <NavLink to="/board">match card board</NavLink> so human volunteers can verify them.
      </li>
      <li>
        The volunteers verify whether the pet is indeed the same on both lost and found messages.
        <br />If it is, they reach the pet owners to tell them about the found pair.
      </li>
    </ol>
    <p>
      Help pets to return to their homes!
      Check the possible matches by pressing the cards below.
    </p>
  </div>
);

function Landing() {
  const { t, i18n } = useTranslation("translation");
  
  const titleLocStr = t("title")

  React.useEffect(() => {
    document.title = titleLocStr;
  },[titleLocStr]);

  let text: JSX.Element;
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

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <div>
      {text}
      <Carousel swipeable={false}
        draggable={false}
        showDots={true}
        responsive={responsive}
        ssr={false} // means to render carousel on server-side.
        infinite={true}
        //autoPlay={this.props.deviceType !== "mobile" ? true : false}
        autoPlay={false}
        autoPlaySpeed={1000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        //deviceType={this.props.deviceType}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
      </Carousel>;
    </div>
  )
}

export default Landing;
