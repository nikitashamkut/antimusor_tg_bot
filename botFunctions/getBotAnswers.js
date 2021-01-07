export const getBotAnswers = (answersArray, quantityInLine = 1) => {
  return answersArray.map((answer) => {
    if (quantityInLine === 1) {
      return [{ text: answer }];
    }
  });
};

// keyboard: [
//     [{ text: "незаконная свалка" }, { text: "мусорный контейнер" }],
//     [{ text: "автотранспорт" }, { text: "деревья" }],
//   ]
