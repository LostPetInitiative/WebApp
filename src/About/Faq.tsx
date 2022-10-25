import * as React from "react";
import { useTranslation } from "react-i18next";
import Header from "../Header";
import "./Faq.scss";
import { Team } from "./Team";

const mailToElement = (
  <a href="mailto:contact@kashtanka.pet">contact@kashtanka.pet</a>
);

const pet911ru_link = (
  <a href="https://pet911.ru" target="_BLANK" rel="external">
    pet911.ru
  </a>
);
const poiskzoo_link = (
  <a href="https://poiskzoo.ru" target="_BLANK" rel="external">
    poiskzoo.ru
  </a>
);

const technology_logos = (
    <div className="logos-container">
        <img
          alt="Kubernetes"
          src="https://kubernetes.io/images/nav_logo2.svg"
        />
        <img
          alt="TensorFlow"
          src="https://upload.wikimedia.org/wikipedia/commons/1/11/TensorFlowLogo.svg"
        />
        <img
          alt="Apache Kafka"
          src="https://kafka.apache.org/logos/kafka_logo--simple.png"
        />
        <img
          alt="Apache Cassandra"
          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Cassandra_logo.svg"
        />
        <img
          alt="Apache Solr"
          src="https://solr.apache.org/theme/images/logo.svg"
        />
      </div>
)

const russianQnA = (
  <>
    <h2>Я потерял/нашёл домашнее животное. Чем мне может помочь Каштанка?</h2>
    <p className="answer">
      Каштанка ищет животных среди фотографий из объявлений с подключённых
      ресурсов. Опубликуйте ваше объявление о потере/находке на одном из
      дружественных сайтов, например, на {pet911ru_link} или {poiskzoo_link}, и
      объявление будет автоматически обработано Каштанкой.
    </p>

    <h2>С какими животными работает система</h2>
    <p className="answer">Сейчас поддерживаются только кошки и собаки.</p>

    <h2>Как я могу помочь проекту?</h2>
    <p className="answer">
      Проект нуждается в вычислительных ресурсах и волонтёрах.
      <br />
      Вы можете стать волонтёром проекта и проверять совпадения, которые
      предложила Каштанка, связываться с хозяевами.
      <br />
      Если вы хотите поддержать проект материально - напишите нам на почту{" "}
      {mailToElement}, мы арендуем компьютеры на пожертвования.
    </p>

    <h2>Как устроена работа волонтера с сайтом?</h2>
    <p className="answer">
      Волонтеры имеют доступ к управлению{" "}
      <a href="#/board">карточками совпадений</a>. Благодаря карточкам ясно,
      каким животным занимается какой волонтер. А также какие карточки уже
      просмотрены, а какие ещё предстоит проверить. Чтобы получить доступ к
      управлению карточками, напишите на {mailToElement}
    </p>

    <h2>Как происходит поиск схожих животных?</h2>
    <p>
      Каштанка использует нейронные сети для выделения визуальных признаков у
      животных (окрас, форма, пропорции тела, морды, и т.д.). Похожие животные
      определяются по схожести визуальных признаков животных.
      <br />
      При поиске также учитывается близость места пропажи и находки в
      пространстве и во времени.
    </p>

    <h2>Каштанка считает похожими животных, которые совсем не похожи!</h2>
    <p>
      Нейронная сеть работает не идеально. Причина этого в первую очередь в том,
      что она обучалась на данных с ошибками. Мы планируем подчистить ошибки в
      данных для обучения нейронной сети и переобучить систему. Система станет
      точнее.
    </p>

    <h2>
      У меня есть сайт (или группа в соц. сети) о пропавших и найденных
      животных. Как добавить эти данные в систему?
    </h2>
    <p className="answer">Напишите нам на почту {mailToElement}.</p>

    <h2>Я нашел баг или у меня есть пожелание.</h2>
    <p className="answer">
      Сообщите о проблеме на{" "}
      <a href="https://github.com/LostPetInitiative/Kashtanka/issues">
        сайте разработки
      </a>{" "}
      системы Каштанка.
    </p>

    <h2>Как много данных обрабатывает система?</h2>
    <p>
      В данный момент Каштанка знает о сотнях тысяч объявлений о потере/находке
      домашних животных.
      <br />
      Мы используем передовые технологи в области искусственного Интеллекта (ИИ)
      и обработки Больших Данных (Big Data) от ведущих интернет компаний, таких
      как Google, Facebook.
      <br />
      Используемые технологии позволяют горизонтально масштабировать
      вычислительные мощности системы и обрабатывать тысячи новых объявлений в
      секунду.
      <br />
      Мы используем:
      <br />
      {technology_logos}
    </p>
  </>
);

