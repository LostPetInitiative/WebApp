import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const resources = {
    ru: {
        translation: {
            kashtanka: "Каштанка",
            title: "Каштанка - автоматический поиск потерянных и найденных домашних животных",
            common: {
              loading:"Загрузка...",
              distance: "Расстояние",
              animal: "Животное",
              lost: "Потерялся",
              found: "Нашелся",
              male: "Мальчик",
              female: "Девочка",
              comment: "Комментарий",
              when: "Когда?",
              where: "Где?",
              cardNotFound: "Карточка не найдена",
              error: "Ошибка",
              noPhoto: "Нет фото"
            },
            cardViewer: {
              goToOrig: "Перейти к объявлению",
              failedToDownloadCard: "Не удалось загрузить карточку",
            },
            candidatesReview: {
              section: "Сравнение объявлений",
              cardNotSelectedSelectBelow: "Карточка не выбрана. Выберите карточку из списка снизу",
              lookingForMatches: "Поиск совпадений...",
              possibleMatches: "Возможные совпадения:",
              lookingForMostRecentFound: "Поиск самого свежего объявления о находке животного..."
            },
            diffViewer: {
              differentSexWarning: "Животные, предположительно, разного пола!",
              differentSpeciesWarning: "Животные разного вида!",
              LostAfterFoundWarning: "Время находки предшествует времени пропажи!",
              timeDifference: "Между событиями прошло",
              similarity: "Схожесть (чем ближе к 1.0, тем более похоже)"
            },
            cards: {
              latestCardsPreview: {
                downloadingLatestCards: "Загружаю самые свежие объявления...",
                downloadFailed: "Не удалось загрузить свежие объявления",
                downloadedLatestCards: "Свежие объявления, обработанные системой:"
              }
            },
            about:{
                section: "Вопросы и ответы",
                kashtankaTeam: "Команда Каштанки",
                team: {
                    collapseTeam: "Свернуть команду",
                    dmitry: {
                      name: 'Дмитрий Гречка',
                      title: 'Архитектор системы, Исследователь, Разработчик',
                      desc: "Дмитрий придумал идею системы, спроектировал и воплотил ее в жизнь. Также поддерживает работу системы."
                    },
                    lucy: {
                      name: "Люся Гречка",
                      title: "Веб-разработчик",
                      desc: "Люся разработала значительную часть веб приложения Каштанки."
                    },
                    nikolay: {
                        name: "Николай Арефьев",
                        title: "Научный руководитель, Исследователь",
                        desc: "Николай - научный руководитель студентов и аспирантов, занимающихся применением машинного обучения, координатор научного взаимодействия в рамках проекта. Николай и Вячеслав подготовили набор данных для обучения и оценки качества моделей поиска животных, создали online конкурс лучших моделей"
                    },
                    zhirui: {
                      name: 'Zhirui',
                      title: 'Создатель ИИ модели, Исследователь',
                      desc: "В рамках работы над магистерской диссертацией Zhirui обучил нейронную сеть на базе Swin Transformer выделять из фотографии головы кошки или собаки вектор признаков, специфичных для каждой особи. Эта модель в данный момент используется в системе."
                    },
                    tee: {          
                      name: 'Tee, Yu Shiang',
                      title: 'Создатель ИИ модели, Исследователь',
                      desc: "В рамках работы над магистерской диссертацией Tee, Yu Shiang обучил модель YoloV5 выделять область головы собак и кошек на фото. Эта модель в данный момент используется в системе."
                    },
                    vyacheslav: {
                        name: 'Вячеслав Строев',
                        title: 'Исследователь',
                        desc: "В рамках работы над кандидатской диссертацией Вячеслав подготовил набор данных для обучения и оценки качества моделей поиска животных. Создал online конкурс лучших моделей. Обучил модели поиска животных, основанные на BLIP"
                    },
                    maria: {
                      name: 'Мария Елисеева',
                      title: 'Исследователь',
                      desc: "В рамках работы над магистерской диссертацией Мария работала над средствами разметки данных, самой разметкой данных для машинного обучения, а также анализом распределения данных."
                    }
                }
            }
        }
      },
      en: {
        translation: {
            kashtanka: "Kashtanka",
            title: "Kashtanka - AI powered search of lost and found pets",
            common: {
              loading:"Loading...",
              distance: "Distance",
              animal: "Animal",
              lost: "Lost",
              found: "Found",
              male: "Boy",
              female: "Girl",
              comment: "Comment",
              when: "When?",
              where: "Where?",
              cardNotFound: "Card not found",
              error: "Error",
              noPhoto: "No photo"
            },
            cardViewer: {
              goToOrig: "Open orig message",
              failedToDownloadCard: "Failed to load the card"
            },
            candidatesReview: {
              section: "Cards comparison",
              cardNotSelectedSelectBelow: "Card is not selected. Select a card below",
              lookingForMatches: "Looking for matches...",
              possibleMatches: "Possible matches:",
              lookingForMostRecentFound: "Looking for the most recent \"found\" card..."
            },
            diffViewer: {
              differentSexWarning: "The animals are of different sex!",
              differentSpeciesWarning: "The animals are of different species!",
              LostAfterFoundWarning: "Found event precedes the lost event!",
              timeDifference: "Time between the events",
              similarity: "Similarity (more closer to 1.0 is more similar)"
            },
            cards: {
              latestCardsPreview: {
                downloadingLatestCards: "Loading latest cards...",
                downloadFailed: "Failed to get latest cards",
                downloadedLatestCards: "Latest cards processed by Kashtanka:"
              }
            },
            about:{
                section: "Questions & Answers",
                kashtankaTeam: "Kashtanka team",
                team: {
                  collapseTeam: "Collapse the team",
                  dmitry: {
                    name: 'Dmitry Grechka',
                    title: 'System architect, Researcher, Developer',
                    desc: "Dmitry conceived the system, designed and built it. He also maintains the system."
                  },
                  lucy: {
                    name: "Lucy Grechka",
                    title: "Web Developer",
                    desc: "Lucy has developed significant part of the Kashtanka web app."
                  },
                  nikolay: {
                      name: "Nikolay Arefyev",
                      title: "Scientific advisor, Researcher",
                      desc: "Nikolay is a scientific advisor of master and PhD students involved in the project. Organizes research talks and curates research directions. Nikolay & Vyacheslav created a dataset for training and evaluation of pet retrieval models. They also created evaluation scripts and the leaderboard."
                  },
                  zhirui: {
                    name: 'Zhirui',
                    title: 'AI model creator, Researcher',
                    desc: "During the masters thesis preparation, Zhirui trained a Swin Transformer based neural network model to extract unique pet identity visual features. The model is used in the production system now."
                  },
                  tee: {          
                    name: 'Tee, Yu Shiang',
                    title: 'AI model creator, Researcher',
                    desc: "During the masters thesis preparation Tee, Yu Shiang trained the YoloV5 Nueral Network model to extract a bounding box of cat and dog heads from photos. The model is used in the production system now."
                  },
                  vyacheslav: {
                    name: 'Vyacheslav Stroev',
                    title: 'Researcher',
                    desc: "During the PhD thesis perparation Vyacheslav created a dataset for training and evaluation of pet retrieval models. Created evaluation scripts and the leaderboard. Trained BLIP-based models of pet retrieval."
                  },
                  maria: {
                    name: 'Maria Eliseeva',
                    title: 'Researcher',
                    desc: "During the masters thesis preparation Maria organized data annotation process, annotated data for machine learning and carried out data analysis."
                  }
            },
        }
      }
    }
} as const;


i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    defaultNS: "translation",
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: resources
  });

export default i18n;