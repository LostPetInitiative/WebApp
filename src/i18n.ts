import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const resources = {
    ru: {
        translation: {
            kashtanka: "Каштанка",
            title: "Каштанка - автоматический поиск потерянных и найденных домашних животных",
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
                        desc: "Николай - научный руководитель студентов и аспирантов, занимающихся применением машинного обучения. Координатор научного взаимодействия в рамках проекта."
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
                        desc: "В рамках работы над кандидатской диссертацией Вячеслав подготовил набор данных для обучения и оценки качества моделей поиска животных. Создал конкурс лучших моделей. Обучил модели поиска животных, основанные на BLIP"
                    },
                    maria: {
                      // name: 'Мария Елисеева',
                      name: 'Мария',
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
            cards: {
              latestCardsPreview: {
                downloadingLatestCards: "Downloading latest cards...",
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
                      desc: "Nikolay is a scientific advisor of the master and PhD students involved in the project. Organizes research talks and curates research directions."
                  },
                  zhirui: {
                    name: 'Zhirui',
                    title: 'AI model creator, Researcher',
                    desc: "During the masters thesis preparation, Zhirui trained the Swin Transformer based neural network model to extract unique pet identity visual features based. The model is used in the production system right now."
                  },
                  tee: {          
                    name: 'Tee, Yu Shiang',
                    title: 'AI model creator, Researcher',
                    desc: "During the masters thesis preparation Tee, Yu Shiang trained the YoloV5 Nueral Network model to extract the bounding box of cat and dog heads on photos. The model is used in the production system right now."
                  },
                  vyacheslav: {
                    name: 'Vyacheslav Stroev',
                    title: 'Researcher',
                    desc: "During the PhD thesis perparation Vyacheslav created a dataset for training and evaluation of pet retrieval models. Created evaluation scripts and the leaderboard. Trained BLIP-based models of pet retrieval."
                  },
                  maria: {
                    // name: 'Мария Елисеева',
                    name: 'Maria',
                    title: 'Researcher',
                    desc: "During the masters thesis preparation Maria created data annotation process, annotated the data for machine learning, as well as did data analysis."
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