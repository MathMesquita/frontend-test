(function(global){
  "use strict";

  const {
    describe,
  } = global;

  const {
    createQuestionError,
    createFormNode
  } = global.modules.formComponents;

  describe("test if error component is mounted correctly", function(test, end){

    const message = "Um erro ocorreu";

    const errorNode = createQuestionError(message);

    test(errorNode.nodeName).toEqual("SPAN");
    test(errorNode.className).toEqual("briefing-questionError");
    test(errorNode.innerText).toEqual(message);

    end();
  });

  describe("test if form component is mounted correctly", function(test, end){

    const mock = [{
      "name": "lat_lng",
      "label": "Em que bairro será o serviço?",
      "type": "lat_lng",
      "placeholder": "",
      "required": true
    },{
      "name": "name",
      "label": "Nome",
      "type": "small_text",
      "placeholder": "",
      "required": true
    },{
      "name": "Informações Adicionais",
      "label": "Informações Adicionais",
      "type": "big_text",
      "placeholder": "Descreva o que você precisa",
      "required": false
    },{
      "reference": null,
      "name": "O serviço será para quantas pessoas?",
      "label": "O serviço será para quantas pessoas?",
      "placeholder": "O serviço será para quantas pessoas?",
      "mask": "indique o número de pessoas",
      "type": "enumerable",
      "required": false,
      "allow_multiple_value": false,
      "allow_custom_value": false,
      "values": {
        "1": "1",
        "2": "2",
        "Mais de 3": "Mais de 3"
      },
      "_embedded": {
        "nested_fields": []
      }
    },{
      "reference": null,
      "name": "Para quem será o serviço?",
      "label": "Para quem será o serviço?",
      "placeholder": "Para quem será o serviço?",
      "mask": "indique para quem será o serviço",
      "type": "enumerable",
      "required": false,
      "allow_multiple_value": true,
      "allow_custom_value": false,
      "values": {
        "Criança": "Criança",
        "Homem": "Homem",
        "Mulher": "Mulher"
      },
      "_embedded": {
        "nested_fields": []
      }
    }];

    const formNode = createFormNode(mock, {text:"test"});

    test(formNode.nodeName).toEqual("FIELDSET");
    test(formNode.className).toEqual("briefing-questionsContainer");

    // FIRST QUESTION CHILD
    const firstChild = formNode.querySelector(".briefing-question:nth-of-type(1)");
    test(firstChild.nodeName).toEqual("SECTION");

    const fcLabel = firstChild.querySelector("label");
    test(fcLabel.nodeName).toEqual("LABEL");
    test(fcLabel.className).toEqual("briefing-questionTitle");
    test(fcLabel.innerText).toEqual(mock[0].label);

    const fcInput = firstChild.querySelector("input");
    test(fcInput.nodeName).toEqual("INPUT");
    test(fcInput.className).toEqual("briefing-questionText --small");

    // THIRD QUESTION CHILD
    const secondChild = formNode.querySelector(".briefing-question:nth-of-type(3)");
    test(secondChild.nodeName).toEqual("SECTION");

    const scLabel = secondChild.querySelector("label");
    test(scLabel.nodeName).toEqual("LABEL");
    test(scLabel.className).toEqual("briefing-questionTitle");
    test(scLabel.innerText).toEqual(mock[2].label);

    const scInput = secondChild.querySelector("textarea");
    test(scInput.nodeName).toEqual("TEXTAREA");
    test(scInput.className).toEqual("briefing-questionTextarea");

    // since the objective of the test is to measure my skills
    //  i made only those tests to show how i could test
    //  que component mounted

    // with a better framework test it would be easier do test those things
    //  but external lib's weren't allowed and i needed to made mine

    end();
  });

})(window);