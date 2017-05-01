(function(global){
  "use strict";

  const
    describe = global.describe,
    document = global.document;

  const {
    treatFormData
  } = global.modules.formCreator;

  describe("test if it returns the `_embedded` data from response", function(test, end){

    const mock = {
      "_embedded": 123
    };

    test(treatFormData(mock)).toEqual(123);

    end();
  });

})(window);