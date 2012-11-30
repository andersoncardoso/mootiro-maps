(function() {

  define(['jquery', 'authentication/router'], function($, auth_router) {
    requirejs.onError = function(err) {
      if (err.requireType === 'timeout') {
        return require(['utils'], function() {
          errorMessage('Timeout', "Ocorreu uma falha ao carregar alguns serviços externos. Partes do Mootiro Maps poderão não funcionar corretamente.");
          return typeof console !== "undefined" && console !== null ? console.error(err) : void 0;
        });
      } else {
        throw err;
      }
    };
    return $(function() {
      var loginApp;
      return loginApp = new auth_router.LoginApp({});
    });
  });

}).call(this);
