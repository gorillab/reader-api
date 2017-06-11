export function loginByFacebook(args, res, next) {
  /**
   * Logs user into the system by facebook
   *
   * returns Error
   **/
  let examples = {};
  examples['application/json'] = {
  "code" : 0,
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

export function loginByFacebookCallback(args, res, next) {
  /**
   * Facebook call this api to return result of authentication
   *
   * returns Error
   **/
  let examples = {};
  examples['application/json'] = {
  "code" : 0,
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

export function logout(args, res, next) {
  /**
   * Logs out current logged in user session
   *
   * returns inline_response_200
   **/
  let examples = {};
  examples['application/json'] = {
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

