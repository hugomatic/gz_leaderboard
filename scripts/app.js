(function(document) {
  'use strict';

  document.addEventListener('polymer-ready', function() {
    // Perform some behaviour
    console.log('polymer-ready');
    var tmpl = document.querySelector("#tmpl");
    tmpl.title = "Simulation leaderboard";
    tmpl.selected = 0;
  });

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));