const englishQnA = (
  <>
    <h2>I lost/found a pet. How Kashtanka can help me?</h2>
    <p className="answer">
      Kashtaka does a pet search among photos published on connected message
      boards. Publish your new message about lost/found pet at one of our
      partner web sites (e.g. {pet911ru_link} or {poiskzoo_link}), then your
      message will be automatically processed by Kashtanka.
    </p>

    <h2>Which pet species the Kashtanka supports?</h2>
    <p className="answer">Now only cats and dogs are supported.</p>

    <h2>How can I help the project?</h2>
    <p className="answer">
      The project needs computational power (computers) and volunteers.
      <br />
      You can join the team as volumteer and check the matches that Kashtanka
      proposes, reach pet owners upon matches.
      <br />
      If you want to help by computational resources, reach us by{" "}
      {mailToElement} email, we can instruct you how rent virtual PC and donate
      it to the project.
    </p>

    <h2>How a volunteer works with the website?</h2>
    <p className="answer">
      The volunteers have access to the
      <a href="#/board">match card board</a>. By using the cards we track which
      volunteer works with particular lost/found message. Also we know which
      cards are already evaluated by human and which matches still need human
      attention. If you want to get write access to the card board write us at{" "}
      {mailToElement}
    </p>

    <h2>How the system looks for the similar pets?</h2>
    <p>
      Kashtanka uses neural networks to extract distinctive visual features
      (color, shape, body/head proportions, etc.) of individual pets Pets which
      posses similar visual features are considered similar.
      <br />
      The proximity in space and time between lost and found events is also
      accounted during the search.
    </p>

    <h2>Kashtanka states that the pets are similar, but they are not!</h2>
    <p>Neural network is imperfect. We are working on quality improvement.</p>

    <h2>
      I have aweb site (or social network public group) dedicated to lost and
      found pets. How can I add the messages from it to the system?
    </h2>
    <p className="answer">Write us at {mailToElement}.</p>

    <h2>I found a bug or I have a suggestions.</h2>
    <p className="answer">
      Create an issua at{" "}
      <a href="https://github.com/LostPetInitiative/Kashtanka/issues">
        project development portal
      </a>{" "}
      of Kashtanka.
    </p>

    <h2>How much data is processed by the system?</h2>
    <p>
      Currently the system is aware of hundreds thiusands messages about lost
      and found pets.
      <br />
      We use state of the art Artificial intelligence (AI) and Big Data
      technologies which are used by major tech companies like Google, Facebook
      to deal with such amount of data.
      <br />
      The usage of such technologies allowes us to horizontally scale the parts of the system
      and potentially process hundreds of messages per second.
      <br />
      We use:
      <br />
      {technology_logos}
    </p>
  </>
);

function Faq(props: {}) {
  React.useEffect(() => {
    document.title =
      "Каштанка - автоматический поиск потерянных и найденных домашних животных - Вопросы и ответы";
  });

  const { t, i18n } = useTranslation("translation", { keyPrefix: "about" });
  const kashtankaTeamStr = t("kashtankaTeam");

  // TODO: can we ensure that the compoent is rerendered upon language change?
  var QnA: JSX.Element;
  switch (i18n.resolvedLanguage) {
    case "ru":
      QnA = russianQnA;
      break;
    case "en":
      QnA = englishQnA;
      break;
    default:
      QnA = null;
  }
  return (
    <div className="faq-page">
      <Header />
      <div className="faq-text">
        <h2>{kashtankaTeamStr}</h2>
        <Team />
        {QnA}
      </div>
    </div>
  );
}

export default Faq;
