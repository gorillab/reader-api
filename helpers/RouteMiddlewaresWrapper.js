import eachSeries from 'async/eachSeries';

const middlewaresWrapper = middlewares => (req, res, next) => {
  const funcs = Array.isArray(middlewares) ? middlewares : [middlewares];

  eachSeries(funcs, (func, cb) => {
    func(req, res, (err) => {
      if (err) {
        next(err);
      }
      cb(err);
    });
  });
};

export default middlewaresWrapper;
