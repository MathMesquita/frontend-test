(function(global){
  "use strict";

  if ( !global.modules ) global.modules = Object.create(null);

  global.modules.utils = {
    fetchJson: function(jsonFile){
      return new Promise((resolve, reject) => {
        fetch(jsonFile)
          .then(response => response.json())
          .then(resolve)
          .catch(reject);
      });
    }
  };


})(window);