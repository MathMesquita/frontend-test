(function(global){
  "use strict";

  const describe = global.describe;

  const { getLastIndex } = global.utils;

  describe("test if it returns last index from an array", function(test, end){

    const mock = [1, 2, 3, 4];

    test(getLastIndex(mock)).toEqual(3);

    end();
  });

})(window);