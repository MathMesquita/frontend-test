(function(global){
  "use strict";

  const document = global.document;

  const {
    createQuestionError,
    createFormNode
  } = global.modules.formComponents;

  /**
   * Filter the incomming json's request response
   * @param {Object} data
   * @returns The `_embedded` attr from the request response
   */
  const treatFormData = data => data._embedded;

  /**
   * Apprend error and add `_isInvalid` class to the question's node
   * @param {HTMLElement} questionNode - Question's node
   * @param {HTMLElement} errorMessage - Error's node
   */
  const appendErrorInQuestion = (questionNode, errorMessage) => {
    let errorNode = createQuestionError(errorMessage);

    questionNode.classList.add("_isInvalid");
    questionNode.appendChild(errorNode);
  };

  /**
   * Clean any present error caracteristic from question's node
   * @param {HTMLElement} questionNode - Question's node
   */
  const removeErrorMessageFromQuestion = questionNode => {
    const messageNode = questionNode.querySelector(".briefing-questionError");

    if(messageNode){
      questionNode.classList.remove("_isInvalid");
      questionNode.removeChild(messageNode);
    }
  };

  /**
   * Returns the question's answer wrapper
   * @param {HTMLElement} questionNode - The question answer node
   * @returns {HTMLElement} The parent's node
   */
  const getParentQuestionWrapperNode = questionNode => {
    let parentWrapper = questionNode.parentNode;

    while(!parentWrapper.classList.contains("briefing-question")){
      parentWrapper = parentWrapper.parentNode;
    }

    return parentWrapper;
  };

  /**
   * Validate the `text` and `textarea` type of question
   * @param {Array} textNodeList - the `text` and `textarea` type of question HTMLElement
   * @param {Function} specialValidation - a function responsible to handle other
*                                         validations rather them if it isn't dirty
   * @returns {boolean} true if the specific field passed the validation
   */
  const validateTextField = (textNodeList, specialValidation = () => ({isValid:true}) ) => {
    const parentQuestionNode = getParentQuestionWrapperNode(textNodeList[0]);

    removeErrorMessageFromQuestion(parentQuestionNode);

    const isAnswerMissing = textNodeList[0].value.replace(/\s/g, "") === "";

    const { isValid, errorMessage } = specialValidation(textNodeList[0]);

    if(isAnswerMissing){
      appendErrorInQuestion(parentQuestionNode, "Este campo é requerido");
    }else if(!isValid){
      appendErrorInQuestion(parentQuestionNode, errorMessage);
    }

    const questionValid = !isAnswerMissing;

    return questionValid;
  };

  /**
   * Validate the `checkbox` type of question
   * @param {Array} checkboxNodeList - the `checkbox` type of question HTMLElement
   * @returns {boolean} true if the specific field passed the validation
   */
  const validateCheckboxField = checkboxNodeList => {
    const parentQuestionNode = getParentQuestionWrapperNode(checkboxNodeList[0]);

    removeErrorMessageFromQuestion(parentQuestionNode);

    const checkboxesArray = Array.from(checkboxNodeList);

    const checkedCheckbox = checkboxesArray.find(checkbox => checkbox.checked);

    const isAnswerMissing = !checkedCheckbox;

    if(isAnswerMissing){
      appendErrorInQuestion(parentQuestionNode, "Marque pelo menos uma opção");
    }

    const questionValid = !isAnswerMissing;

    return questionValid;
  };

  /**
   * Validate the `select` type of question
   * @param {Array} selectNodeList - the `select` type of question HTMLElement
   * @returns {boolean} true if the specific field passed the validation
   */
  const validateSelectField = ([ selectNode ]) => {
    const parentQuestionNode = getParentQuestionWrapperNode(selectNode);

    removeErrorMessageFromQuestion(parentQuestionNode);

    const isAnswerMissing = selectNode.value === "-1";

    if(isAnswerMissing){
      appendErrorInQuestion(parentQuestionNode, "Este campo é requirido");
    }

    const questionValid = !isAnswerMissing;

    return questionValid;
  };

  /**
   * Validates a single field based on it's type
   * @param {Object} questionField - Object containg field especifications
   * @param {Array} questionNodeList - Node representing the question node
   * @returns {boolean} true if the field passed the validation
   */
  const validateFormField = (questionField, questionNodeList) => {
    if(!questionField.required) return true;

    const {
      allow_multiple_value:$allowMultipleTypes,
      type:$type
    } = questionField;

    let isQuestionValid;
    switch($type){
      case "enumerable":{
        isQuestionValid = $allowMultipleTypes ?
          validateCheckboxField(questionNodeList)
          :
          validateSelectField(questionNodeList);
        break;
      }
      case "email":
        isQuestionValid =
          validateTextField(
            questionNodeList,
            emailNode => {
              const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
              return {
                isValid: emailRegex.test(emailNode.value),
                errorMessage: "Email inválido"
              };
            });
        break;
      case "big_text":
      case "lat_lng":
      case "small_text":
      case "phone":
        isQuestionValid = validateTextField(questionNodeList);
        break;
    }

    return isQuestionValid;
  };

  /**
   * Returns the value of the first node in the list
   * @param {Array} nodeList - A node list containing the `text` type node in it
   * @returns {string} value of the first node
   */
  const getTextFieldAnswer = ([ node ]) =>  null || node.value;

  /**
   * Returns the value of the first node in the list
   * @param {Array} nodeList - A node list containing the `select` type node in it
   * @returns {string} value of the first node
   */
  const getSelectFieldAnswer = ([ node ]) => node.value !== "-1" ? node.value : null;

  /**
   * Returns all selected values of the `checkbox`
   * @param {Array} checkboxNodes - A node list made of `checkbox` nodes
   * @returns {Array} all selected values
   */
  const getCheckboxFieldAnswer = checkboxNodes => {
    const checkboxesArray = Array.from(checkboxNodes);

    const answers = checkboxesArray.reduce((answers, checkbox) => {
      if(checkbox.checked) return [ ...answers, checkbox.value];
      else return answers;
    }, []);

    return answers.length ? answers : null;
  };

  /**
   * Choose the right handler for which type of question
   * @param {Object} questionField - Object containg field especifications
   * @param {Array} questionNodeList - An array of nodes representing the question's answer node
   * @returns {string||Array} the user's answer for the respective question
   */
  const getFieldAnswer = (questionField, questionNodeList) => {
    const {
      allow_multiple_value:$allowMultipleTypes,
      type:$type
    } = questionField;

    let fieldAnswer;
    switch($type){
      case "enumerable":{
        fieldAnswer = $allowMultipleTypes ?
          getCheckboxFieldAnswer(questionNodeList)
          :
          getSelectFieldAnswer(questionNodeList);
        break;
      }
      case "email":
      case "big_text":
      case "lat_lng":
      case "small_text":
      case "phone":
        fieldAnswer = getTextFieldAnswer(questionNodeList);
        break;
    }

    return fieldAnswer;
  };

  /**
   * Retrieves the answers from the form node
   * @param {Array} fields - Form's fields
   * @param {HTMLElement} form - Form's node
   * @returns {Object} the answers of the form node
   */
  const getFormAnswers = (fields, form) => {
    const answers = fields.reduce((answers, field) => {
      let fieldNode = form.querySelectorAll(`[name="${field.name}"]`);

      let fieldAnswer = {
        [field.name]: getFieldAnswer(field, fieldNode)
      };

      return Object.assign({}, answers, fieldAnswer);
    }, {} );

    return answers;
  };


  /**
   * An object to create forms from jsons
   * @param {HTMLElement} DOMElement - HTMLElement from the element where the form will be rendered
   * @param {string} jsonFile - URL to form's json
   */
  function FormCreator(DOMElement, configs){
    this.formWrapperNode = DOMElement;

    this.formPage = configs.formPage || "request";
    this.requestTab = configs.requestTab || null;
    this.userTab = configs.userTab || null;

    this.formQuestions = configs.formQuestions;

    this.onFormSubmitted = configs.onFormSubmitted || (() => {});

    this.requestFormButtonOptions = configs.requestFormButtonOptions || {
      text: "BUSCAR PROFISSIONAIS",
      clickHandler: (e) => {
        e.preventDefault();

        document.body.scrollTop = 0;

        if(this.isFormValid())
          this.setFormPage("user");
      }
    };

    this.userFormButtonOptions = configs.userFormButtonOptions || {
      text: "FINALIZAR",
      clickHandler: e => {
        e.preventDefault();

        document.body.scrollTop = 0;

        if(this.isFormValid())
          this.onFormSubmitted(this.getFormAnswers());
      }
    };

    this.mountFormNodes();
  }
  FormCreator.prototype = {
    setFormQuestions: function(questions){
      this.formQuestions = Object.assign({}, this.formQuestions, questions);
    },
    setFormPage: function(page){
      if(typeof page === "undefined") throw new TypeError("Argument `page` is missing.");

      if(page !== "request" && page !== "user") throw new Error("You didn't passed a valid page.");

      this.formPage = page;

      this.render();
    },
    getCurrentFormFields: function(){
      const {
        formQuestions:{
          request_fields,
          user_fields
        },
        formPage
      } = this;

      if(typeof formPage === "undefined") throw new TypeError("Your form page is missing");
      if(formPage !== "request" && formPage !== "user") throw new Error("Your form page is invalid");

      return formPage === "request" ? request_fields : user_fields;
    },
    getCurrentFormNode: function(){
      const {
        mountedForms:{
          requestForm,
          userForm
        },
        formPage
      } = this;

      if(typeof formPage === "undefined") throw new TypeError("Your form page is missing");
      if(formPage !== "request" && formPage !== "user") throw new Error("Your form page is invalid");

      return formPage === "request" ? requestForm : userForm;
    },
    isFormValid: function(){
      const form_fields = this.getCurrentFormFields();
      const form_node = this.getCurrentFormNode();

      const isValid = form_fields.reduce((valid, field) => {
        let fieldNode = form_node.querySelectorAll(`[name="${field.name}"]`);

        let isFieldValid = validateFormField(field, fieldNode);

        return valid && isFieldValid;
      }, true);

      return isValid;
    },
    mountFormNodes: function(){
      const {
        formQuestions:{
          request_fields,
          user_fields
        }
      } = this;

      this.mountedForms = {
        requestForm: createFormNode(request_fields, this.requestFormButtonOptions),
        userForm: createFormNode(user_fields, this.userFormButtonOptions)
      };
    },
    getFormAnswers: function(){
      const {
        mountedForms:{
          requestForm,
          userForm
        },
        formQuestions:{
          request_fields,
          user_fields
        }
      } = this;

      return {
        requestAnswers: getFormAnswers(request_fields, requestForm),
        userAnswers: getFormAnswers(user_fields, userForm)
      };
    },
    cleanFormNode: function(){
      // as seen here https://jsperf.com/innerhtml-vs-removechild 
      //  this approach is much faster than just setting innerHTML = ""
      const formNode = this.formWrapperNode;
      while(formNode.firstChild){
        formNode.removeChild(formNode.firstChild);
      }
    },
    setActiveTab: function(){
      const {
        requestTab,
        userTab,
        formPage
      } = this;

      if(typeof formPage === "undefined") throw new TypeError("Your form page is missing");
      if(formPage !== "request" && formPage !== "user") throw new Error("Your form page is invalid");

      if(formPage === "request"){
        requestTab.classList.add("_selected");
        userTab.classList.remove("_selected");
      }else{
        userTab.classList.add("_selected");
        requestTab.classList.remove("_selected");
      }
    },
    render: function(){
      this.cleanFormNode();

      const formNode = this.getCurrentFormNode();

      this.setActiveTab();

      this.formWrapperNode.appendChild(formNode);
    }
  };

  function formCreator(...args){
    return new FormCreator(...args);
  }

  global.modules.formCreator = {
    default:formCreator,
    treatFormData
  };

})(window);