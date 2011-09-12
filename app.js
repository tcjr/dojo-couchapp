var couchapp = require('couchapp'), 
    path = require('path');

ddoc = { 
  _id:'_design/SAMPLE-APP', 
  rewrites : [ 
    {from:"/", to:'index.html'},
    {from:"/api/", to:'../../'},     // maps to the current database
    {from:"/api/*", to:'../../*'},
    {from:"/*", to:'*'}
  ]
};

ddoc.views = {
  by_start_date: {
    map: function(doc) {
      if(doc.type === "my_doctype") {
        emit(doc.start, 1);
      }
    },
    reduce: function(keys, values) {
      return sum(values);
    }
  }
};

ddoc.lists = {
};


ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  } 
};

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;