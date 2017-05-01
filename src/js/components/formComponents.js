(function(global){
  "use strict";

  /**
   * Creates a HTMLElement with the error text message attached to it
   * @param {string} message - A message to be attached to the error HYMLElement
   * @returns {HTMLElement} HTMLElement of the error message
   */
  const createQuestionError = message => {
    const errorNode = document.createElement("span");

    const errorNodeText = document.createTextNode(message);
    errorNode.classList.add("briefing-questionError");
    errorNode.appendChild(errorNodeText);

    return errorNode;
  };

  /**
   * Creates a Node component for the `text` type of question
   * @param {string} placeholder - input's placeholder
   * @param {Boolean} isSmall - Should be true if the input shouldn't fill all the width space
   * @returns {HTMLElement} `text` answer type Node component
   */
  const createTextAnswerType = (placeholder, nameAttr, isSmall = false, mask) => {
    const questionAnswer = document.createElement("input");
    questionAnswer.setAttribute("placeholder", placeholder);
    questionAnswer.setAttribute("name", nameAttr);
    questionAnswer.setAttribute("type", "text");

    questionAnswer.classList.add("briefing-questionText");
    if (isSmall) questionAnswer.classList.add("--small");

    // I won't lie it is dynamic because it isn't, i have forgotten
    //  about the mask of the phone input, so i made it quickly
    //  to show something. The idea was to create a separate module
    //  that treats any type of mask we wanted.
    if(mask){
      questionAnswer.setAttribute("maxlength", mask.length-1);

      questionAnswer.addEventListener("keyup", (e) => {
        const inputSplitted = e.target.value.replace(/\D/g, "").split("");

        const newValue = inputSplitted.map((c, i) => {
          if (inputSplitted.length-1 === i) {
            return c;
          }else if (i === 0) {
            return `(${c}`;
          }else if(i === 1){
            return `${c}) `;
          }else if(i === 2 && inputSplitted.length > 10){
            return `${c} `;
          }else if(i === 6 && inputSplitted.length > 10){
            return `${c}-`;
          }else if(i === 5 && inputSplitted.length <= 10){
            return `${c}-`;
          }else{
            return c;
          }
        }).join("");

        e.target.value = newValue;
      });
    }

    return questionAnswer;
  };

  /**
   * Creates a Node component for the `textarea` type of question
   * @param {string} placeholder - textarea's placeholder
   * @returns {HTMLElement} `textarea` answer type Node component
   */
  const createTextareaAnswerType = (placeholder, nameAttr) => {
    const questionAnswer = document.createElement("textarea");
    questionAnswer.setAttribute("placeholder", placeholder);
    questionAnswer.setAttribute("name", nameAttr);

    questionAnswer.classList.add("briefing-questionTextarea");

    return questionAnswer;
  };

  /**
   * Creates a Node component for the `enumerable` type of question, without multiple values allowed
   * @param {Array} answers - possible answers the user can choose
   * @param {string} nameAttr - unique `name` attribute for the `select` node
   * @param {string} placeholderOption - `select`'s first option
   * @returns {HTMLElement} `enumerable` answer type Node component
   */
  const createSelectAnswerType = (answers, nameAttr, placeholderOption) => {
    const questionAnswer = document.createElement("select");
    questionAnswer.setAttribute("name", nameAttr);
    questionAnswer.classList.add("briefing-questionSelect");

    const defaultOption = document.createElement("option");
    const defaultOptionText = document.createTextNode(placeholderOption);
    defaultOption.setAttribute("value", -1);
    defaultOption.appendChild(defaultOptionText);

    questionAnswer.appendChild(defaultOption);

    const questionAnswerOptions = document.createDocumentFragment();
    answers.forEach(answer => {
      let option = document.createElement("option");
      let optionText = document.createTextNode(answer);

      option.appendChild(optionText);
      option.setAttribute("value", answer);

      questionAnswerOptions.appendChild(option);
    });

    questionAnswer.appendChild(questionAnswerOptions);

    return questionAnswer;
  };

  /**
   * Creates a Node component for the `enumerable` type of question, with multiple values allowed
   * @param {Array} answers - possible answers the user can choose
   * @param {string} nameAttr - unique `name` attribute for the `input[type=checkbox]` group
   * @returns {HTMLElement} `enumerable` answer type Node component
   */
  const createCheckboxAnswerType = (answers, nameAttr) => {
    const questionAnswer = document.createElement("ul");

    const questionAnswerOptions = document.createDocumentFragment();

    answers.forEach(answer => {
      let questionAnswer = document.createElement("li");
      questionAnswer.classList.add("briefing-questionOption");

      let label = document.createElement("label");

      let checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.setAttribute("name", nameAttr);
      checkbox.setAttribute("value", answer);

      let span = document.createElement("span");
      let spanText = document.createTextNode(answer);
      span.appendChild(spanText);

      label.appendChild(checkbox);
      label.appendChild(span);

      questionAnswer.appendChild(label);

      questionAnswerOptions.appendChild(questionAnswer);
    });

    questionAnswer.appendChild(questionAnswerOptions);

    return questionAnswer;
  };

  /**
   * Chooses the correct answer's Node component based on the question's type
   * @param {Object} question - form's question object
   * @returns {HTMLElement} Question's answer Node Component
   */
  const createQuestionAnswer = question => {
    const {
      values:$values,
      allow_multiple_value:$allowMultipleTypes,
      type:$type,
      placeholder:$placeholder,
      mask:$mask,
      name:$name
    } = question;

    let questionAnswer;
    switch($type){
      case "enumerable":{
        let answers = Object.keys($values);
        questionAnswer = $allowMultipleTypes ?
          createCheckboxAnswerType(answers, $name)
          :
          createSelectAnswerType(answers, $name, $mask);
        break;
      }
      case "big_text":
        questionAnswer= createTextareaAnswerType($placeholder, $name);
        break;
      case "lat_lng":
        questionAnswer = createTextAnswerType($placeholder, $name, true);
        break;
      case "small_text":
        questionAnswer = createTextAnswerType($placeholder, $name);
        break;
      case "email":
        questionAnswer = createTextAnswerType($placeholder, $name);
        break;
      case "phone":
        questionAnswer = createTextAnswerType($placeholder, $name, true, "(99) 9 9999-9999");
        break;
    }

    return questionAnswer;
  };

  /**
   * Creates the question's title Node component
   * @param {string} title - question's label
   * @returns {HTMLElement} Node component for the question's title
   */
  const createQuestionTitle = title => {
    let questionLabel = document.createElement("label");
    let questionLabelText = document.createTextNode(title);
    questionLabel.appendChild(questionLabelText);
    questionLabel.classList.add("briefing-questionTitle");

    return questionLabel;
  };

  /**
   * Creates the question's Node component
   * @param {Object} question - Form's question component
   * @returns {HTMLElement} Question's Node component
   */
  const createQuestionNode = question => {
    let {
      label:$label
    } = question;

    let questionElement = document.createElement("section");
    questionElement.classList.add("briefing-question");

    const questionLabel = createQuestionTitle($label);
    questionElement.appendChild(questionLabel);

    const questionAnswer = createQuestionAnswer(question);
    questionElement.appendChild(questionAnswer);

    return questionElement;
  };

  /**
   * Creates the form's button Node component
   * @param {Object} btnOptions - Button's text and click handler
   * @returns {HTMLElement} Form's button Node component
   */
  const createFormButton = btnOptions => {
    const formBtn = document.createElement("button");
    const formBtnText = document.createTextNode(btnOptions.text);
    formBtn.classList.add("briefing-finish");
    formBtn.appendChild(formBtnText);

    formBtn.addEventListener("click", btnOptions.clickHandler);

    return formBtn;
  };

  /**
   * Mount all questions components into a single `fieldset` component
   * @param {Array} questions - Form's questions
   * @param {Object} btnOptions - Form button's options
   * @returns {HTMLElement} Form's Node component
   */
  const createFormNode = (questions, btnOptions) => {
    const formElement = document.createElement("fieldset");
    formElement.classList.add("briefing-questionsContainer");

    questions.forEach(question => {
      let questionElement = createQuestionNode(question);
      formElement.appendChild(questionElement);
    });

    const formBtn = createFormButton(btnOptions);

    formElement.appendChild(formBtn);

    return formElement;
  };

  global.modules.formComponents = {
    createQuestionError,
    createFormNode
  };

})(window);