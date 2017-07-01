import Async from 'async';

const middlewaresWrapper = middlewares => (req, res, next) => {
  const funcs = Array.isArray(middlewares) ? middlewares : [middlewares];

  Async.eachSeries(funcs, (func, cb) => {
    func(req, res, (err) => {
      if (err) {
        next(err);
      }
      cb(err);
    });
  });
};

export default middlewaresWrapper;
