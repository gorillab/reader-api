'use strict';

exports.getUserSavedPost = function(args, res, next) {
  /**
   * Returns all saved post of user available in the database
   *
   * sort String Sort the list of posts by property (optional)
   * limit String Limit number of posts return from server (optional)
   * page String How many rows to skip (optional)
   * query String Keywords to search (optional)
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ {
  "image" : "aeiou",
  "meta" : {
    "numShared" : 6,
    "numViewed" : 0,
    "numSaved" : 1
  },
  "id" : "aeiou",
  "source" : "aeiou",
  "title" : "aeiou",
  "content" : "aeiou",
  "url" : "aeiou"
} ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getUserSource = function(args, res, next) {
  /**
   * Returns all sources of user available in the database
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

