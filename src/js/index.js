/* eslint no-console:0 */

(function(global){
  "use strict";

  const document = global.document;

  const {
    default:formCreator,
    treatFormData
  } = global.modules.formCreator;

  const {
    fetchJson
  } = global.modules.utils;

  const formNode = document.getElementById("briefing-form");

  fetchJson("../fields.json")
    .then(treatFormData)
    .then(formQuestions => {

      const
        requestTab = document.querySelector("#requestTab"),
        userTab = document.querySelector("#userTab"),
        form = formCreator(formNode, {
          formQuestions,
          requestTab,
          userTab,
          onFormSubmitted: answers => {
            console.log(answers);
          }
        });

      form.render();
    });

})(window);