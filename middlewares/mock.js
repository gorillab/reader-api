import { isMock } from '../helpers/mode';

const mock = data => (req, res, next) => {
  if (!isMock()) {
    return next();
  }

  return res.json(data);
};

export default mock;
