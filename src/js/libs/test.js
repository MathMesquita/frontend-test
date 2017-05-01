/* eslint no-console:0 */

(function(global){
  "use strict";

  function TestGroup(description){
    this.description = description;
    this.tests = [];
  }
  let TG = TestGroup.prototype = {
    addTest: function(input){
      let t = new TG.Test(input, this);
      this.tests = [ ...this.tests, t ];
      return t;
    },
    execute: function(){
      try{
        this.tests.forEach((t, index) => {
          console.log(`${t.verify()} - ${index+1}/${this.tests.length} - passed !`);
        });
        console.log(`All tests from "${this.description}" passed, well done !`);
      } catch(e) {
        console.error(e);
      }
    }
  };

  TG.Test = function(input, parent){
    this.input = input;
    this.parentGroup = parent;
  };
  TG.Test.prototype = {
    toEqual: function(expected){
      this.expected = expected;
    },
    verify: function(){
      const { input, expected, parentGroup } = this;
      if ( input === expected ) {
        return `${parentGroup.description}`;
      }else if( typeof input !== typeof expected ){
        throw new TypeError(`${parentGroup.description} did not passed, was expecting {${typeof expected}}(${expected}) but got {${typeof input}}(${input})`);
      }else{
        throw new Error(`${parentGroup.description} did not passed, was expecting {${typeof expected}}(${expected}) but got {${typeof input}}(${input})`);
      }
    }
  };

  function testGroup(description){
    const tg = new TestGroup(description);

    return {
      addTest: input => tg.addTest(input),
      executeTests: () => tg.execute()
    };
  }

  function describe(description, cb){
    const tg = testGroup(description);

    cb(tg.addTest, tg.executeTests);
  }

  global.describe = describe;
})(window);