const typeOne = "незаконная свалка";
const typeTwo = "мусорный контейнер";
const typeThree = "автотранспорт";
const typeFour = "деревья";

export const reportData = {
  types: {
    question: "Какого типа проблема?",

    typeOne: {
      title: typeOne,
      question: "Свалка отходов какого типа?",
      answers: ["строительный мусор", "бытовой мусор", "коммерческий мусор"],
    },
    typeTwo: {
      title: typeTwo,
      question: "Какая проблема с контейнером?",
      answers: ["переполенный", "сломанный", "отсутствует"],
    },
    typeThree: {
      title: typeThree,
      question: "Какая проблема с авто?",
      answers: ["брошенный  авто", "сгоревший авто", "ужасный тюнинг"],
    },
    typeFour: {
      title: typeFour,
      question: "Какая проблема с деревьями?",
      answers: ["спиленные", "поваленные", "представляющее опасность падения"],
    },
    answers: [typeOne, typeTwo, typeThree, typeFour],
  },
  date: {
    question: "Когда примерно это произошло?",
    answers: ["Сегодня", "Вчера", "Около недели назад", "Около месяца назад"],
  },
  location: {
    question: "Взять геолокацию проблемы (ваше текущее местоположение)",
    answers: ["Отправить геолокацию"],
  },
  photo: {
    question: "Добавьте фото проблемы и нажмите 'Далее'",
    answers: ["Далее"],
  },
  comment: {
    question: "Хотите оставить свой комментарий о проблеме?",
    answers: ["Без комментариев!"],
  },
  finalText: "Данные успешно переданы.\nСпасибо за Вашу гражданскую позицию!",
  errorText: "Ошибка! Пожалуйста, заполните запрос заново!",
  reportTrigger: "report",
};

export const menuData = {
  startCommands: ["start", "menu", "exit", "again", "restart"],
  greeting: "Антимусор Бот",
  report: "Информировать о проблеме в городе",
  help: "Как пользоваться ботом",
};

export const helpData = {
  helpText: `Для использования бота:
  1. Выберите в меню "Информировать о проблеме в городе"
  2. Введите требуемые Данные
  3. Прикрепите фото и гео данные проблемы.
  `,
};

export const reportMessageData = {
  filledSign: "✔",
  emptySign: "✘",
  title: "ДАННЫЕ О ПРОБЛЕМЕ: ",
  typeOfProblem: "Тип проблемы: ",
  problem: "Проблема: ",
  date: "Дата: ",
  location: "Геолокация: ",
  photo: "Фото: ",
  comment: "Комментарий: ",
};
