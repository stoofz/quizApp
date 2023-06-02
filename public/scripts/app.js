// Client facing scripts here
/* eslint-env jquery */
/* eslint-disable no-unused-vars */

const selectAnswer = (button, index) => {
  const questionBox = $(button).closest('.question-box');
  const selectedButton = questionBox.find('button');
  const userAnswer = $(`#a${index}`);

  selectedButton.removeClass('selected');
  $(button).addClass('selected');

  userAnswer.val(button.value);
};

// $(document).ready(function () {
//   $("#submitQuiz").submit(function(event){
//     event.preventDefault();
// })});

/* eslint-enable no-unused-vars */
