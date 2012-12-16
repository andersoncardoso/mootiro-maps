(function() {

  define(function(require) {
    var render, start;
    render = function() {
      $('#action-bar').empty();
      $('#main-content').empty();
      $('#sidebar').empty();
      return true;
    };
    start = function() {};
    return {
      start: start,
      render: render
    };
  });

}).call(this);
