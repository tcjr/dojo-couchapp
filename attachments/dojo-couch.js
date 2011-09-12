
(function(_d) {
  var _couch = {};

  var xhr_defaults = {
    handleAs: 'json'
  };

  _couch.get = function(opts) {
    return _d.xhrGet( _d.mixin(_d.clone(xhr_defaults),opts) );
  };
  
  _couch.session = function() {
    return _couch.get({url: '/_session'});
  }
  
  window.couch = _couch;
  
})(dojo);
