export const getBotAnswers = (answersArray, quantityInLine = 1) => {
  const buttonsArray = [];
  const buffer = [];

  answersArray.map((answer) => {
    if (quantityInLine === 1) {
      buttonsArray.push([{ text: answer }]);
    }

    if (quantityInLine === 2) {
      buffer.push({ text: answer });

      if (buffer.length == 2) {
        buttonsArray.push([...buffer]);
        buffer.length = 0;
      }
    }
  });

  return buttonsArray;
};
