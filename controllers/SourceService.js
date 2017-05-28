'use strict';

exports.allSource = function(args, res, next) {
  /**
   * Returns all sources available in the database
   *
   * sort String Sort the list of sources by property (optional)
   * limit String Limit number of sources return from server (optional)
   * page String How many rows to skip (optional)
   * query String Keywords to search (optional)
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ {
  "id" : "aeiou",
  "title" : "aeiou",
  "url" : "aeiou"
} ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.subscribeSource = function(args, res, next) {
  /**
   * Subscribe a source
   *
   * id String Source id to subscibe
   * returns Source
   **/
  var examples = {};
  examples['application/json'] = {
  "id" : "aeiou",
  "title" : "aeiou",
  "url" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.unSubscribe = function(args, res, next) {
  /**
   * Unsubscribe a source
   *
   * id String id of the source to delete
   * no response value expected for this operation
   **/
  res.end();
}

