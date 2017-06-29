// extend updates
const mongooseDocExtend = function (schema) {
  schema.method('extend', function (source) {
    Object.assign(this, source);
    Object.keys(source).forEach(this.markModified);

    return this;
  });
};

export default mongooseDocExtend;
