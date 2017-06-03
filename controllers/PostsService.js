'use strict';

exports.doPost = (args, res, next) => {
  /**
   * Actions for the post
   *
   * id String Post id to view/save/share
   * action String Post id to view/save/share
   * returns Post
   **/
  let examples = {};
  examples['application/json'] = {
  "image" : "aeiou",
  "meta" : {
    "numShared" : 6,
    "numViewed" : 0,
    "numSaved" : 1
  },
  "id" : "aeiou",
  "source" : {
    "id" : "aeiou",
    "title" : "aeiou"
  },
  "title" : "aeiou",
  "content" : "aeiou",
  "url" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getPosts = (args, res, next) => {
  /**
   * Returns all posts available in the database
   *
   * sort String Sort the list of posts by property (optional)
   * limit Integer Limit number of posts return from server (optional)
   * page Integer How many rows to skip (optional)
   * query String Keywords to search (optional)
   * returns List
   **/
  let examples = {};
  examples['application/json'] = [ {
  "image" : "aeiou",
  "meta" : {
    "numShared" : 6,
    "numViewed" : 0,
    "numSaved" : 1
  },
  "id" : "aeiou",
  "source" : {
    "id" : "aeiou",
    "title" : "aeiou"
  },
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

exports.removeActivity = (args, res, next) => {
  /**
   * Remove action for the post
   *
   * id String Post id
   * action String Post id
   * returns Post
   **/
  let examples = {};
  examples['application/json'] = {
  "image" : "aeiou",
  "meta" : {
    "numShared" : 6,
    "numViewed" : 0,
    "numSaved" : 1
  },
  "id" : "aeiou",
  "source" : {
    "id" : "aeiou",
    "title" : "aeiou"
  },
  "title" : "aeiou",
  "content" : "aeiou",
  "url" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

