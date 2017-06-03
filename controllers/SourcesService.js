'use strict';

exports.getSources = (args, res, next) => {
  /**
   * Returns all sources available in the database
   *
   * sort String Sort the list of sources by property (optional)
   * limit Integer Limit number of sources return from server (optional)
   * page Integer How many rows to skip (optional)
   * query String Keywords to search (optional)
   * returns List
   **/
  let examples = {};
  examples['application/json'] = [ {
  "id" : "aeiou",
  "title" : "aeiou"
} ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.subscribe = (args, res, next) => {
  /**
   * Subscribe a source
   *
   * id String Source id to subscibe
   * returns Source
   **/
  let examples = {};
  examples['application/json'] = {
  "id" : "aeiou",
  "title" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.unsubscribe = (args, res, next) => {
  /**
   * Unsubscribe a source
   *
   * id String id of the source to delete
   * no response value expected for this operation
   **/
  res.end();
}

