dojo.provide('tcjr.CouchStore');
dojo.require('dojo.store.util.QueryResults')

dojo.declare('tcjr.CouchStore', null, {
	// summary:
	//		This is a store for communicating with Couch database.  It implements dojo.store.api.Store
  
  constructor: function(options){
  		// summary:
  		//		This is a store for communicating with Couch database.
  		// options:
  		//		This provides any configuration information that will be mixed into the store
  		dojo.safeMixin(this, options);
  	},
    // database: String
  	//		The target base database to use for all requests to the server. This string will be
  	// 	prepended to all requests sent to the server.  (E.g.: '/mydatabase/')
  	database: "", 
  
  	idProperty: "_id",
  	queryEngine: null,
  	
  	get: function(id, options) {
      //	summary:
  		//		Retrieves an object by its identity. This will trigger a GET request to the server using
  		//		the url `this.target + id`.
  		//	id: String
  		//		The identity to use to lookup the object
  		//	returns: Object
  		//		The object in the store that matches the given id.
  		var headers = options || {};
    	headers.Accept = this.accepts;
    	return dojo.xhr("GET", {
    		url:this.database + id,
    		handleAs: "json",
    		headers: headers
    	});  	  
  	},
  	
  	accepts: "application/javascript, application/json",

  	getIdentity: function(object) {
  	  return object[this.idProperty];
  	},
  	
  	put: function(object, options){
  	  throw "Not implemented - read-only store";
    },

  	add: function(objective, directives) {
  	  throw "Not implemented - read-only store";
  	},
  	
  	remove: function(id) {
  	  // revision is required for couch delete
  	  throw "Not implemented - read-only store";
  	},
  	
  	query: function(query, options) {
  	  var content_opts = options || {};
  	  var docsOnly = false;
  	  if ("docs_only" in content_opts) {
  	    docsOnly = true;
  	    content_opts.include_docs = true;
  	    delete content_opts.docs_only;
  	  }
  	  
  	  if ("count" in content_opts) {
  	    content_opts.limit = content_opts.count;
  	    delete content_opts.count;
  	  }
  	  if ("start" in content_opts) {
  	    content_opts.skip = content_opts.start;
  	    delete content_opts.start;
  	  }
  	  
  	  if (query && typeof query == "object") {
  	    var query_url = query['view'] || '';
  	    var response = dojo.xhr("GET", {
  	      url: this.database + query_url,
      		handleAs: "json",
  	      content: content_opts
  	    });
  	    
  	    // Response from couch looks like this:    { total_rows:N, rows: [ ... ] }
  	    
  	    var data = response.then( docsOnly ? this._docsOnlyViewHandler : this._standardViewHandler );
  	    return dojo.store.util.QueryResults(data);
  	    
  	  } else {
  	    throw "query object expected"
  	  }
  	},
  	
    // Standard handling.
    //   return the "rows" data from couch
  	_standardViewHandler: function(resp) {
      // add total property to the array
  	  resp.rows.total = resp.total_rows;
  	  return resp.rows;
  	},
  	
    // Document-only handling.
    //   return an array of just the doc from each couch row, not the view row
    _docsOnlyViewHandler: function(resp) {
      // get just the docs
      var docs = dojo.map(resp.rows, function(row) { return row.doc; });
      // add total property to the array
      docs.total = resp.total_rows;
      return docs;
    }
  
});

