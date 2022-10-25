import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const resources = {
    ru: {
        translation: {
            about:{
                team: {
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
                }
            }
        }
      },
      en: {
        translation: {
            about:{
                team: {
                  dmitry: {
                    name: 'Dmitry Grechka',
                    title: 'System architect, Researcher, Developer',
                    desc: "Dmitry conceived the system, designed and built it. He is also maintaining the system."
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
                    desc: "During his masters thesis preparation, Zhirui trained the Swin Transformer based neural network model to extract unique pet identity visual features based. The model is used in the production system right now."
                  },
                }
            },
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