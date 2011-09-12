dojo.provide('tcjr.Page');

dojo.require('dojox.dtl');
dojo.require('dojox.dtl.Context');
dojo.require('dojox.dtl.tag.logic');

dojo.declare('tcjr.Page', [], {
  
  _templates: {},

  _getTemplate: function(templateId) {
    var tmpl = this._templates[templateId];
    
    if (!tmpl) {
      var node = dojo.byId('tmpl-' + templateId);
      if (!node) {
        console.error("template node tmpl-%s not found", templateId);
        return null;
      }
      var tmpl = new dojox.dtl.Template(node.innerHTML);
      this._templates[templateId] = tmpl;
    }
    return tmpl;
  },

  renderTo: function(templateId, data, targetNode) {
    var tmpl = this._getTemplate(templateId)
    //dojo.byId(targetNode).innerHTML = dojo.string.substitute(tmplTxt, data);
    dojo.byId(targetNode).innerHTML = tmpl.render( new dojox.dtl.Context(data) );
  }
  
  
});


