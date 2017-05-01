(function(global){
  "use strict";

  const describe = global.describe;

  describe("test if test lib is working", function(test, end){

    test("abc").toEqual("abc");
    test(3).toEqual(3);

    end();
  });
})(window);